import * as React from "react";
import { cn } from "@/lib/utils";

export interface CoolIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

// Base Coolicon wrapper enforcing 24x24 coordinate space and currentColor stroke
function IconBase({
  children,
  className,
  size = 20,
  fill = "none",
  stroke = "currentColor",
  strokeWidth = 2,
  strokeLinecap = "round",
  strokeLinejoin = "round",
  ...props
}: CoolIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      className={cn("shrink-0", className)}
      {...props}
    >
      {children}
    </svg>
  );
}

// 1. Dashboard / Grid Icon
export function CiDashboard(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
    </IconBase>
  );
}

// 2. Suitcase / Job Career Icon
export function CiSuitcase(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M12 12v2" />
    </IconBase>
  );
}

// 3. Calendar Icon
export function CiCalendar(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <rect x="3" y="4" width="18" height="17" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </IconBase>
  );
}

// 4. Check Circle / Completed Milestone Icon
export function CiCheckCircle(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 5-5" />
    </IconBase>
  );
}

// 5. Trending Up / Growth Icon
export function CiTrendingUp(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
      <polyline points="16 7 22 7 22 13" />
    </IconBase>
  );
}

// 6. Trending Down Icon
export function CiTrendingDown(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <polyline points="22 17 13.5 8.5 8.5 13.5 2 7" />
      <polyline points="16 17 22 17 22 11" />
    </IconBase>
  );
}

// 7. Plus / Add Icon
export function CiPlus(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14" />
    </IconBase>
  );
}

// 8. Plus Circle Icon
export function CiPlusCircle(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v8M8 12h8" />
    </IconBase>
  );
}

// 9. Sparkle / AI Career Nudge Icon
export function CiSparkle(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3z" />
    </IconBase>
  );
}

// 10. Bell / Notification Icon
export function CiBell(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </IconBase>
  );
}

// 11. Search / Command Palette Icon
export function CiSearch(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconBase>
  );
}

// 12. Arrow Right Icon
export function CiArrowRight(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </IconBase>
  );
}

// 13. Zap / Fast Automation Icon
export function CiZap(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </IconBase>
  );
}

// 14. Question Help / Interview Icon
export function CiHelpCircle(props: CoolIconProps) {
  return (
    <IconBase {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01" />
    </IconBase>
  );
}
