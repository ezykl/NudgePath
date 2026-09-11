import prisma from "@/lib/db";
import { extractBearerToken, verifyApiToken } from "./jwt";

export interface AuthenticatedUser {
  id: string;
  email: string;
  name: string;
}

export async function getAuthenticatedApiUser(req: Request): Promise<AuthenticatedUser | null> {
  const rawToken = extractBearerToken(req);
  if (!rawToken) return null;

  const payload = verifyApiToken(rawToken);
  if (!payload || !payload.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return user;
}
