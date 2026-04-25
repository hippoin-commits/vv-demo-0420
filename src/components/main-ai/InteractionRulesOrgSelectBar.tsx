import * as React from "react";
import { ChevronDown, GripVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { cn } from "../ui/utils";
import type { Organization } from "./OrganizationSwitcherCard";
import orgIcon from "figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png";

const CheckIcon = () => (
  <svg className="h-[16px] w-[16px] text-primary" viewBox="0 0 16 16" fill="none">
    <path
      d="M13.3334 4L6.00008 11.3333L2.66675 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export function InteractionRulesOrgSelectBar({
  organizations,
  currentOrgId,
  onOrgSelect,
  /** 嵌入 GenericCard 标题区时去掉与卡片的额外下边距 */
  embedded = false,
}: {
  organizations: Organization[];
  currentOrgId: string;
  onOrgSelect: (orgId: string) => void;
  embedded?: boolean;
}) {
  const current = organizations.find((o) => o.id === currentOrgId) ?? organizations[0];
  const label = current?.name ?? "选择组织";

  return (
    <div
      className={cn(
        "flex w-full min-w-0 justify-start",
        embedded ? "mb-0" : "mb-[var(--space-200)]",
      )}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex max-w-full min-w-0 items-center gap-[var(--space-150)] rounded-[var(--radius-md)] border-0 bg-transparent px-0 py-[var(--space-100)] text-left shadow-none outline-none",
              "cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            <span className="relative inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-bg">
              <img
                src={current?.icon || orgIcon}
                alt=""
                className="h-full w-full object-cover"
              />
            </span>
            <span className="min-w-0 truncate text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text">
              {label}
            </span>
            <ChevronDown className="h-[16px] w-[16px] shrink-0 text-text-tertiary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="flex w-[min(100vw-2rem,440px)] flex-col overflow-hidden p-0"
        >
          <div className="max-h-[min(360px,50vh)] min-h-0 overflow-y-auto py-[var(--space-100)]">
            {organizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => onOrgSelect(org.id)}
                className="flex cursor-pointer items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)]"
              >
                <GripVertical className="h-[14px] w-[14px] shrink-0 text-text-tertiary" />
                <img
                  src={org.icon || orgIcon}
                  alt=""
                  className="h-[20px] w-[20px] shrink-0 rounded-[4px]"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[length:var(--font-size-base)] text-text">{org.name}</p>
                </div>
                {org.id === currentOrgId ? <CheckIcon /> : null}
              </DropdownMenuItem>
            ))}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
