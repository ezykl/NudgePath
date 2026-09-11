import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedApiUser } from "@/lib/api/auth";
import {
  resolveLocation,
  resolveJobStatus,
  resolveJobType,
  resolveWorkplaceType,
  resolveTags,
  JobResolutionError,
} from "@/lib/jobs/resolve";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedApiUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const job = await prisma.job.findUnique({
      where: {
        id,
        userId: user.id,
      },
      include: {
        JobTitle: { select: { id: true, label: true, value: true } },
        Company: { select: { id: true, label: true, value: true, logoUrl: true } },
        Location: { select: { id: true, label: true, value: true } },
        JobSource: { select: { id: true, label: true, value: true } },
        Status: { select: { id: true, label: true, value: true } },
        tags: { select: { id: true, label: true, value: true } },
        Notes: {
          select: { id: true, content: true, createdAt: true, updatedAt: true },
          orderBy: { createdAt: "desc" },
        },
        Interview: {
          include: {
            interviewers: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: job });
  } catch (error) {
    console.error("[API v1 Job Details GET] Error:", error);
    return NextResponse.json({ error: "Failed to fetch job details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedApiUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.job.findUnique({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updateData: any = {};

    if (body.status !== undefined) {
      updateData.statusId = await resolveJobStatus(body.status);
    }

    if (body.applied !== undefined) {
      updateData.applied = Boolean(body.applied);
      if (body.applied && !existing.appliedDate && !body.appliedDate) {
        updateData.appliedDate = new Date();
      }
    }

    if (body.appliedDate !== undefined) {
      updateData.appliedDate = body.appliedDate ? new Date(body.appliedDate) : null;
    }

    if (body.dueDate !== undefined) {
      updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null;
    }

    if (body.salaryRange !== undefined) {
      updateData.salaryRange = body.salaryRange?.trim() || null;
    }

    if (body.description !== undefined) {
      updateData.description = body.description.trim();
    }

    if (body.jobUrl !== undefined) {
      updateData.jobUrl = body.jobUrl?.trim() || null;
    }

    if (body.type !== undefined) {
      updateData.jobType = resolveJobType(body.type);
    }

    if (body.workplaceType !== undefined) {
      updateData.workplaceType = resolveWorkplaceType(body.workplaceType);
    }

    if (body.location !== undefined) {
      if (body.location && body.location.trim()) {
        const loc = await resolveLocation(body.location.trim(), user.id);
        updateData.locationId = loc.id;
      } else {
        updateData.locationId = null;
      }
    }

    if (Array.isArray(body.tags)) {
      const { resolved } = await resolveTags(body.tags, user.id, 10);
      updateData.tags = {
        set: resolved.map((t) => ({ id: t.id })),
      };
    }

    const updatedJob = await prisma.job.update({
      where: { id, userId: user.id },
      data: updateData,
      include: {
        JobTitle: { select: { id: true, label: true, value: true } },
        Company: { select: { id: true, label: true, value: true, logoUrl: true } },
        Location: { select: { id: true, label: true, value: true } },
        JobSource: { select: { id: true, label: true, value: true } },
        Status: { select: { id: true, label: true, value: true } },
        tags: { select: { id: true, label: true, value: true } },
      },
    });

    return NextResponse.json({ success: true, data: updatedJob });
  } catch (error: any) {
    if (error instanceof JobResolutionError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("[API v1 Job PATCH] Error:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedApiUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.job.findUnique({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    await prisma.job.delete({
      where: { id, userId: user.id },
    });

    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("[API v1 Job DELETE] Error:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}
