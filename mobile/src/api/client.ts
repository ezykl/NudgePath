import { Job, JobStatus, User } from "../types";

export interface ApiClientConfig {
  baseUrl: string;
  token: string | null;
}

class ApiClient {
  private baseUrl: string = "";
  private token: string | null = null;

  configure(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, "");
    this.token = config.token;
  }

  getBaseUrl() {
    return this.baseUrl;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (!this.baseUrl) {
      throw new Error("API client is not configured with a server URL");
    }

    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      const errorMsg = data?.error || `Request failed with status ${res.status}`;
      throw new Error(typeof errorMsg === "object" ? JSON.stringify(errorMsg) : errorMsg);
    }

    return data as T;
  }

  // Auth
  async login(serverUrl: string, email: string, password: string): Promise<{ token: string; user: User }> {
    const cleanUrl = serverUrl.replace(/\/+$/, "");
    const res = await fetch(`${cleanUrl}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data?.error || "Login failed");
    }
    return { token: data.token, user: data.user };
  }

  async verifyToken(serverUrl: string, token: string): Promise<User> {
    const cleanUrl = serverUrl.replace(/\/+$/, "");
    const res = await fetch(`${cleanUrl}/api/v1/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error("Invalid or expired session token");
    }
    return data.user;
  }

  // Jobs
  async getJobs(params: { status?: string; search?: string; page?: number; limit?: number } = {}) {
    const query = new URLSearchParams();
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const queryString = query.toString();
    const path = `/api/v1/jobs${queryString ? `?${queryString}` : ""}`;
    return this.request<{ success: boolean; data: Job[]; pagination: any }>(path);
  }

  async getJob(id: string): Promise<Job> {
    const res = await this.request<{ success: boolean; data: Job }>(`/api/v1/jobs/${id}`);
    return res.data;
  }

  async createJob(payload: {
    title: string;
    company: string;
    status?: string;
    location?: string;
    source?: string;
    salaryRange?: string;
    description?: string;
    jobUrl?: string;
    applied?: boolean;
    tags?: string[];
  }): Promise<Job> {
    const res = await this.request<{ success: boolean; data: Job }>("/api/v1/jobs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  async updateJob(id: string, payload: Partial<Job> & { status?: string }): Promise<Job> {
    const res = await this.request<{ success: boolean; data: Job }>(`/api/v1/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  async deleteJob(id: string): Promise<void> {
    await this.request(`/api/v1/jobs/${id}`, { method: "DELETE" });
  }

  // Statuses
  async getStatuses(): Promise<JobStatus[]> {
    const res = await this.request<{ success: boolean; data: JobStatus[] }>("/api/v1/statuses");
    return res.data;
  }

  // Regional Scraper / URL Auto-fill
  async parseJobUrl(url: string) {
    return this.request<{
      success: boolean;
      data: {
        title: string;
        company: string;
        location?: string;
        salary?: string;
        description?: string;
        url: string;
        isRemote?: boolean;
        workplaceType?: string;
      };
    }>("/api/v1/jobs/parse-url", {
      method: "POST",
      body: JSON.stringify({ url }),
    });
  }
}

export const api = new ApiClient();
