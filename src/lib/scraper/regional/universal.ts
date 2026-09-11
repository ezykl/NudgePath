import type { JobDetails, ScraperResult } from "../types";
import { extractJsonLdJob } from "./jsonLdParser";

const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

export function extractMetaTag(html: string, nameOrProp: string): string | null {
  const regex = new RegExp(
    `<meta\\s+[^>]*(?:name|property)=["']${nameOrProp}["'][^>]*content=["']([^"']*)["']`,
    "i"
  );
  const match = regex.exec(html);
  if (match && match[1]) return match[1].trim();

  // Alternative attribute order: content="..." property="..."
  const altRegex = new RegExp(
    `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*(?:name|property)=["']${nameOrProp}["']`,
    "i"
  );
  const altMatch = altRegex.exec(html);
  return altMatch && altMatch[1] ? altMatch[1].trim() : null;
}

export function extractHtmlTitle(html: string): string {
  const match = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  if (!match || !match[1]) return "";
  return match[1].replace(/\s+/g, " ").trim();
}

export async function scrapeJobFromUrl(url: string): Promise<ScraperResult<JobDetails>> {
  try {
    const parsedUrl = new URL(url);
    if (!/^https?:$/.test(parsedUrl.protocol)) {
      return {
        success: false,
        error: { type: "parse", message: "Invalid URL protocol. Only HTTP and HTTPS are supported." },
      };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": BROWSER_USER_AGENT,
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
    });
    clearTimeout(timer);

    if (res.status === 403 || res.status === 401) {
      return {
        success: false,
        error: { type: "blocked", reason: `Access forbidden (${res.status}) by target site.` },
      };
    }

    if (res.status === 429) {
      return {
        success: false,
        error: { type: "rate_limited", retryAfter: 30 },
      };
    }

    if (!res.ok) {
      return {
        success: false,
        error: { type: "network", message: `HTTP request failed with status ${res.status}` },
      };
    }

    const html = await res.text();

    // 1. Try structured JSON-LD first (standard on JobStreet, Seek, Indeed, LinkedIn)
    const jsonLdJob = extractJsonLdJob(html, url);
    if (jsonLdJob && jsonLdJob.title && jsonLdJob.company) {
      return { success: true, data: jsonLdJob };
    }

    // 2. Fallback to OpenGraph / HTML metadata extraction
    const ogTitle = extractMetaTag(html, "og:title") || extractHtmlTitle(html);
    const ogDescription =
      extractMetaTag(html, "og:description") ||
      extractMetaTag(html, "description") ||
      "";
    const ogSite = extractMetaTag(html, "og:site_name") || parsedUrl.hostname;

    // Split title heuristics (e.g. "Senior Frontend Developer at Stripe - San Francisco, CA")
    let title = ogTitle;
    let company = ogSite;
    let location = "";

    if (ogTitle.includes(" at ")) {
      const parts = ogTitle.split(" at ");
      title = parts[0].trim();
      const afterAt = parts[1].trim();
      if (afterAt.includes(" - ")) {
        const compParts = afterAt.split(" - ");
        company = compParts[0].trim();
        location = compParts.slice(1).join(" - ").trim();
      } else {
        company = afterAt;
      }
    } else if (ogTitle.includes(" | ")) {
      const parts = ogTitle.split(" | ");
      title = parts[0].trim();
      company = parts[1]?.trim() || ogSite;
    } else if (ogTitle.includes(" - ")) {
      const parts = ogTitle.split(" - ");
      title = parts[0].trim();
      company = parts[1]?.trim() || ogSite;
    }

    const jobDetails: JobDetails = {
      title: title || "Job Opening",
      company: company || "Company",
      location,
      description: ogDescription,
      url,
      isRemote: /remote/i.test(title) || /remote/i.test(location),
      workplaceType: /remote/i.test(title) ? "Remote" : "On-site",
    };

    return { success: true, data: jobDetails };
  } catch (err: any) {
    if (err.name === "AbortError") {
      return {
        success: false,
        error: { type: "network", message: "Request timed out after 12 seconds." },
      };
    }
    return {
      success: false,
      error: { type: "network", message: err.message || "Failed to fetch job posting" },
    };
  }
}
