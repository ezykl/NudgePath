"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CiSparkle, CiArrowRight } from "@/components/icons/CoolIcon";
import { Sparkles, X } from "lucide-react";

interface CareerNudgeBannerProps {
  discoveredCount?: number;
}

export default function CareerNudgeBanner({
  discoveredCount = 3,
}: CareerNudgeBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  if (dismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/10 via-card/50 to-card/30 p-5 shadow-xs backdrop-blur-xs transition-all duration-300">
      {/* Subtle warm background glow effect */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 shadow-xs">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold text-primary">
                <CiSparkle size={13} className="text-primary" />
                {greeting}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                Your Career Companion
              </span>
            </div>

            <p className="text-sm text-foreground/90 font-normal leading-relaxed">
              Steady progress! Automated discovery found{" "}
              <span className="font-semibold text-primary">
                {discoveredCount} new openings
              </span>{" "}
              tailored to your resume and experience. Take your time to review them.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs text-muted-foreground">
              <span className="rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 text-[11px] font-medium">
                No rush • Review at your pace
              </span>
              <span className="rounded-md border border-border/40 bg-muted/40 px-2 py-0.5 text-[11px] font-medium">
                100% Private & Self-Hosted
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDismissed(true)}
            className="h-8 text-xs text-muted-foreground hover:text-foreground"
          >
            Later
          </Button>

          <Button
            asChild
            size="sm"
            className="h-9 gap-1.5 rounded-lg bg-primary px-4 font-medium text-primary-foreground shadow-xs hover:bg-primary/90"
          >
            <Link href="/dashboard/myjobs?tab=discovered">
              Review Roles
              <CiArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
