import React from "react";
import { ArrowUpCircle, CornerDownRight } from "lucide-react";
import { cn } from "../ui/utils";
import { OperationSourceNavContext } from "./operationSourceNavContext";

export interface GenericCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  title: string;
  /** 与 `title` 同一行、标题右侧的补充文案（如「（已更新）」） */
  titleSuffix?: React.ReactNode;
  /** 标题行下方、副标题上方的自定义区域（如演示用组织切换条） */
  titleBelowAccessory?: React.ReactNode;
  /** 第二行小字（如任务名称）；子卡片不展示任务编码 */
  subtitle?: string;
  children?: React.ReactNode;
}

const arrowCircleEl = (
  <span
    className="inline-flex size-6 shrink-0 items-center justify-center self-center rounded-full bg-bg-secondary text-text-tertiary"
    aria-hidden
  >
    <ArrowUpCircle className="size-4" strokeWidth={1.5} />
  </span>
);

/** 操作来源条：由 MainAIChatWindow 等放在卡片外右上，不与白底卡片叠在同一容器内 */
export function OperationSourceBar({ label }: { label: string }) {
  const { onNavigateToOperationSource } = React.useContext(OperationSourceNavContext);
  const sourceClickable = Boolean(label && onNavigateToOperationSource);

  if (sourceClickable) {
    return (
      <button
        type="button"
        onClick={onNavigateToOperationSource}
        title={`操作来源：${label}（点击定位到来源卡片）`}
        className={cn(
          "inline-flex max-w-full min-w-0 items-center gap-[6px] border-0 bg-transparent px-0 py-0 text-left shadow-none",
          "text-[length:var(--font-size-base)] text-text-secondary leading-[20px]",
          "cursor-pointer outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        )}
      >
        <CornerDownRight className="size-[14px] shrink-0 self-center text-text-tertiary" strokeWidth={1.75} aria-hidden />
        <span className="min-w-0 flex-1 truncate leading-[20px]">{label}</span>
        {arrowCircleEl}
      </button>
    );
  }
  return (
    <div
      className="inline-flex max-w-full min-w-0 items-center gap-[6px] border-0 bg-transparent px-0 py-0 text-[length:var(--font-size-base)] leading-[20px] text-text-secondary shadow-none"
      title={`操作来源：${label}`}
    >
      <CornerDownRight className="size-[14px] shrink-0 self-center text-text-tertiary" strokeWidth={1.75} aria-hidden />
      <span className="min-w-0 flex-1 truncate leading-[20px]">{label}</span>
      {arrowCircleEl}
    </div>
  );
}

export function GenericCard({
  title,
  titleSuffix,
  titleBelowAccessory,
  subtitle,
  children,
  className = "",
  ...props
}: GenericCardProps) {
  return (
    <div
      className={cn(
        "relative flex w-full min-w-0 flex-col items-start gap-[var(--space-250)] rounded-[var(--radius-card)] bg-bg p-[var(--space-350)] shadow-elevation-sm",
        className
      )}
      {...props}
    >
      {/* 卡片头部：左侧标题（+ 可选副标题） */}
      <div className="relative flex w-full min-w-0 shrink-0 items-start gap-[var(--space-200)]">
        <div className="bg-primary h-[22px] w-[3px] shrink-0 self-start rounded-full" aria-hidden />
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-100)]">
          <h3 className="m-0 flex min-w-0 max-w-full flex-wrap items-baseline gap-x-[var(--space-100)] gap-y-0 text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] leading-[22px] text-text">
            <span className="min-w-0 truncate">{title}</span>
            {titleSuffix ? (
              <span className="shrink-0 truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-normal)] text-text-secondary">
                {titleSuffix}
              </span>
            ) : null}
          </h3>
          {titleBelowAccessory ? (
            <div className="w-full min-w-0">{titleBelowAccessory}</div>
          ) : null}
          {subtitle ? (
            <p className="m-0 min-w-0 truncate text-[length:var(--font-size-xs)] text-text-tertiary" title={subtitle}>
              {subtitle}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative flex w-full shrink-0 flex-col">{children}</div>
    </div>
  );
}
