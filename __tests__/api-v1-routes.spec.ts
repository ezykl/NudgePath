import { describe, it, expect, vi, beforeEach } from "vitest";
import { signApiToken, verifyApiToken, extractBearerToken } from "@/lib/api/jwt";

vi.mock("@/lib/db", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    job: {
      findMany: vi.fn(),
      count: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    jobStatus: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    company: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    jobTitle: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    location: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    jobSource: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    tag: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock("bcryptjs", () => ({
  default: {
    compare: vi.fn(),
  },
}));

vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { POST as loginRoute } from "@/app/api/v1/auth/login/route";
import { GET as meRoute } from "@/app/api/v1/auth/me/route";
import { GET as statusesRoute } from "@/app/api/v1/statuses/route";
import { GET as getJobsRoute, POST as postJobsRoute } from "@/app/api/v1/jobs/route";
import { GET as getJobRoute, PATCH as patchJobRoute, DELETE as deleteJobRoute } from "@/app/api/v1/jobs/[id]/route";
import { GET as pairRoute } from "@/app/api/v1/pair/route";

describe("NudgePath Mobile API v1 & JWT Engine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("JWT signing and verification", () => {
    it("should sign and verify valid token", () => {
      const token = signApiToken({ userId: "u123", email: "test@nudgepath.com" });
      expect(typeof token).toBe("string");

      const payload = verifyApiToken(token);
      expect(payload).not.toBeNull();
      expect(payload?.userId).toBe("u123");
      expect(payload?.email).toBe("test@nudgepath.com");
    });

    it("should reject tampered token", () => {
      const token = signApiToken({ userId: "u123", email: "test@nudgepath.com" });
      const tampered = token.slice(0, -5) + "abcde";
      expect(verifyApiToken(tampered)).toBeNull();
    });

    it("should reject expired token", () => {
      const token = signApiToken({ userId: "u123", email: "test@nudgepath.com" }, -1);
      expect(verifyApiToken(token)).toBeNull();
    });

    it("should extract bearer token from Request headers", () => {
      const req = new Request("http://localhost/api/test", {
        headers: { Authorization: "Bearer secret-token-xyz" },
      });
      expect(extractBearerToken(req)).toBe("secret-token-xyz");

      const noAuth = new Request("http://localhost/api/test");
      expect(extractBearerToken(noAuth)).toBeNull();
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("returns 400 when missing email or password", async () => {
      const req = new Request("http://localhost/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "" }),
      });
      const res = await loginRoute(req);
      expect(res.status).toBe(400);
    });

    it("returns 401 when user not found or password mismatch", async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);
      const req = new Request("http://localhost/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "notfound@nudgepath.com", password: "pwd" }),
      });
      const res = await loginRoute(req);
      expect(res.status).toBe(401);
    });

    it("returns 200 with JWT and user data on valid login", async () => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: "u1",
        email: "user@nudgepath.com",
        name: "Test User",
        password: "hashedpassword",
      });
      (bcrypt.compare as any).mockResolvedValue(true);

      const req = new Request("http://localhost/api/v1/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: "user@nudgepath.com", password: "correct" }),
      });
      const res = await loginRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.token).toBeDefined();
      expect(json.user.email).toBe("user@nudgepath.com");
    });
  });

  describe("Authenticated Endpoints", () => {
    const validToken = signApiToken({ userId: "u1", email: "user@nudgepath.com" });
    const authHeaders = { Authorization: `Bearer ${validToken}` };

    beforeEach(() => {
      (prisma.user.findUnique as any).mockResolvedValue({
        id: "u1",
        email: "user@nudgepath.com",
        name: "Test User",
      });
    });

    it("GET /api/v1/auth/me returns 401 without auth", async () => {
      const req = new Request("http://localhost/api/v1/auth/me");
      const res = await meRoute(req);
      expect(res.status).toBe(401);
    });

    it("GET /api/v1/auth/me returns 200 with authenticated user", async () => {
      const req = new Request("http://localhost/api/v1/auth/me", { headers: authHeaders });
      const res = await meRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.user.id).toBe("u1");
    });

    it("GET /api/v1/statuses returns statuses list", async () => {
      (prisma.jobStatus.findMany as any).mockResolvedValue([
        { id: "s1", label: "Draft", value: "draft" },
        { id: "s2", label: "Applied", value: "applied" },
      ]);
      const req = new Request("http://localhost/api/v1/statuses", { headers: authHeaders });
      const res = await statusesRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.length).toBe(2);
    });

    it("GET /api/v1/jobs returns paginated job list", async () => {
      (prisma.job.findMany as any).mockResolvedValue([
        { id: "j1", description: "Engineer role", applied: false, Status: { label: "Draft", value: "draft" } },
      ]);
      (prisma.job.count as any).mockResolvedValue(1);

      const req = new Request("http://localhost/api/v1/jobs?page=1&limit=10", { headers: authHeaders });
      const res = await getJobsRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.length).toBe(1);
      expect(json.pagination.total).toBe(1);
    });

    it("POST /api/v1/jobs creates a new job with entity resolution", async () => {
      (prisma.company.findUnique as any).mockResolvedValue({ id: "c1", label: "Acme Corp" });
      (prisma.jobTitle.findUnique as any).mockResolvedValue({ id: "t1", label: "Senior Engineer" });
      (prisma.jobStatus.findUnique as any).mockResolvedValue({ id: "st1", label: "Applied", value: "applied" });
      (prisma.job.create as any).mockResolvedValue({ id: "job-new-1" });
      (prisma.job.findUnique as any).mockResolvedValue({
        id: "job-new-1",
        description: "Great role",
        Company: { label: "Acme Corp" },
        JobTitle: { label: "Senior Engineer" },
      });

      const req = new Request("http://localhost/api/v1/jobs", {
        method: "POST",
        headers: { ...authHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Senior Engineer",
          company: "Acme Corp",
          status: "applied",
          description: "Great role",
        }),
      });

      const res = await postJobsRoute(req);
      expect(res.status).toBe(201);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.data.id).toBe("job-new-1");
    });

    it("GET /api/v1/jobs/[id] returns job details", async () => {
      (prisma.job.findUnique as any).mockResolvedValue({
        id: "j1",
        userId: "u1",
        description: "Test job",
        Company: { label: "Acme" },
      });

      const req = new Request("http://localhost/api/v1/jobs/j1", { headers: authHeaders });
      const res = await getJobRoute(req, { params: Promise.resolve({ id: "j1" }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.data.id).toBe("j1");
    });

    it("DELETE /api/v1/jobs/[id] deletes user job", async () => {
      (prisma.job.findUnique as any).mockResolvedValue({ id: "j1", userId: "u1" });
      (prisma.job.delete as any).mockResolvedValue({ id: "j1" });

      const req = new Request("http://localhost/api/v1/jobs/j1", {
        method: "DELETE",
        headers: authHeaders,
      });
      const res = await deleteJobRoute(req, { params: Promise.resolve({ id: "j1" }) });
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
    });

    it("GET /api/v1/pair generates pairing payload and QR string", async () => {
      const req = new Request("http://localhost:3737/api/v1/pair", {
        headers: { ...authHeaders, host: "192.168.1.100:3737" },
      });
      const res = await pairRoute(req);
      expect(res.status).toBe(200);
      const json = await res.json();
      expect(json.success).toBe(true);
      expect(json.pairing.serverUrl).toContain("192.168.1.100:3737");
      expect(json.pairing.token).toBeDefined();
      expect(json.qrString).toBeDefined();
    });
  });
});
