import { NextResponse } from "next/server";
import { getCurrentUser } from "@/utils/user.utils";
import { getAuthenticatedApiUser } from "@/lib/api/auth";
import { signApiToken } from "@/lib/api/jwt";

export async function GET(req: Request) {
  try {
    // 1. Try web session first (user viewing settings in browser)
    let user = await getCurrentUser();

    // 2. If no cookie session, try Bearer API token
    if (!user) {
      user = await getAuthenticatedApiUser(req);
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Determine public server URL
    const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || (host?.includes("localhost") ? "http" : "https");
    const detectedUrl = host ? `${proto}://${host}` : (process.env.NEXTAUTH_URL || "http://localhost:3737");

    // Generate a long-lived mobile API token (60 days)
    const token = signApiToken({
      userId: user.id,
      email: user.email,
    }, 60);

    const pairingPayload = {
      version: 1,
      appName: "NudgePath",
      serverUrl: detectedUrl,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      pairing: pairingPayload,
      qrString: JSON.stringify(pairingPayload),
    });
  } catch (error) {
    console.error("[API v1 Pair GET] Error:", error);
    return NextResponse.json({ error: "Failed to generate pairing data" }, { status: 500 });
  }
}
