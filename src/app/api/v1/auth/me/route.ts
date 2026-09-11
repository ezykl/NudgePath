import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { extractBearerToken, verifyApiToken } from "@/lib/api/jwt";

export async function GET(req: Request) {
  try {
    const rawToken = extractBearerToken(req);
    if (!rawToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyApiToken(rawToken);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        defaultResumeId: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("[API v1 Auth Me] Error:", error);
    return NextResponse.json({ error: "Failed to fetch user profile" }, { status: 500 });
  }
}
