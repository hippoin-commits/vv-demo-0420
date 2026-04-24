import * as React from "react";
import {
  Pencil,
  FilePlus2,
  Heart,
  MoreHorizontal,
  Pause,
  Share2,
  Square,
  ArrowLeftRight,
  MonitorPlay,
  Link2,
  FileCheck,
  Eye,
  ClipboardList,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { cn } from "../../ui/utils";

export type TaskActionDef = { id: string; label: string };

/** 与任务详情卡片同一套操作（顺序一致） */
export const ALL_TASK_ACTIONS: TaskActionDef[] = [
  { id: "edit", label: "编辑任务" },
  { id: "subtask", label: "创建子任务" },
  { id: "follow", label: "关注任务" },
  /** 快速会议 + 预约会议合并入口 */
  { id: "meeting", label: "会议" },
  { id: "share", label: "分享任务" },
  { id: "pause", label: "暂停任务" },
  { id: "terminate", label: "终止任务" },
  { id: "handover", label: "交接" },
  { id: "delete", label: "删除" },
  { id: "link_sub", label: "关联子任务" },
  { id: "approval_start", label: "发起审批" },
  { id: "approval_view", label: "查看审批" },
  { id: "eval_records", label: "任务评价记录" },
];

/** sm：列表行；md：任务详情卡默认底栏（16px 图标）；lg：0417 Weekly 规范（18px 图标 + 32px 热区） */
const iconClass = (size: "sm" | "md" | "lg") =>
  size === "sm" ? "size-[14px]" : size === "md" ? "size-4" : "size-[18px]";

/** 任务详情卡底部工具栏（默认）：图标 16px，热区 20×20 */
export const taskDetailToolbarIconBtnClass =
  "inline-flex h-5 w-5 min-h-5 min-w-5 shrink-0 items-center justify-center rounded-[var(--radius-md)] p-0 text-text-secondary hover:bg-[var(--black-alpha-11)] hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring";

/**
 * 任务详情卡底栏（0417 Weekly / Figma 1176:3067）：图标 18px，热区 32×32；与行容器 `gap-[var(--space-500)]`（20px）、`pr-[var(--space-400)]`（16px）配套使用
 */
export const taskDetailToolbarIconBtnClassFigma0417 =
  "inline-flex h-8 w-8 min-h-8 min-w-8 shrink-0 items-center justify-center rounded-[var(--radius-md)] p-0 text-text-secondary hover:bg-[var(--black-alpha-11)] hover:text-primary transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring";

/** 任务详情顶栏与列表行共用图标 */
export function TaskActionIcon({
  actionId,
  size = "md",
  className,
}: {
  actionId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const c = cn(iconClass(size), className);
  switch (actionId) {
    case "edit":
      return <Pencil className={c} strokeWidth={1.5} />;
    case "subtask":
      return <FilePlus2 className={c} strokeWidth={1.5} />;
    case "follow":
      return <Heart className={c} strokeWidth={1.5} />;
    case "meeting":
      return <MonitorPlay className={c} strokeWidth={1.5} />;
    case "share":
      return <Share2 className={c} strokeWidth={1.5} />;
    case "pause":
      return <Pause className={c} strokeWidth={1.5} />;
    case "terminate":
      return <Square className={c} strokeWidth={1.5} />;
    case "handover":
      return <ArrowLeftRight className={c} strokeWidth={1.5} />;
    case "link_sub":
      return <Link2 className={c} strokeWidth={1.5} />;
    case "approval_start":
      return <FileCheck className={c} strokeWidth={1.5} />;
    case "approval_view":
      return <Eye className={c} strokeWidth={1.5} />;
    case "eval_records":
      return <ClipboardList className={c} strokeWidth={1.5} />;
    default:
      return <MoreHorizontal className={c} strokeWidth={1.5} />;
  }
}

const rowIconBtnClass =
  "p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] text-text-tertiary hover:bg-[var(--black-alpha-11)] inline-flex items-center justify-center min-h-[22px] min-w-[22px] outline-none focus-visible:ring-2 focus-visible:ring-ring";

const RowIconBtn = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }
>(function RowIconBtn({ label, className, children, type = "button", ...rest }, ref) {
  return (
    <button ref={ref} type={type} title={label} aria-label={label} className={cn(rowIconBtnClass, className)} {...rest}>
      {children}
    </button>
  );
});

/**
 * 任务列表行操作：最多展示 3 个槽位。
 * 操作数 ≤3 时全部展示为图标；>3 时展示前 2 个图标，第 3 个为「更多」，其余进下拉菜单。
 */
export function TaskListRowActions({
  onRowAction,
  className,
}: {
  /** 演示用回调，可接业务 */
  onRowAction?: (actionId: string) => void;
  className?: string;
}) {
  const actions = ALL_TASK_ACTIONS;

  const stop = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const fire = (id: string, e: React.MouseEvent) => {
    stop(e);
    onRowAction?.(id);
  };

  if (actions.length <= 3) {
    return (
      <div className={cn("inline-flex justify-end gap-[var(--space-100)]", className)} onClick={stop}>
        {actions.map((a) => (
          <RowIconBtn key={a.id} label={a.label} onClick={(e) => fire(a.id, e)}>
            <TaskActionIcon actionId={a.id} size="sm" />
          </RowIconBtn>
        ))}
      </div>
    );
  }

  const [first, second, ...rest] = actions;

  return (
    <div className={cn("inline-flex justify-end items-center gap-[var(--space-100)]", className)} onClick={stop}>
      <RowIconBtn label={first.label} onClick={(e) => fire(first.id, e)}>
        <TaskActionIcon actionId={first.id} size="sm" />
      </RowIconBtn>
      <RowIconBtn label={second.label} onClick={(e) => fire(second.id, e)}>
        <TaskActionIcon actionId={second.id} size="sm" />
      </RowIconBtn>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <RowIconBtn label="更多操作">
            <MoreHorizontal className="size-[14px]" />
          </RowIconBtn>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[200px] max-h-[min(420px,70vh)] overflow-y-auto"
          onClick={stop}
        >
          {rest.map((a) => (
            <DropdownMenuItem
              key={a.id}
              className="text-[length:var(--font-size-sm)]"
              onSelect={() => onRowAction?.(a.id)}
            >
              {a.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
