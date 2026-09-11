"use client";

import { PieSvgProps, ResponsivePie } from "@nivo/pie";
import { animated } from "@react-spring/web";
import { useTheme } from "next-themes";
import { TrendingDown, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { JobsActivitySummary } from "@/actions/dashboard.actions";
import { usePersistedTabIndex } from "@/hooks/usePersistedTabIndex";
import { APP_CONSTANTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  ARC_LABEL_TEXT_COLOR,
  arcLabelLines,
  buildDonutSlices,
  DonutSlice,
} from "./jobsActivityChart";

interface JobsActivityCardProps {
  data: {
    label: string;
    summary: JobsActivitySummary;
  }[];
}

type ArcLinkLabelProps = Parameters<
  NonNullable<PieSvgProps<DonutSlice>["arcLinkLabelComponent"]>
>[0];

// nivo renders an arc link label as one <text>, so stacking the hours under
// the name needs a custom component rather than a label formatter.
function ArcLinkLabel({ datum, style }: ArcLinkLabelProps) {
  const [name, hours] = arcLabelLines(datum.data);

  return (
    <animated.g opacity={style.opacity}>
      <animated.path
        fill="none"
        stroke={style.linkColor}
        strokeWidth={style.thickness}
        d={style.path}
      />
      <animated.text
        transform={style.textPosition}
        textAnchor={style.textAnchor}
        dominantBaseline="central"
        fill={style.textColor}
        fontSize={11}
      >
        <tspan x={0} dy="-0.5em">
          {name}
        </tspan>
        <tspan x={0} dy="1.15em" fontWeight={600}>
          {hours}
        </tspan>
      </animated.text>
    </animated.g>
  );
}

export default function JobsActivityCard({ data }: JobsActivityCardProps) {
  const [activeIndex, selectTab] = usePersistedTabIndex(
    APP_CONSTANTS.DASHBOARD_JOBS_ACTIVITY_STORAGE_KEY,
    data.map((item) => item.label),
  );
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  const current = data[activeIndex];
  const { jobsApplied, jobsTrend, topActivities, otherHours, totalHours } =
    current.summary;
  const slices = buildDonutSlices(topActivities, otherHours, theme);

  return (
    <Card className="@lg:col-span-2 rounded-2xl border-border/40 bg-card/40 backdrop-blur-xs shadow-xs">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold tracking-tight text-foreground min-w-0 truncate">
            Jobs &amp; Activity
          </CardTitle>
          <div
            className="flex shrink-0 rounded-lg border border-border/60 bg-muted/30 p-0.5 text-xs"
            data-testid="jobs-activity-toggle-group"
          >
            {data.map((item, index) => (
              <button
                key={item.label}
                onClick={() => selectTab(index)}
                className={cn(
                  "rounded-md px-2.5 py-1 font-medium transition-all duration-150",
                  activeIndex === index
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative h-[200px] w-full">
          {slices.length === 0 ? (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-[128px] w-[128px] rounded-full border-[16px] border-muted/50" />
              <p className="absolute inset-x-0 bottom-0 text-center text-xs text-muted-foreground">
                No activities recorded
              </p>
            </div>
          ) : (
            <ResponsivePie
              data={slices}
              margin={{ top: 26, right: 84, bottom: 26, left: 84 }}
              innerRadius={0.72}
              padAngle={2}
              cornerRadius={2}
              activeOuterRadiusOffset={4}
              colors={{ datum: "data.color" }}
              borderWidth={0}
              enableArcLabels={false}
              enableArcLinkLabels
              arcLinkLabelComponent={ArcLinkLabel}
              arcLinkLabelsThickness={2}
              arcLinkLabelsDiagonalLength={10}
              arcLinkLabelsStraightLength={12}
              arcLinkLabelsTextOffset={4}
              arcLinkLabelsColor={{ from: "data.color" }}
              arcLinkLabelsTextColor={ARC_LABEL_TEXT_COLOR[theme]}
              theme={{
                text: { fontSize: 11 },
                tooltip: {
                  container: { background: "#1e293b", color: "#fff" },
                },
              }}
              tooltip={({ datum }) => (
                <div
                  style={{
                    background: "#1e293b",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "11px",
                  }}
                >
                  <span style={{ color: datum.data.color }}>●</span>{" "}
                  {datum.data.label}: {datum.data.hours}h
                </div>
              )}
            />
          )}
          <div
            className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-px text-center"
            data-testid="jobs-activity-total"
          >
            <span className="text-xl font-bold leading-tight tracking-tight tabular-nums">
              {totalHours}h
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {jobsApplied} {jobsApplied === 1 ? "job" : "jobs"}
            </span>
            {jobsTrend !== 0 && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                  jobsTrend > 0
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-rose-500/10 text-rose-500",
                )}
              >
                {jobsTrend > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(jobsTrend)}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
