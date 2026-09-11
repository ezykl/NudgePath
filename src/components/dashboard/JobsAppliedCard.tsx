"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CiSuitcase,
  CiZap,
  CiCheckCircle,
  CiHelpCircle,
  CiPlus,
} from "@/components/icons/CoolIcon";
import { useRouter } from "next/navigation";

export default function JobsAppliedCard() {
  const router = useRouter();

  return (
    <Card className="sm:col-span-2 min-w-0 flex flex-col rounded-2xl border-border/40 bg-card/40 backdrop-blur-xs shadow-xs transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold tracking-tight text-foreground">
            Quick Actions
          </CardTitle>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
            Shortcut Hub
          </span>
        </div>
        <CardDescription className="max-w-lg text-xs leading-relaxed text-muted-foreground">
          Log an application, set up a company tracker, schedule a task, or save an interview question.
        </CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto grid grid-cols-2 gap-2.5 pt-1">
        <Button
          variant="outline"
          className="group justify-start gap-2.5 rounded-xl border-border/50 bg-background/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
          onClick={() => router.push("/dashboard/myjobs?add-job=true")}
        >
          <CiSuitcase size={16} className="text-primary transition-transform group-hover:scale-110" />
          <span className="min-w-0 truncate text-xs font-medium">Job</span>
          <CiPlus size={12} className="ml-auto opacity-40 group-hover:opacity-100" />
        </Button>

        <Button
          variant="outline"
          className="group justify-start gap-2.5 rounded-xl border-border/50 bg-background/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
          onClick={() =>
            router.push("/dashboard/automations?add-automation=true")
          }
        >
          <CiZap size={16} className="text-amber-500 transition-transform group-hover:scale-110" />
          <span className="min-w-0 truncate text-xs font-medium">Automation</span>
          <CiPlus size={12} className="ml-auto opacity-40 group-hover:opacity-100" />
        </Button>

        <Button
          variant="outline"
          className="group justify-start gap-2.5 rounded-xl border-border/50 bg-background/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
          onClick={() => router.push("/dashboard/tasks?add-task=true")}
        >
          <CiCheckCircle size={16} className="text-emerald-500 transition-transform group-hover:scale-110" />
          <span className="min-w-0 truncate text-xs font-medium">Task</span>
          <CiPlus size={12} className="ml-auto opacity-40 group-hover:opacity-100" />
        </Button>

        <Button
          variant="outline"
          className="group justify-start gap-2.5 rounded-xl border-border/50 bg-background/40 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all duration-200"
          onClick={() =>
            router.push("/dashboard/questions?add-question=true")
          }
        >
          <CiHelpCircle size={16} className="text-sky-500 transition-transform group-hover:scale-110" />
          <span className="min-w-0 truncate text-xs font-medium">Question</span>
          <CiPlus size={12} className="ml-auto opacity-40 group-hover:opacity-100" />
        </Button>
      </CardFooter>
    </Card>
  );
}
