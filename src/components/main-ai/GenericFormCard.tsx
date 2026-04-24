import React, { ReactNode } from "react";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

export interface GenericFormCardProps {
  title: string | ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  submitText?: string;
  resetText?: string;
  onSubmit?: () => void;
  onReset?: () => void;
  isReadonly?: boolean;
  isSubmitted?: boolean; // 新增用于控制提交状态的属性
  className?: string;
}

export function GenericFormCard({
  title,
  icon,
  children,
  submitText = "提交",
  resetText = "重置",
  onSubmit,
  onReset,
  isReadonly = false,
  isSubmitted = false,
  className,
}: GenericFormCardProps) {
  return (
    <div
      className={cn(
        "bg-bg flex flex-col items-start overflow-hidden relative rounded-card shadow-xs w-full",
        className
      )}
    >
      {/* Header */}
      <div className="flex flex-col items-start pb-[var(--space-250)] pt-[var(--space-350)] px-[var(--space-350)] relative w-full border-b border-border-divider">
        <div className="flex gap-[var(--space-100)] items-center justify-center relative w-full">
          {icon && (
            <div className="relative shrink-0 flex items-center justify-center text-text-tertiary w-[18px] h-[18px]">
              {icon}
            </div>
          )}
          <div className="flex-1 leading-[20px] text-text-tertiary text-[length:var(--font-size-base)] tracking-[1px] truncate">
            {title}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-[var(--space-350)] relative w-full">
        {children}
      </div>

      {/* Footer */}
      {!isReadonly && (
        <div className="flex items-stretch px-[var(--space-350)] pb-[var(--space-350)] relative w-full">
          <div className="flex w-full min-w-0 flex-wrap items-stretch gap-[var(--space-300)] sm:flex-nowrap">
            <Button
              type="button"
              variant="chat-reset"
              onClick={onReset}
              className="shrink-0 min-w-[72px]"
              disabled={isSubmitted}
            >
              {resetText}
            </Button>
            <Button
              type="button"
              variant="chat-submit"
              onClick={onSubmit}
              className="min-w-0 flex-1 min-h-[36px] sm:min-w-[72px]"
              disabled={isSubmitted}
            >
              {isSubmitted ? "已提交" : submitText}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}