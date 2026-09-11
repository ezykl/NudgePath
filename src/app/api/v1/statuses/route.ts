import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getAuthenticatedApiUser } from "@/lib/api/auth";

export async function GET(req: Request) {
  try {
    const user = await getAuthenticatedApiUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const statuses = await prisma.jobStatus.findMany({
      select: {
        id: true,
        label: true,
        value: true,
      },
      orderBy: {
        value: "asc",
      },
    });

    return NextResponse.json({ success: true, data: statuses });
  } catch (error) {
    console.error("[API v1 Statuses] Error:", error);
    return NextResponse.json({ error: "Failed to fetch statuses" }, { status: 500 });
  }
}
