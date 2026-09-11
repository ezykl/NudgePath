import { describe, it, expect, vi } from "vitest";
import { extractJsonLdJob } from "@/lib/scraper/regional/jsonLdParser";
import { extractMetaTag, extractHtmlTitle, scrapeJobFromUrl } from "@/lib/scraper/regional/universal";

describe("Regional Job Scraper (JobStreet, Seek, Indeed & JSON-LD)", () => {
  const sampleSeekJsonLdHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Senior React Developer - Sydney NSW - SEEK</title>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": "Senior React Developer",
          "description": "<p>We are seeking a talented Senior React Developer...</p>",
          "datePosted": "2026-09-10T08:00:00Z",
          "hiringOrganization": {
            "@type": "Organization",
            "name": "Canva"
          },
          "jobLocation": {
            "@type": "Place",
            "address": {
              "addressLocality": "Sydney",
              "addressRegion": "NSW",
              "addressCountry": "Australia"
            }
          },
          "baseSalary": {
            "@type": "MonetaryAmount",
            "currency": "AUD",
            "value": {
              "@type": "QuantitativeValue",
              "minValue": 140000,
              "maxValue": 180000,
              "unitText": "YEAR"
            }
          },
          "jobLocationType": "TELECOMMUTE"
        }
        </script>
      </head>
      <body></body>
    </html>
  `;

  const sampleJobStreetHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <script type="application/ld+json">
        {
          "@context": "https://schema.org",
          "@type": "JobPosting",
          "title": "Lead Software Engineer",
          "hiringOrganization": {
            "name": "Globe Telecom"
          },
          "jobLocation": {
            "address": {
              "addressLocality": "Taguig",
              "addressCountry": "Philippines"
            }
          },
          "baseSalary": {
            "currency": "PHP",
            "value": {
              "minValue": 90000,
              "maxValue": 140000,
              "unitText": "MONTH"
            }
          }
        }
        </script>
      </head>
      <body></body>
    </html>
  `;

  it("extracts structured job details from Seek JobPosting JSON-LD", () => {
    const job = extractJsonLdJob(sampleSeekJsonLdHtml, "https://www.seek.com.au/job/123");
    expect(job).not.toBeNull();
    expect(job?.title).toBe("Senior React Developer");
    expect(job?.company).toBe("Canva");
    expect(job?.location).toBe("Sydney, NSW, Australia");
    expect(job?.salary).toBe("AUD 140000 - 180000 / year");
    expect(job?.isRemote).toBe(true);
    expect(job?.workplaceType).toBe("Remote");
  });

  it("extracts JobStreet Philippines job posting", () => {
    const job = extractJsonLdJob(sampleJobStreetHtml, "https://www.jobstreet.com.ph/job/456");
    expect(job).not.toBeNull();
    expect(job?.title).toBe("Lead Software Engineer");
    expect(job?.company).toBe("Globe Telecom");
    expect(job?.location).toBe("Taguig, Philippines");
    expect(job?.salary).toBe("PHP 90000 - 140000 / month");
  });

  it("falls back to OpenGraph meta tags when JSON-LD is absent", () => {
    const fallbackHtml = `
      <html>
        <head>
          <meta property="og:title" content="Full Stack Engineer at Vercel - Remote" />
          <meta property="og:description" content="Build the next generation web platform." />
          <meta property="og:site_name" content="Vercel Careers" />
        </head>
      </html>
    `;
    const title = extractMetaTag(fallbackHtml, "og:title");
    const desc = extractMetaTag(fallbackHtml, "og:description");
    expect(title).toBe("Full Stack Engineer at Vercel - Remote");
    expect(desc).toBe("Build the next generation web platform.");
  });
});
