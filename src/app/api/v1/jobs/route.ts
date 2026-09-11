import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedApiUser } from "@/lib/api/auth";
import { createJobRecord } from "@/lib/jobs/createJobRecord";
import {
  resolveCompany,
  resolveJobTitle,
  resolveLocation,
  resolveJobSource,
  resolveJobStatus,
  resolveJobType,
  resolveWorkplaceType,
  resolveTags,
  JobResolutionError,
} from "@/lib/jobs/resolve";

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedApiUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const skip = (page - 1) * limit;

    const status = searchParams.get("status")?.trim();
    const search = searchParams.get("search")?.trim();
    const appliedOnly = searchParams.get("appliedOnly") === "true";
    const company = searchParams.get("company")?.trim();

    const where: any = {
      userId: user.id,
      AND: [
        {
          OR: [{ discoveryStatus: null }, { discoveryStatus: { not: "dismissed" } }],
        },
      ],
    };

    if (status) {
      where.Status = { value: status.toLowerCase() };
    }

    if (company) {
      where.Company = { value: company.toLowerCase() };
    }

    if (appliedOnly) {
      where.applied = true;
    }

    if (search) {
      where.OR = [
        { JobTitle: { label: { contains: search } } },
        { Company: { label: { contains: search } } },
        { Location: { label: { contains: search } } },
        { JobSource: { label: { contains: search } } },
        { description: { contains: search } },
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          JobTitle: { select: { id: true, label: true, value: true } },
          Company: { select: { id: true, label: true, value: true, logoUrl: true } },
          Location: { select: { id: true, label: true, value: true } },
          JobSource: { select: { id: true, label: true, value: true } },
          Status: { select: { id: true, label: true, value: true } },
          tags: { select: { id: true, label: true, value: true } },
          _count: {
            select: {
              Notes: true,
              Interview: true,
            },
          },
        },
      }),
      prisma.job.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: jobs,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("[API v1 Jobs GET] Error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getAuthenticatedApiUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      company,
      location,
      source,
      status,
      type,
      workplaceType,
      salaryRange,
      description = "",
      jobUrl,
      applied = false,
      appliedDate,
      dueDate,
      tags = [],
    } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }
    if (!company || typeof company !== "string" || !company.trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    // Resolve entities deterministically
    const [resolvedCompany, resolvedTitle] = await Promise.all([
      resolveCompany(company.trim(), user.id),
      resolveJobTitle(title.trim(), user.id),
    ]);

    let locationId: string | null = null;
    if (location && typeof location === "string" && location.trim()) {
      const loc = await resolveLocation(location.trim(), user.id);
      locationId = loc.id;
    }

    let jobSourceId: string | null = null;
    if (source && typeof source === "string" && source.trim()) {
      const src = await resolveJobSource(source.trim(), user.id);
      jobSourceId = src.id;
    }

    const statusId = await resolveJobStatus(status);
    const resolvedType = resolveJobType(type);
    const resolvedWorkplace = resolveWorkplaceType(workplaceType);

    let tagIds: string[] = [];
    if (Array.isArray(tags) && tags.length > 0) {
      const { resolved } = await resolveTags(tags, user.id, 10);
      tagIds = resolved.map((t) => t.id);
    }

    const createdJob = await createJobRecord({
      jobTitleId: resolvedTitle.id,
      companyId: resolvedCompany.id,
      locationId,
      jobSourceId,
      statusId,
      jobType: resolvedType,
      workplaceType: resolvedWorkplace,
      salaryRange: salaryRange?.trim() || null,
      description: description.trim(),
      jobUrl: jobUrl?.trim() || null,
      applied: Boolean(applied),
      appliedDate: appliedDate ? new Date(appliedDate) : null,
      dueDate: dueDate ? new Date(dueDate) : null,
      userId: user.id,
      tagIds,
      createdVia: "mobile-api",
    });

    // Re-fetch complete joined record
    const fullJob = await prisma.job.findUnique({
      where: { id: createdJob.id },
      include: {
        JobTitle: { select: { id: true, label: true, value: true } },
        Company: { select: { id: true, label: true, value: true, logoUrl: true } },
        Location: { select: { id: true, label: true, value: true } },
        JobSource: { select: { id: true, label: true, value: true } },
        Status: { select: { id: true, label: true, value: true } },
        tags: { select: { id: true, label: true, value: true } },
      },
    });

    return NextResponse.json({ success: true, data: fullJob }, { status: 201 });
  } catch (error: any) {
    if (error instanceof JobResolutionError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[API v1 Jobs POST] Error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
