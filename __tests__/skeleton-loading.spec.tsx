import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardLoading from "@/app/dashboard/loading";
import MyJobsLoading from "@/app/dashboard/myjobs/loading";
import SettingsLoading from "@/app/dashboard/settings/loading";
import TasksLoading from "@/app/dashboard/tasks/loading";
import ActivitiesLoading from "@/app/dashboard/activities/loading";
import QuestionsLoading from "@/app/dashboard/questions/loading";
import ProfileLoading from "@/app/dashboard/profile/loading";
import AutomationsLoading from "@/app/dashboard/automations/loading";
import Loading from "@/components/Loading";

describe("Shadcn Design System & Skeleton Loading States", () => {
  it("renders base Skeleton primitive with pulse animation", () => {
    const { container } = render(<Skeleton className="h-10 w-20" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("animate-pulse");
    expect(el).toHaveClass("bg-muted/70");
  });

  it("renders DashboardLoading with high-fidelity section skeletons", () => {
    const { container } = render(<DashboardLoading />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(15);
  });

  it("renders MyJobsLoading skeleton table", () => {
    const { container } = render(<MyJobsLoading />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(10);
  });

  it("renders SettingsLoading skeleton sidebar and card", () => {
    const { container } = render(<SettingsLoading />);
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(5);
  });

  it("renders TasksLoading and ActivitiesLoading", () => {
    const { container: tasksC } = render(<TasksLoading />);
    expect(tasksC.querySelectorAll(".animate-pulse").length).toBeGreaterThan(5);

    const { container: actC } = render(<ActivitiesLoading />);
    expect(actC.querySelectorAll(".animate-pulse").length).toBeGreaterThan(5);
  });

  it("renders QuestionsLoading, ProfileLoading, and AutomationsLoading", () => {
    const { container: qC } = render(<QuestionsLoading />);
    expect(qC.querySelectorAll(".animate-pulse").length).toBeGreaterThan(5);

    const { container: pC } = render(<ProfileLoading />);
    expect(pC.querySelectorAll(".animate-pulse").length).toBeGreaterThan(5);

    const { container: aC } = render(<AutomationsLoading />);
    expect(aC.querySelectorAll(".animate-pulse").length).toBeGreaterThan(5);
  });

  it("renders upgraded Loading component with data-testid='loader' and skeletons", () => {
    render(<Loading rows={3} />);
    const loader = screen.getByTestId("loader");
    expect(loader).toBeInTheDocument();
    const skeletons = loader.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(5);
  });
});
