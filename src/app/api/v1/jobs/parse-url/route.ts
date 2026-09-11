import { NextResponse } from "next/server";
import { getAuthenticatedApiUser } from "@/lib/api/auth";
import { getCurrentUser } from "@/utils/user.utils";
import { scrapeJobFromUrl } from "@/lib/scraper/regional/universal";

export async function POST(req: Request) {
  try {
    // Authenticate via mobile Bearer token or web session
    let user = await getAuthenticatedApiUser(req);
    if (!user) {
      user = await getCurrentUser();
    }
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { url } = body;

    if (!url || typeof url !== "string" || !url.trim()) {
      return NextResponse.json({ error: "A valid job URL is required" }, { status: 400 });
    }

    const result = await scrapeJobFromUrl(url.trim());
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 422 });
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("[API v1 Parse URL] Error:", error);
    return NextResponse.json({ error: "Failed to parse job URL" }, { status: 500 });
  }
}
