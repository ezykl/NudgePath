import crypto from "crypto";

const getSecret = () => process.env.AUTH_SECRET || "nudgepath-default-mobile-secret-change-me";

export interface MobileTokenPayload {
  userId: string;
  email: string;
  exp?: number;
}

export function signApiToken(payload: Omit<MobileTokenPayload, "exp">, expiresInDays = 60): string {
  const secret = getSecret();
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Date.now() + expiresInDays * 24 * 60 * 60 * 1000;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const data = `${header}.${body}`;
  const sig = crypto.createHmac("sha256", secret).update(data).digest("base64url");
  return `${data}.${sig}`;
}

export function verifyApiToken(token: string): MobileTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts;
    const secret = getSecret();
    const expectedSig = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");

    if (sig !== expectedSig) return null;

    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as MobileTokenPayload;
    if (payload.exp && payload.exp < Date.now()) {
      return null; // Expired
    }
    return payload;
  } catch {
    return null;
  }
}

export function extractBearerToken(req: Request): string | null {
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  return authHeader.slice(7).trim();
}
