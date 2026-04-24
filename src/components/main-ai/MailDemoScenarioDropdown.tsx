import * as React from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../ui/utils";

/** 邮箱 CUI 演示场景（非产品设计，仅用于预览不同初始态） */
export const MAIL_DEMO_SCENARIOS = [
  { id: "unread_on_open", label: "打开应用时有未读邮件" },
] as const;

export type MailDemoScenarioId = (typeof MAIL_DEMO_SCENARIOS)[number]["id"];

type Props = {
  value: MailDemoScenarioId;
  onValueChange: (id: MailDemoScenarioId) => void;
};

export function MailDemoScenarioDropdown({ value, onValueChange }: Props) {
  const current = MAIL_DEMO_SCENARIOS.find((s) => s.id === value) ?? MAIL_DEMO_SCENARIOS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex max-w-[min(100vw-200px,320px)] items-center gap-0.5 rounded-md border border-border/50 bg-bg/70 px-2 py-1",
            "text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] text-text-tertiary",
            "shadow-none transition-colors",
            "hover:border-border/80 hover:bg-[var(--black-alpha-7)] hover:text-text-secondary",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-ring/40"
          )}
          title="演示：切换初始场景（非产品设计）"
        >
          <span className="min-w-0 truncate">{current.label}</span>
          <ChevronDown className="size-3 shrink-0 opacity-60" strokeWidth={2} aria-hidden />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[min(92vw,280px)]">
        {MAIL_DEMO_SCENARIOS.map((s) => (
          <DropdownMenuItem
            key={s.id}
            onClick={() => onValueChange(s.id)}
            className={cn(
              "cursor-pointer text-[length:var(--font-size-sm)]",
              value === s.id ? "bg-[var(--black-alpha-9)]" : ""
            )}
          >
            {s.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
