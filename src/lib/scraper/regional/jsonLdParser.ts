import type { JobDetails } from "../types";

export function extractJsonLdJob(html: string, fallbackUrl: string): JobDetails | null {
  const jsonLdRegex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match: RegExpExecArray | null;

  while ((match = jsonLdRegex.exec(html)) !== null) {
    const rawContent = match[1]?.trim();
    if (!rawContent) continue;

    try {
      const parsed = JSON.parse(rawContent);
      const items = Array.isArray(parsed)
        ? parsed
        : parsed["@graph"] && Array.isArray(parsed["@graph"])
          ? parsed["@graph"]
          : [parsed];

      for (const item of items) {
        const type = item["@type"];
        const isJobPosting =
          type === "JobPosting" ||
          (Array.isArray(type) && type.includes("JobPosting"));

        if (isJobPosting) {
          return mapJsonLdToJobDetails(item, fallbackUrl);
        }
      }
    } catch {
      // Continue to next script tag if this one had malformed JSON
      continue;
    }
  }

  return null;
}

function mapJsonLdToJobDetails(ld: any, fallbackUrl: string): JobDetails {
  const title = (ld.title || ld.name || "").trim();

  let company = "";
  if (typeof ld.hiringOrganization === "string") {
    company = ld.hiringOrganization;
  } else if (ld.hiringOrganization && typeof ld.hiringOrganization.name === "string") {
    company = ld.hiringOrganization.name;
  }

  let location = "";
  if (ld.jobLocation) {
    const loc = Array.isArray(ld.jobLocation) ? ld.jobLocation[0] : ld.jobLocation;
    if (loc?.address) {
      const addr = loc.address;
      if (typeof addr === "string") {
        location = addr;
      } else {
        const parts = [
          addr.addressLocality,
          addr.addressRegion,
          addr.addressCountry,
        ].filter(Boolean);
        location = parts.join(", ");
      }
    } else if (typeof loc?.name === "string") {
      location = loc.name;
    }
  }

  // Remote detection
  const isRemote =
    ld.jobLocationType === "TELECOMMUTE" ||
    ld.applicantLocationRequirements !== undefined ||
    /remote/i.test(location) ||
    /remote/i.test(title);

  let workplaceType = isRemote ? "Remote" : "On-site";
  if (/hybrid/i.test(location) || /hybrid/i.test(title)) {
    workplaceType = "Hybrid";
  }

  // Salary range
  let salary: string | undefined;
  if (ld.baseSalary) {
    const val = ld.baseSalary.value;
    const currency = ld.baseSalary.currency || "";
    if (typeof val === "number" || typeof val === "string") {
      salary = `${currency} ${val}`.trim();
    } else if (val && (val.minValue || val.maxValue)) {
      const min = val.minValue ?? "";
      const max = val.maxValue ?? "";
      const unit = val.unitText ? ` / ${val.unitText.toLowerCase()}` : "";
      salary = `${currency} ${min}${min && max ? " - " : ""}${max}${unit}`.trim();
    }
  }

  const employmentType = Array.isArray(ld.employmentType)
    ? ld.employmentType.join(", ")
    : typeof ld.employmentType === "string"
      ? ld.employmentType.replace(/_/g, " ").toLowerCase()
      : undefined;

  return {
    title,
    company: company.trim(),
    location: location.trim(),
    description: ld.description || "",
    url: ld.url || fallbackUrl,
    postedDate: ld.datePosted,
    salary,
    employmentType,
    isRemote,
    workplaceType,
  };
}
