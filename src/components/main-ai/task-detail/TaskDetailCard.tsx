import * as React from "react";
import { GenericCard } from "../GenericCard";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Progress } from "../../ui/progress";
import { cn } from "../../ui/utils";
import type { ExecutionDivisionRow, TaskDetailData, TaskRow } from "../taskAppData";
import {
  filterExecutionDivisionRowsMine,
  filterExecutionDivisionRowsSubordinates,
  getExecutionDivisionRows,
  resolveParticipantNames,
  resolvePersonNames,
} from "../taskAppData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { TaskGroupChatDrawer } from "./TaskGroupChatDrawer";
import { TaskDescriptionDrawer, type OperationLogLine } from "./TaskDescriptionDrawer";
import { ExecutionContentDrawer, type ExecutionContentValues } from "./ExecutionContentDrawer";
import {
  Pencil,
  MoreHorizontal,
  Pause,
  ClipboardList,
  Plus,
  ArrowUpDown,
  CircleHelp,
  ChevronDown,
  ChevronUp,
  Heart,
  X,
  FileText,
  Briefcase,
  Link2,
  UserPlus,
  LayoutGrid,
  Lock,
  Target,
  Paperclip,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  ALL_TASK_ACTIONS,
  TaskActionIcon,
  TaskListRowActions,
  taskDetailToolbarIconBtnClass,
  taskDetailToolbarIconBtnClassFigma0417,
} from "./taskListRowActions";
import {
  MeetingHoverTrigger,
  ShareTaskDialog,
  PauseTaskDialog,
  TerminateTaskDialog,
  DeleteTaskDialog,
  ExecutionDivisionDetailDialog,
} from "./taskDetailDialogs";
import { FeedbackDetailDrawer } from "./FeedbackDetailDrawer";
import type { FeedbackListItem } from "./feedbackTypes";
import { ChatPromptButton } from "../../chat/ChatPromptButton";

/** 与「任务管理」列表（TaskManagementTableCard）视觉一致：浅底容器、无边线分列感、行 hover */
const LIST_TABLE_WRAP =
  "w-full overflow-x-auto rounded-[var(--radius-md)] border border-border bg-bg-secondary";
const LIST_TH =
  "text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]";
const LIST_TR_HEADER = "border-border hover:bg-transparent";
const LIST_TR_BODY = "border-border hover:bg-[var(--black-alpha-11)]";
const LIST_TD = "text-[length:var(--font-size-xs)] text-text px-[var(--space-300)] py-[var(--space-250)]";
/** 操作列：尽量贴内容、避免右侧大块留白 */
const LIST_TH_OP = `${LIST_TH} w-[1%] text-right whitespace-nowrap`;
const LIST_TD_OP = `${LIST_TD} text-right align-middle`;

/** 前 7 项在标题下右侧图标展示（含合并后的「会议」），其余进「更多」 */
const VISIBLE_ACTION_COUNT = 7;

/** 与「任务管理」列表 `TaskRow` 字段一致，可选「已关联」标记 */
export type SubtaskRow = TaskRow & { linked?: boolean };

/** 会话流中「任务模块」子卡片类型（产出/反馈等） */
export type TaskHubKind =
  | "execution_division"
  | "subtasks"
  | "output"
  | "feedback"
  | "risk"
  | "dynamics"
  | "kanban"
  | "communication";

export const TASK_HUB_LABELS: Record<TaskHubKind, string> = {
  execution_division: "执行内容分工",
  subtasks: "子任务",
  output: "产出",
  feedback: "反馈",
  risk: "风险",
  dynamics: "动态",
  kanban: "看板",
  communication: "沟通",
};

const TASK_HUB_ENTRY_ORDER: TaskHubKind[] = [
  "execution_division",
  "subtasks",
  "output",
  "feedback",
  "risk",
  "dynamics",
  "kanban",
  "communication",
];

/** 推送到任务会话的卡片选项（与 MainAIChatWindow 解析一致） */
export type TaskPushChatCardOptions = {
  phase?: string;
  initial?: ExecutionContentValues;
  hub?: TaskHubKind;
  /** 执行内容分工筛选列表 */
  executionDivisionScope?: "mine" | "subordinate";
  /** 看板筛选列表 */
  kanbanScope?: "mine" | "subordinate";
  /** 执行内容分工行详情（会话内只读卡片） */
  executionRow?: ExecutionDivisionRow;
};

/** 任务详情内推送到会话流的卡片类型（与 MainAIChatWindow 标记一致） */
export type TaskChatCardKind =
  | "edit"
  | "subtask"
  | "handover"
  | "link_sub"
  | "eval"
  | "execution"
  | "execution_edit"
  | "task_hub"
  | "execution_division_list"
  | "kanban_scope_list"
  | "new_output"
  | "execution_content_detail";

function resolveBasicFields(d: TaskDetailData) {
  const datePart = (s: string) => (s.includes(" ") ? s.split(/\s/)[0] : s);
  return {
    code: d.taskCode ?? d.id,
    creator: d.creator ?? d.owner,
    cycle: `${datePart(d.cycleStart ?? d.createdAt)} ~ ${datePart(d.cycleEnd ?? d.due)}`,
    typeLabel: d.type,
  };
}

function buildOperationLogs(d: TaskDetailData): OperationLogLine[] {
  const lines: OperationLogLine[] = [];
  if (d.createdAt && d.createdAt !== "—") {
    lines.push({ time: d.createdAt, text: "创建任务" });
  }
  if (d.updatedAt && d.updatedAt !== "—") {
    lines.push({ time: d.updatedAt, text: "更新任务" });
  }
  for (const a of d.activity) {
    const t = /^\d{4}-/.test(a.time) ? a.time : `2026-${a.time}`;
    lines.push({ time: t, text: a.text });
  }
  lines.push({ time: "2026-04-10 09:20:00", text: "系统自动同步任务状态" });
  return lines;
}

/** 纯图标按钮：hover / 读屏显示功能名称 */
function IconBtn({
  label,
  className,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button type="button" title={label} aria-label={label} className={cn(className)} {...rest}>
      {children}
    </button>
  );
}

/** 人员添加：浅灰圆角方块 + 灰色「+」，与头像同尺寸 */
function AddPersonButton({ label = "添加" }: { label?: string }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="inline-flex size-[32px] shrink-0 items-center justify-center rounded-[10px] bg-[#F2F2F2] text-[#8C8C8C] hover:bg-[#E8E8E8] transition-colors border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Plus className="size-[18px] text-[#8C8C8C]" strokeWidth={1.35} />
    </button>
  );
}

function MetaItem({
  label,
  value,
  valueClassName,
  noTruncate,
}: {
  label: string;
  value: React.ReactNode;
  /** 覆盖默认主文案样式（如参与人提示） */
  valueClassName?: string;
  /** 人员气泡等场景避免裁切触发器 */
  noTruncate?: boolean;
}) {
  return (
    <div className="flex flex-col gap-[var(--space-100)] min-w-0">
      <span className="text-[length:var(--font-size-xxs)] text-text-tertiary uppercase tracking-wide">
        {label}
      </span>
      <div
        className={cn(
          "text-[length:var(--font-size-sm)] text-text font-[var(--font-weight-medium)]",
          !noTruncate && "truncate",
          valueClassName
        )}
      >
        {value}
      </div>
    </div>
  );
}

/** 基本信息区：无头像；0 人「--」；1 人姓名；多人「首名 等N人」+ 气泡内双列头像名单 */
function PersonFieldInline({ names }: { names: string[] }) {
  const [open, setOpen] = React.useState(false);
  if (names.length === 0) {
    return <span>--</span>;
  }
  if (names.length === 1) {
    return <span className="truncate">{names[0]}</span>;
  }
  const first = names[0]!;
  const total = names.length;
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex max-w-full min-w-0 items-center gap-[var(--space-100)] rounded-[var(--radius-sm)] border-0 bg-transparent p-0 text-left outline-none",
            "cursor-pointer text-primary font-[var(--font-weight-medium)] hover:underline",
            "focus-visible:ring-2 focus-visible:ring-ring"
          )}
        >
          <span className="min-w-0 truncate">
            {first} 等{total}人
          </span>
          {open ? (
            <ChevronUp className="size-[14px] shrink-0 text-primary" aria-hidden />
          ) : (
            <ChevronDown className="size-[14px] shrink-0 text-primary" aria-hidden />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(100vw-32px,380px)] p-[var(--space-400)] shadow-md"
        align="start"
        sideOffset={6}
      >
        <div className="grid grid-cols-2 gap-x-[var(--space-500)] gap-y-[var(--space-400)]">
          {names.map((name, i) => (
            <div key={`${name}-${i}`} className="flex min-w-0 items-center gap-[var(--space-200)]">
              <Avatar className="size-[28px] shrink-0">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`}
                />
                <AvatarFallback className="text-[length:var(--font-size-xxs)]">{name[0]}</AvatarFallback>
              </Avatar>
              <span className="min-w-0 truncate text-[length:var(--font-size-sm)] text-text font-[var(--font-weight-regular)]">
                {name}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function TaskProgressSection({ detail }: { detail: TaskDetailData }) {
  return (
    <section className="rounded-[var(--radius-md)] border border-border bg-bg p-[var(--space-400)]">
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-200)]">任务进度</p>
      <div className="flex items-center gap-[var(--space-300)]">
        <Progress value={detail.progress} className="h-[8px] flex-1" />
        <span className="text-[length:var(--font-size-sm)] text-text tabular-nums font-[var(--font-weight-medium)]">
          {detail.progress}%
        </span>
      </div>
      <p className="text-[length:var(--font-size-xxs)] text-text-tertiary mt-[var(--space-150)]">
        预计工时 {detail.estimatedHours}h · 创建于 {detail.createdAt} · 更新 {detail.updatedAt}
      </p>
    </section>
  );
}

function ExecutionStatusPill({ label }: { label: string }) {
  const isDone = label === "已完成";
  const isProgress = label === "执行中" || label === "进行中";
  return (
    <span
      className={cn(
        "inline-flex rounded-[var(--radius-100)] px-[var(--space-200)] py-[var(--space-50)] text-[length:var(--font-size-xs)]",
        isDone
          ? "bg-success/15 text-success"
          : isProgress
            ? "bg-primary/15 text-primary"
            : "bg-bg-tertiary text-text-secondary"
      )}
    >
      {label}
    </span>
  );
}

function ExecutionDivisionTable({
  rows,
  onExecutionEdit,
  onViewExecutionDetail,
}: {
  rows: ExecutionDivisionRow[];
  onExecutionEdit?: () => void;
  /** 任务会话：点击标题在对话流中打开详情卡片；未提供时仍用弹窗（演示兜底） */
  onViewExecutionDetail?: (row: ExecutionDivisionRow) => void;
}) {
  const [detailRow, setDetailRow] = React.useState<ExecutionDivisionRow | null>(null);

  const openRowDetail = React.useCallback(
    (row: ExecutionDivisionRow) => {
      if (onViewExecutionDetail) {
        onViewExecutionDetail(row);
      } else {
        setDetailRow(row);
      }
    },
    [onViewExecutionDetail]
  );

  return (
    <>
    <div className={LIST_TABLE_WRAP}>
      <Table>
        <TableHeader>
          <TableRow className={LIST_TR_HEADER}>
            <TableHead className={cn(LIST_TH, "max-w-[200px]")}>执行内容</TableHead>
            <TableHead className={LIST_TH}>执行人</TableHead>
            <TableHead className={LIST_TH}>状态</TableHead>
            <TableHead className={LIST_TH}>阶段</TableHead>
            <TableHead className={LIST_TH}>难度</TableHead>
            <TableHead className={LIST_TH}>更新时间</TableHead>
            <TableHead className={LIST_TH_OP}>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => (
            <TableRow key={`${row.content}-${row.assignee}-${i}`} className={LIST_TR_BODY}>
              <TableCell className={cn(LIST_TD, "max-w-[200px]")}>
                <button
                  type="button"
                  className="max-w-full truncate text-left text-[length:var(--font-size-xs)] text-primary font-[var(--font-weight-medium)] hover:underline cursor-pointer bg-transparent border-0 p-0 outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  title="查看执行内容详情"
                  onClick={() => openRowDetail(row)}
                >
                  {row.content}
                </button>
              </TableCell>
              <TableCell className={LIST_TD}>{row.assignee}</TableCell>
              <TableCell className={LIST_TD}>
                <ExecutionStatusPill label={row.statusLabel} />
              </TableCell>
              <TableCell className={LIST_TD}>{row.phase}</TableCell>
              <TableCell className={cn(LIST_TD, row.difficulty === "--" && "text-text-tertiary")}>
                {row.difficulty}
              </TableCell>
              <TableCell className={cn(LIST_TD, "tabular-nums")}>{row.updatedAt}</TableCell>
              <TableCell className={LIST_TD_OP}>
                <div className="inline-flex justify-end gap-[var(--space-100)] text-text-tertiary">
                  <IconBtn
                    label="暂停"
                    className="p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--black-alpha-11)]"
                  >
                    <Pause className="size-[14px]" />
                  </IconBtn>
                  <IconBtn
                    label="编辑"
                    className="p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--black-alpha-11)]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onExecutionEdit?.();
                    }}
                  >
                    <Pencil className="size-[14px]" />
                  </IconBtn>
                  <IconBtn
                    label="更多操作"
                    className="p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--black-alpha-11)]"
                  >
                    <MoreHorizontal className="size-[14px]" />
                  </IconBtn>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    {!onViewExecutionDetail ? (
      <ExecutionDivisionDetailDialog
        open={detailRow !== null}
        onOpenChange={(o) => {
          if (!o) setDetailRow(null);
        }}
        row={detailRow}
      />
    ) : null}
    </>
  );
}

/** 会话流：我的 / 下属 执行内容分工列表（由底部按钮推送） */
export function FilteredExecutionDivisionListCard({
  detail,
  scope,
  onViewExecutionDetail,
}: {
  detail: TaskDetailData;
  scope: "mine" | "subordinate";
  onViewExecutionDetail?: (row: ExecutionDivisionRow) => void;
}) {
  const rows = React.useMemo(() => {
    return scope === "mine"
      ? filterExecutionDivisionRowsMine(detail)
      : filterExecutionDivisionRowsSubordinates(detail);
  }, [detail, scope]);
  const title = scope === "mine" ? "我的执行内容分工" : "下属的执行内容分工";
  return (
    <GenericCard title={title} subtitle={detail.name} className="overflow-hidden">
      {rows.length === 0 ? (
        <p className="text-[length:var(--font-size-sm)] text-text-secondary m-0 py-[var(--space-400)] text-center">
          暂无数据
        </p>
      ) : (
        <ExecutionDivisionTable rows={rows} onViewExecutionDetail={onViewExecutionDetail} />
      )}
    </GenericCard>
  );
}

function ExecutionDivisionSection({
  detail,
  onExecutionCreate,
  onExecutionEdit,
  onViewExecutionDetail,
}: {
  detail: TaskDetailData;
  onExecutionCreate: (phase?: string) => void;
  onExecutionEdit: () => void;
  onViewExecutionDetail?: (row: ExecutionDivisionRow) => void;
}) {
  const rows = React.useMemo(() => getExecutionDivisionRows(detail), [detail]);
  return (
    <section>
      <div className="flex justify-end mb-[var(--space-250)]">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-[var(--space-700)] text-[length:var(--font-size-xs)]"
          onClick={() => onExecutionCreate()}
        >
          新建执行内容
        </Button>
      </div>
      <ExecutionDivisionTable
        rows={rows}
        onExecutionEdit={onExecutionEdit}
        onViewExecutionDetail={onViewExecutionDetail}
      />
    </section>
  );
}

function SubtasksSection({
  subtasks,
  onCreateSubtask,
}: {
  subtasks: SubtaskRow[];
  onCreateSubtask?: () => void;
}) {
  return (
    <section>
      <div className="flex justify-end mb-[var(--space-250)]">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-[var(--space-700)] text-[length:var(--font-size-xs)]"
          onClick={() => onCreateSubtask?.()}
        >
          新建子任务
        </Button>
      </div>
      {subtasks.length === 0 ? (
        <div className="rounded-[var(--radius-md)] border border-border bg-bg py-[var(--space-800)] text-center text-[length:var(--font-size-xs)] text-text-tertiary">
          暂无数据
        </div>
      ) : (
        <div className={LIST_TABLE_WRAP}>
          <Table>
            <TableHeader>
              <TableRow className={LIST_TR_HEADER}>
                <TableHead className={cn(LIST_TH, "max-w-[200px]")}>名称</TableHead>
                <TableHead className={LIST_TH}>执行人</TableHead>
                <TableHead className={LIST_TH}>负责人</TableHead>
                <TableHead className={LIST_TH}>状态</TableHead>
                <TableHead className={cn(LIST_TH, "min-w-[120px]")}>实际进度</TableHead>
                <TableHead className={LIST_TH}>截止时间</TableHead>
                <TableHead className={LIST_TH}>风险</TableHead>
                <TableHead className={LIST_TH_OP}>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subtasks.map((s) => (
                <TableRow key={s.id} className={LIST_TR_BODY}>
                  <TableCell className={cn(LIST_TD, "max-w-[200px]")}>
                    <span className="truncate block" title={s.name}>
                      {s.name}
                    </span>
                    {s.linked ? (
                      <span className="text-[length:var(--font-size-xxs)] text-primary">已关联</span>
                    ) : null}
                  </TableCell>
                  <TableCell className={LIST_TD}>{s.assignee}</TableCell>
                  <TableCell className={LIST_TD}>{s.owner}</TableCell>
                  <TableCell className="px-[var(--space-300)]">
                    <span
                      className={cn(
                        "inline-flex rounded-[var(--radius-100)] px-[var(--space-200)] py-[var(--space-50)] text-[length:var(--font-size-xs)]",
                        s.status === "进行中" ? "bg-primary/15 text-primary" : "bg-bg-tertiary text-text-secondary"
                      )}
                    >
                      {s.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-[var(--space-300)]">
                    <div className="flex items-center gap-[var(--space-200)] min-w-[100px]">
                      <Progress value={s.progress} className="h-[6px] flex-1" />
                      <span className="text-[length:var(--font-size-xs)] text-text-secondary tabular-nums shrink-0">
                        {s.progress}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className={cn(LIST_TD, "whitespace-nowrap")}>{s.due}</TableCell>
                  <TableCell className="px-[var(--space-300)]">
                    <span
                      className={cn(
                        "text-[length:var(--font-size-xs)]",
                        s.risk === "有风险" ? "text-warning" : "text-text-secondary"
                      )}
                    >
                      {s.risk}
                    </span>
                  </TableCell>
                  <TableCell className={LIST_TD_OP}>
                    <TaskListRowActions />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

export function TaskDetailCard({
  detail,
  onPushTaskChatCard,
  /** `figma0417`：0417 任务方案页底栏，对齐 Weekly 设计稿（图标 18px、间距 20px、右内边距 16px） */
  detailToolbarVariant = "default",
  /** 演示规范：将底部操作栏迁移到任务标题下方，主体信息区保持不变 */
  detailToolbarPlacement = "bottom",
  /** 原位置编辑保存后：在卡牌首行标题右侧展示小号更新时间 */
  titleUpdatedAt,
}: {
  detail: TaskDetailData;
  /** 在任务会话中追加 GenericCard（编辑 / 子任务 / 交接 / 关联 / 评价 / 执行内容 / 模块子卡片） */
  onPushTaskChatCard?: (kind: TaskChatCardKind, options?: TaskPushChatCardOptions) => void;
  detailToolbarVariant?: "default" | "figma0417";
  detailToolbarPlacement?: "bottom" | "underTaskTitle";
  titleUpdatedAt?: string;
}) {
  /** 非任务会话（无 onPushTaskChatCard）时「沟通」入口仍打开侧栏 */
  const [chatOpen, setChatOpen] = React.useState(false);
  const [descDrawerOpen, setDescDrawerOpen] = React.useState(false);
  const [execDrawerOpen, setExecDrawerOpen] = React.useState(false);
  const [execMode, setExecMode] = React.useState<"create" | "edit">("create");
  const [execInitial, setExecInitial] = React.useState<ExecutionContentValues | null>(null);
  const [execCreatePhase, setExecCreatePhase] = React.useState<string | undefined>(undefined);

  const [followed, setFollowed] = React.useState(false);
  const [shareOpen, setShareOpen] = React.useState(false);
  const [pauseOpen, setPauseOpen] = React.useState(false);
  const [terminateOpen, setTerminateOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const riskHigh = detail.risk === "有风险" || detail.priority === "高";
  const basic = React.useMemo(() => resolveBasicFields(detail), [detail]);

  const isFigma0417Toolbar = detailToolbarVariant === "figma0417";
  const toolbarIconBtnClass = isFigma0417Toolbar
    ? taskDetailToolbarIconBtnClassFigma0417
    : taskDetailToolbarIconBtnClass;
  const toolbarIconSize = isFigma0417Toolbar ? ("lg" as const) : ("md" as const);

  const primaryActions = ALL_TASK_ACTIONS.slice(0, VISIBLE_ACTION_COUNT);
  const moreActions = ALL_TASK_ACTIONS.slice(VISIBLE_ACTION_COUNT);
  const toolbarEl = (
    <div
      className={cn(
        "flex flex-nowrap w-full items-center justify-end",
        detailToolbarPlacement === "bottom"
          ? "border-t border-border-divider pt-[var(--space-300)] pb-[var(--space-150)]"
          : "py-[var(--space-50)]",
        isFigma0417Toolbar
          ? "gap-[var(--space-500)] pr-[var(--space-400)]"
          : "gap-[6px] pr-[10px]"
      )}
    >
      {primaryActions.map((a) => {
        if (a.id === "meeting") {
          return (
            <MeetingHoverTrigger
              key={a.id}
              toolbarVariant={isFigma0417Toolbar ? "figma0417" : "default"}
              onQuickMeeting={() => {
                window.alert("已发起快速会议（演示）");
              }}
              onScheduleMeeting={() => {
                window.alert("已打开预约会议（演示）");
              }}
            />
          );
        }
        if (a.id === "follow") {
          return (
            <IconBtn
              key={a.id}
              label={a.label}
              className={toolbarIconBtnClass}
              onClick={() => setFollowed((f) => !f)}
            >
              <Heart
                className={cn(
                  toolbarIconSize === "lg" ? "size-[18px]" : "size-4",
                  "transition-colors",
                  followed ? "fill-[#E53935] text-[#E53935]" : "text-text-secondary"
                )}
                strokeWidth={followed ? 0 : 1.5}
              />
            </IconBtn>
          );
        }
        return (
          <IconBtn
            key={a.id}
            label={a.label}
            className={toolbarIconBtnClass}
            onClick={() => handlePrimaryAction(a.id)}
          >
            <TaskActionIcon actionId={a.id} size={toolbarIconSize} />
          </IconBtn>
        );
      })}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            title="更多操作"
            aria-label="更多操作"
            className={cn(toolbarIconBtnClass, "hover:text-text-secondary")}
          >
            <MoreHorizontal
              className={toolbarIconSize === "lg" ? "size-[18px]" : "size-4"}
              strokeWidth={1.5}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="min-w-[168px] max-h-[min(420px,70vh)] overflow-y-auto p-1"
        >
          {moreActions.map((a) => (
            <DropdownMenuItem
              key={a.id}
              className="text-[length:var(--font-size-xs)] py-1.5 px-2 min-h-0"
              onSelect={() => handleMoreAction(a.id)}
            >
              {a.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );

  const pushTaskHub = React.useCallback(
    (hub: TaskHubKind) => {
      /** 「沟通」直接打开侧栏，不追加任务模块子卡片 */
      if (hub === "communication") {
        setChatOpen(true);
        return;
      }
      if (onPushTaskChatCard) {
        onPushTaskChatCard("task_hub", { hub });
      }
    },
    [onPushTaskChatCard]
  );

  const openExecutionCreate = React.useCallback(
    (phase?: string) => {
      if (onPushTaskChatCard) {
        onPushTaskChatCard("execution", phase !== undefined ? { phase } : undefined);
        return;
      }
      setExecMode("create");
      setExecInitial(null);
      setExecCreatePhase(phase);
      setExecDrawerOpen(true);
    },
    [onPushTaskChatCard]
  );

  const openExecutionEdit = React.useCallback(() => {
    const initial: ExecutionContentValues = {
      title: "字段口径核对",
      assignee: detail.assignee,
      status: "执行中",
      phase: "设计阶段",
      difficulty: "",
    };
    if (onPushTaskChatCard) {
      onPushTaskChatCard("execution_edit", { initial });
      return;
    }
    setExecMode("edit");
    setExecInitial(initial);
    setExecDrawerOpen(true);
  }, [detail.assignee, onPushTaskChatCard]);

  const handlePrimaryAction = React.useCallback(
    (id: string) => {
      switch (id) {
      case "edit":
        onPushTaskChatCard?.("edit");
        return;
      case "subtask":
        onPushTaskChatCard?.("subtask");
        return;
      case "share":
        setShareOpen(true);
        return;
      case "pause":
        setPauseOpen(true);
        return;
      case "terminate":
        setTerminateOpen(true);
        return;
      default:
        return;
    }
    },
    [onPushTaskChatCard]
  );

  const handleMoreAction = React.useCallback(
    (id: string) => {
      switch (id) {
      case "handover":
        onPushTaskChatCard?.("handover");
        return;
      case "delete":
        setDeleteOpen(true);
        return;
      case "link_sub":
        onPushTaskChatCard?.("link_sub");
        return;
      case "approval_start":
      case "approval_view":
        return;
      case "eval_records":
        onPushTaskChatCard?.("eval");
        return;
      default:
        return;
    }
    },
    [onPushTaskChatCard]
  );

  return (
    <>
      <div className="w-full flex flex-col gap-[var(--space-300)]">
        <GenericCard
          title="任务详情"
          titleSuffix={
            titleUpdatedAt ? (
              <span className="text-[length:var(--font-size-xs)] text-text-tertiary">
                更新于{titleUpdatedAt}
              </span>
            ) : undefined
          }
          className="overflow-hidden"
        >
          <div className="w-full flex flex-col gap-[var(--space-300)]">
            {/* 任务标题 + 状态标签 */}
            <div className="flex flex-wrap items-center gap-x-[var(--space-200)] gap-y-[var(--space-150)]">
              <h4 className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text leading-snug m-0 shrink min-w-0 max-w-full">
                {detail.name}
              </h4>
              <span
                className={cn(
                  "inline-flex shrink-0 rounded-[var(--radius-100)] px-[var(--space-250)] py-[var(--space-100)] text-[length:var(--font-size-xs)]",
                  detail.status === "已完成"
                    ? "bg-success/15 text-success"
                    : detail.status === "进行中"
                      ? "bg-primary/15 text-primary"
                      : "bg-bg-tertiary text-text-secondary"
                )}
              >
                {detail.status}
              </span>
              <span
                className={cn(
                  "inline-flex shrink-0 rounded-[var(--radius-100)] px-[var(--space-250)] py-[var(--space-100)] text-[length:var(--font-size-xs)]",
                  detail.priority === "高" ? "bg-warning/15 text-warning" : "bg-bg-tertiary text-text-secondary"
                )}
              >
                {detail.priority}优先级
              </span>
              {riskHigh && (
                <span className="inline-flex shrink-0 rounded-[var(--radius-100)] px-[var(--space-250)] py-[var(--space-100)] text-[length:var(--font-size-xs)] bg-error/10 text-error">
                  风险关注
                </span>
              )}
            </div>

            {detailToolbarPlacement === "underTaskTitle" ? toolbarEl : null}

            {/* 基本信息：执行人、负责人、参与人、创建人、任务编码、任务周期、任务类型 */}
            <div className="rounded-[var(--radius-md)] border border-border bg-bg-secondary p-[var(--space-400)] w-full">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-400)] gap-y-[var(--space-500)]">
                <MetaItem
                  label="执行人"
                  noTruncate
                  value={
                    <PersonFieldInline names={resolvePersonNames(detail.assignees, detail.assignee)} />
                  }
                />
                <MetaItem
                  label="负责人"
                  noTruncate
                  value={<PersonFieldInline names={resolvePersonNames(detail.owners, detail.owner)} />}
                />
                <MetaItem
                  label="参与人"
                  noTruncate
                  value={<PersonFieldInline names={resolveParticipantNames(detail.participantNames)} />}
                />
                <MetaItem label="创建人" value={basic.creator} />
                <MetaItem label="任务编码" value={basic.code} />
                <MetaItem label="任务周期" value={basic.cycle} />
                <MetaItem label="任务类型" value={basic.typeLabel} />
              </div>
              <div className="mt-[var(--space-400)] pt-[var(--space-400)] border-t border-border-divider">
                <button
                  type="button"
                  aria-label="查看任务描述详情"
                  onClick={() => setDescDrawerOpen(true)}
                  className={cn(
                    "w-full rounded-[var(--radius-md)] border-0 bg-transparent text-left cursor-pointer",
                    "p-[var(--space-300)] -mx-[var(--space-100)] -mb-[var(--space-100)]",
                    "hover:bg-[var(--black-alpha-11)] transition-colors",
                    "outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  )}
                >
                  <div className="flex items-center justify-between gap-[var(--space-300)] mb-[var(--space-200)]">
                    <span className="text-[length:var(--font-size-xxs)] text-text-tertiary uppercase tracking-wide">
                      任务描述
                    </span>
                    <span className="text-[length:var(--font-size-xs)] text-primary shrink-0 font-[var(--font-weight-medium)]">
                      查看详情
                    </span>
                  </div>
                  <p className="text-[length:var(--font-size-sm)] text-text leading-snug line-clamp-2 m-0 pointer-events-none">
                    {detail.description}
                  </p>
                </button>
              </div>
            </div>

            <TaskProgressSection detail={detail} />

            {detailToolbarPlacement === "bottom" ? toolbarEl : null}
          </div>
        </GenericCard>

        {/* 与 OrganizationSwitcherCard 等一致：卡片外左下，仅保留入口 pill */}
        <div className="flex flex-wrap gap-[var(--space-200)] w-full justify-start">
          {TASK_HUB_ENTRY_ORDER.map((hub) => (
            <ChatPromptButton key={hub} type="button" onClick={() => pushTaskHub(hub)}>
              {TASK_HUB_LABELS[hub]}
            </ChatPromptButton>
          ))}
        </div>
      </div>

      <TaskGroupChatDrawer open={chatOpen} onOpenChange={setChatOpen} taskTitle={detail.name} />
      <TaskDescriptionDrawer
        open={descDrawerOpen}
        onOpenChange={setDescDrawerOpen}
        description={detail.description}
        operationLogs={buildOperationLogs(detail)}
      />
      <ExecutionContentDrawer
        open={execDrawerOpen}
        onOpenChange={setExecDrawerOpen}
        mode={execMode}
        initialValues={execInitial}
        defaultAssignee={detail.assignee}
        defaultPhase={execMode === "create" ? execCreatePhase : undefined}
      />

      <ShareTaskDialog open={shareOpen} onOpenChange={setShareOpen} />
      <PauseTaskDialog open={pauseOpen} onOpenChange={setPauseOpen} />
      <TerminateTaskDialog open={terminateOpen} onOpenChange={setTerminateOpen} />
      <DeleteTaskDialog open={deleteOpen} onOpenChange={setDeleteOpen} />
    </>
  );
}

const KANBAN_PHASES = ["产品阶段", "设计阶段", "研发阶段", "测试阶段", "走查阶段"];

type KanbanColumnFilter = "all" | "mine" | "subordinate";

function KanbanBoardColumns({
  detail,
  onExecutionCreate,
  onExecutionEdit,
  columnFilter,
}: {
  detail: TaskDetailData;
  onExecutionCreate: (phase?: string) => void;
  onExecutionEdit: () => void;
  columnFilter: KanbanColumnFilter;
}) {
  return (
    <div className="flex gap-[var(--space-300)] overflow-x-auto pb-[var(--space-200)] scrollbar-hide">
      {KANBAN_PHASES.map((phase) => {
        const showMineCard =
          (columnFilter === "all" || columnFilter === "mine") && phase === "设计阶段";
        const showSubCard = columnFilter === "subordinate" && phase === "研发阶段";
        const count = showMineCard ? 1 : showSubCard ? 1 : 0;
        return (
          <div key={phase} className="min-w-[200px] flex-1 flex flex-col gap-[var(--space-200)]">
            <div className="flex items-center justify-between text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text">
              <span>
                {phase} {count}
              </span>
              <IconBtn
                label="添加执行内容"
                className="text-primary p-[var(--space-100)] rounded-[var(--radius-md)] hover:bg-primary/10 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => onExecutionCreate(phase)}
              >
                <Plus className="size-[16px]" />
              </IconBtn>
            </div>
            <div className="rounded-[var(--radius-md)] border border-border bg-bg-secondary min-h-[120px] p-[var(--space-200)] flex flex-col gap-[var(--space-200)]">
              {showMineCard ? (
                <div className="rounded-[var(--radius-md)] border border-border bg-bg p-[var(--space-250)] shadow-xs">
                  <div className="flex items-start gap-[var(--space-150)] mb-[var(--space-150)]">
                    <span className="text-[length:var(--font-size-xxs)] px-[var(--space-100)] py-[2px] rounded-[var(--radius-sm)] bg-warning/20 text-warning">
                      执
                    </span>
                    <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text flex-1 leading-snug">
                      测试任务2
                    </span>
                  </div>
                  <p className="text-[length:var(--font-size-xxs)] text-error mb-[var(--space-150)]">
                    执行中 · 09-04 16:38 开始
                  </p>
                  <div className="flex items-center gap-[var(--space-100)] text-[length:var(--font-size-xxs)] text-text-secondary">
                    <span className="inline-flex items-center gap-[var(--space-100)]">
                      <span className="inline-block size-[6px] rounded-full bg-text-tertiary" />
                      {detail.assignee}
                    </span>
                  </div>
                  <div className="flex gap-[var(--space-100)] mt-[var(--space-200)] text-text-tertiary justify-end">
                    <IconBtn
                      label="暂停"
                      className="p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--black-alpha-11)]"
                    >
                      <Pause className="size-[14px]" />
                    </IconBtn>
                    <IconBtn
                      label="编辑"
                      className="p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--black-alpha-11)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExecutionEdit();
                      }}
                    >
                      <Pencil className="size-[14px]" />
                    </IconBtn>
                    <IconBtn
                      label="更多操作"
                      className="p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--black-alpha-11)]"
                    >
                      <MoreHorizontal className="size-[14px]" />
                    </IconBtn>
                  </div>
                </div>
              ) : null}
              {showSubCard ? (
                <div className="rounded-[var(--radius-md)] border border-border bg-bg p-[var(--space-250)] shadow-xs">
                  <div className="flex items-start gap-[var(--space-150)] mb-[var(--space-150)]">
                    <span className="text-[length:var(--font-size-xxs)] px-[var(--space-100)] py-[2px] rounded-[var(--radius-sm)] bg-bg-tertiary text-text-secondary">
                      协
                    </span>
                    <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text flex-1 leading-snug">
                      接口联调支援
                    </span>
                  </div>
                  <p className="text-[length:var(--font-size-xxs)] text-text-secondary mb-[var(--space-150)]">
                    未开始 · 待排期
                  </p>
                  <div className="flex items-center gap-[var(--space-100)] text-[length:var(--font-size-xxs)] text-text-secondary">
                    <span className="inline-flex items-center gap-[var(--space-100)]">
                      <span className="inline-block size-[6px] rounded-full bg-text-tertiary" />
                      王工
                    </span>
                  </div>
                  <div className="flex gap-[var(--space-100)] mt-[var(--space-200)] text-text-tertiary justify-end">
                    <IconBtn
                      label="暂停"
                      className="p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--black-alpha-11)]"
                    >
                      <Pause className="size-[14px]" />
                    </IconBtn>
                    <IconBtn
                      label="编辑"
                      className="p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--black-alpha-11)]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExecutionEdit();
                      }}
                    >
                      <Pencil className="size-[14px]" />
                    </IconBtn>
                    <IconBtn
                      label="更多操作"
                      className="p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] hover:bg-[var(--black-alpha-11)]"
                    >
                      <MoreHorizontal className="size-[14px]" />
                    </IconBtn>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KanbanTab({
  detail,
  onExecutionCreate,
  onExecutionEdit,
}: {
  detail: TaskDetailData;
  onExecutionCreate: (phase?: string) => void;
  onExecutionEdit: () => void;
}) {
  return (
    <div className="flex flex-col gap-[var(--space-300)] w-full">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="shrink-0 h-[var(--space-700)] text-[length:var(--font-size-xs)]"
          onClick={() => onExecutionCreate()}
        >
          + 新建执行内容
        </Button>
      </div>
      <KanbanBoardColumns
        detail={detail}
        onExecutionCreate={onExecutionCreate}
        onExecutionEdit={onExecutionEdit}
        columnFilter="all"
      />
    </div>
  );
}

/** 会话流：我的看板 / 下属看板 */
export function KanbanScopeListCard({
  detail,
  scope,
}: {
  detail: TaskDetailData;
  scope: "mine" | "subordinate";
}) {
  const title = scope === "mine" ? "我的看板" : "下属看板";
  const noop = React.useCallback(() => {}, []);
  return (
    <GenericCard title={title} subtitle={detail.name} className="overflow-hidden">
      <KanbanBoardColumns
        detail={detail}
        onExecutionCreate={noop}
        onExecutionEdit={noop}
        columnFilter={scope === "mine" ? "mine" : "subordinate"}
      />
    </GenericCard>
  );
}

type OutputRow = {
  id: string;
  title: string;
  /** 来源，如「当前任务」 */
  source: string;
  /** 产出物链接 */
  deliverableUrl: string;
  owner: string;
  updatedAt: string;
};

/* ─── 原「产出」Tab 内嵌表单（NewOutputForm）：已改为会话流独立卡片 NewOutputFormCard（TaskChatCards + <<<RENDER_NEW_OUTPUT_FORM>>>），保留注释便于恢复 ───
const OUTPUT_TOOL_OPTIONS = ["Figma", "Sketch", "Office 文档", "原型工具", "Notion", "其他"] as const;
const OUTPUT_TYPE_OPTIONS = ["文档", "附件", "设计稿", "链接", "数据", "其他"] as const;
const OUTPUT_VISIBILITY_OPTIONS = [
  { value: "task_public", label: "公开 (该任务的人员可见)" },
  { value: "assignee_only", label: "仅经办人可见" },
  { value: "self_only", label: "仅自己可见" },
] as const;

function NewOutputForm({
  defaultProducer,
  onClose,
  onConfirm,
}: {
  defaultProducer: string;
  onClose: () => void;
  onConfirm: (payload: {
    title: string;
    tool: string;
    linkOrAttach: string;
    producer: string;
    outputType: string;
    visibility: string;
    linkProject: boolean;
    linkGoal: boolean;
    notifyMembers: boolean;
  }) => void;
}) {
  const [title, setTitle] = React.useState("");
  const [tool, setTool] = React.useState<string>(OUTPUT_TOOL_OPTIONS[0]);
  const [linkOrAttach, setLinkOrAttach] = React.useState("");
  const [producer, setProducer] = React.useState(defaultProducer);
  const [outputType, setOutputType] = React.useState<string>(OUTPUT_TYPE_OPTIONS[0]);
  const [visibility, setVisibility] = React.useState<string>(OUTPUT_VISIBILITY_OPTIONS[0].value);
  const [linkProject, setLinkProject] = React.useState(false);
  const [linkGoal, setLinkGoal] = React.useState(false);
  const [notifyMembers, setNotifyMembers] = React.useState(true);

  React.useEffect(() => {
    setProducer(defaultProducer);
  }, [defaultProducer]);

  const resetFields = React.useCallback(() => {
    setTitle("");
    setTool(OUTPUT_TOOL_OPTIONS[0]);
    setLinkOrAttach("");
    setProducer(defaultProducer);
    setOutputType(OUTPUT_TYPE_OPTIONS[0]);
    setVisibility(OUTPUT_VISIBILITY_OPTIONS[0].value);
    setLinkProject(false);
    setLinkGoal(false);
    setNotifyMembers(true);
  }, [defaultProducer]);

  const fieldClass =
    "h-[var(--space-900)] rounded-[var(--radius-input)] text-[length:var(--font-size-sm)] border border-border bg-bg";

  const trySubmit = React.useCallback(() => {
    const t = title.trim();
    const link = linkOrAttach.trim();
    if (!t || !link) return;
    onConfirm({
      title: t,
      tool,
      linkOrAttach: link,
      producer: producer.trim(),
      outputType,
      visibility,
      linkProject,
      linkGoal,
      notifyMembers,
    });
    resetFields();
    onClose();
  }, [
    title,
    linkOrAttach,
    tool,
    producer,
    outputType,
    visibility,
    linkProject,
    linkGoal,
    notifyMembers,
    onConfirm,
    resetFields,
    onClose,
  ]);

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg p-[var(--space-400)] flex flex-col gap-[var(--space-400)] w-full shadow-elevation-sm">
      <div className="flex items-center justify-between gap-[var(--space-300)]">
        <h6 className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text m-0">新增产出</h6>
        <button
          type="button"
          onClick={() => {
            resetFields();
            onClose();
          }}
          title="关闭"
          className="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-text-secondary hover:bg-[var(--black-alpha-11)] hover:text-text outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="关闭"
        >
          <X className="size-[18px]" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex flex-col gap-[var(--space-400)]">
        <div className="flex gap-[var(--space-250)] items-start">
          <FileText className="size-[18px] text-text-tertiary shrink-0 mt-[6px]" strokeWidth={1.5} />
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">产出物标题</Label>
            <div className="flex gap-[var(--space-200)] items-end">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 50))}
                placeholder="产出物标题"
                className={cn("flex-1", fieldClass)}
              />
              <span className="text-[length:var(--font-size-xxs)] text-text-tertiary tabular-nums shrink-0 pb-2">
                {title.length} / 50
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-[var(--space-250)] items-start">
          <Briefcase className="size-[18px] text-text-tertiary shrink-0 mt-[6px]" strokeWidth={1.5} />
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">产出工具</Label>
            <Select value={tool} onValueChange={setTool}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="产出工具" />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_TOOL_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-[var(--space-250)] items-start">
          <Link2 className="size-[18px] text-text-tertiary shrink-0 mt-[6px]" strokeWidth={1.5} />
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
              产出物链接或添加附件 <span className="text-error">*</span>
            </Label>
            <Textarea
              value={linkOrAttach}
              onChange={(e) => setLinkOrAttach(e.target.value.slice(0, 2000))}
              placeholder="产出物链接或添加附件 (必填)"
              className="min-h-[120px] rounded-[var(--radius-md)] text-[length:var(--font-size-sm)] border-border bg-bg"
            />
            <div className="flex justify-end items-center gap-[var(--space-200)]">
              <button
                type="button"
                className="inline-flex items-center gap-[var(--space-100)] text-[length:var(--font-size-xxs)] text-primary hover:underline"
              >
                <Paperclip className="size-[14px]" />
                上传附件
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-[var(--space-250)] items-start">
          <UserPlus className="size-[18px] text-text-tertiary shrink-0 mt-[6px]" strokeWidth={1.5} />
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">产出人</Label>
            <div className="flex gap-[var(--space-200)]">
              <Input
                value={producer}
                onChange={(e) => setProducer(e.target.value)}
                placeholder="产出人"
                className={cn("flex-1", fieldClass)}
              />
              <Button type="button" variant="secondary" size="sm" className="shrink-0">
                + 选择
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-[var(--space-250)] items-start">
          <LayoutGrid className="size-[18px] text-text-tertiary shrink-0 mt-[6px]" strokeWidth={1.5} />
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">产出类型</Label>
            <Select value={outputType} onValueChange={setOutputType}>
              <SelectTrigger className={fieldClass}>
                <SelectValue placeholder="产出类型" />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_TYPE_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-[var(--space-250)] items-start">
          <Lock className="size-[18px] text-text-tertiary shrink-0 mt-[6px]" strokeWidth={1.5} />
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">公开范围</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger className={fieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {OUTPUT_VISIBILITY_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-[var(--space-250)] items-start">
          <Target className="size-[18px] text-text-tertiary shrink-0 mt-[6px]" strokeWidth={1.5} />
          <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">关联</Label>
            <div className="flex flex-wrap gap-[var(--space-400)] items-center">
              <div className="flex items-center gap-[var(--space-200)]">
                <Checkbox
                  id="output-link-project"
                  checked={linkProject}
                  onCheckedChange={(v) => setLinkProject(v === true)}
                  className="size-[14px]"
                />
                <Label htmlFor="output-link-project" className="text-[length:var(--font-size-xs)] text-text font-normal cursor-pointer">
                  关联的项目
                </Label>
              </div>
              <div className="flex items-center gap-[var(--space-200)]">
                <Checkbox
                  id="output-link-goal"
                  checked={linkGoal}
                  onCheckedChange={(v) => setLinkGoal(v === true)}
                  className="size-[14px]"
                />
                <Label htmlFor="output-link-goal" className="text-[length:var(--font-size-xs)] text-text font-normal cursor-pointer">
                  关联的目标
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[var(--space-200)]">
          <Checkbox
            id="output-notify"
            checked={notifyMembers}
            onCheckedChange={(v) => setNotifyMembers(v === true)}
            className="size-[14px]"
          />
          <Label htmlFor="output-notify" className="text-[length:var(--font-size-xs)] text-text font-normal cursor-pointer">
            通知任务成员
          </Label>
        </div>
      </div>

      <div className="flex flex-wrap gap-[var(--space-300)] justify-end pt-[var(--space-200)] border-t border-border-divider">
        <Button
          type="button"
          variant="chat-reset"
          onClick={() => {
            resetFields();
            onClose();
          }}
        >
          取消
        </Button>
        <Button type="button" variant="chat-submit" onClick={trySubmit}>
          确定
        </Button>
      </div>
    </div>
  );
}
*/

function OutputTab({
  onRequestNewOutput,
}: {
  /** 在会话流中推送「新建产出」表单卡片（与任务详情 onPushTaskChatCard 一致） */
  onRequestNewOutput?: () => void;
}) {
  const [rows, setRows] = React.useState<OutputRow[]>(() => [
    {
      id: "out-seed-1",
      title: "1111",
      source: "当前任务",
      deliverableUrl: "https://www.figma.com/design/ccWvK9xSampleDeliverable",
      owner: "迟婉",
      updatedAt: "2025-09-04 11:14",
    },
    {
      id: "out-seed-2",
      title: "字段映射表.xlsx",
      source: "当前任务",
      deliverableUrl: "https://example.com/files/mapping.xlsx",
      owner: "李四",
      updatedAt: "2026-04-08 10:05",
    },
  ]);

  return (
    <div className="w-full flex flex-col gap-[var(--space-300)]">
      {/*
      原内嵌表单：formOpen ? <NewOutputForm ... /> : (
        <Button onClick={() => onFormOpenChange(true)}>新建产出</Button>
      )
      已改为 onRequestNewOutput → 会话流独立卡片 NewOutputFormCard，见 MainAIChatWindow NEW_OUTPUT_FORM_MARKER
      */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-[var(--space-700)] text-[length:var(--font-size-xs)]"
          onClick={() => onRequestNewOutput?.()}
        >
          新建产出
        </Button>
      </div>

      <div className={LIST_TABLE_WRAP}>
        <Table>
          <TableHeader>
            <TableRow className={cn(LIST_TR_HEADER, "bg-bg-tertiary hover:bg-bg-tertiary")}>
              <TableHead className={LIST_TH}>标题</TableHead>
              <TableHead className={LIST_TH}>
                <span className="inline-flex items-center gap-[var(--space-100)]">
                  来源
                  <ChevronDown className="size-[14px] text-text-tertiary shrink-0" strokeWidth={2} />
                </span>
              </TableHead>
              <TableHead className={LIST_TH}>产出物</TableHead>
              <TableHead className={cn(LIST_TH, "whitespace-nowrap")}>今日更新趋势</TableHead>
              <TableHead className={LIST_TH}>产出人</TableHead>
              <TableHead className={LIST_TH}>
                <span className="inline-flex items-center gap-[var(--space-100)]">
                  更新时间
                  <ArrowUpDown className="size-[14px] text-text-tertiary shrink-0" strokeWidth={2} />
                </span>
              </TableHead>
              <TableHead className={LIST_TH_OP}>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id} className={LIST_TR_BODY}>
                <TableCell className={cn(LIST_TD, "max-w-[180px]")}>
                  <span className="line-clamp-2">{r.title}</span>
                </TableCell>
                <TableCell className={LIST_TD}>{r.source}</TableCell>
                <TableCell className={cn(LIST_TD, "max-w-[min(280px,36vw)]")}>
                  {r.deliverableUrl.match(/^https?:\/\//i) ? (
                    <a
                      href={r.deliverableUrl}
                      target="_blank"
                      rel="noreferrer"
                      title={r.deliverableUrl}
                      className="text-primary hover:underline text-[length:var(--font-size-xs)] truncate block"
                    >
                      {r.deliverableUrl}
                    </a>
                  ) : (
                    <span className="text-[length:var(--font-size-xs)] text-text truncate block" title={r.deliverableUrl}>
                      {r.deliverableUrl}
                    </span>
                  )}
                </TableCell>
                <TableCell className={LIST_TD}>
                  <div
                    className="h-7 w-[72px] max-w-full rounded-[var(--radius-sm)] border border-dashed border-border bg-bg-secondary/60"
                    aria-hidden
                    title="趋势（演示占位）"
                  />
                </TableCell>
                <TableCell className={LIST_TD}>{r.owner}</TableCell>
                <TableCell className={cn(LIST_TD, "tabular-nums whitespace-nowrap")}>{r.updatedAt}</TableCell>
                <TableCell className={LIST_TD_OP}>
                  <div className="inline-flex items-center justify-end gap-[var(--space-100)]">
                    <IconBtn
                      label="编辑"
                      className="inline-flex p-[var(--space-100)] rounded-[var(--radius-md)] text-text-tertiary hover:text-primary hover:bg-[var(--black-alpha-11)] transition-colors"
                    >
                      <Pencil className="size-[14px]" />
                    </IconBtn>
                    <IconBtn
                      label="在新窗口打开"
                      className="inline-flex p-[var(--space-100)] rounded-[var(--radius-md)] text-text-tertiary hover:text-primary hover:bg-[var(--black-alpha-11)] transition-colors"
                      onClick={() => {
                        if (r.deliverableUrl.match(/^https?:\/\//i)) {
                          window.open(r.deliverableUrl, "_blank", "noopener,noreferrer");
                        }
                      }}
                    >
                      <SquareArrowOutUpRight className="size-[14px]" />
                    </IconBtn>
                    <IconBtn
                      label="删除"
                      className="inline-flex p-[var(--space-100)] rounded-[var(--radius-md)] text-text-tertiary hover:text-error hover:bg-[var(--black-alpha-11)] transition-colors"
                      onClick={() => setRows((prev) => prev.filter((x) => x.id !== r.id))}
                    >
                      <Trash2 className="size-[14px]" />
                    </IconBtn>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function feedbackStatusPillClass(status: string) {
  if (status === "已完成") {
    return "bg-emerald-500/12 text-emerald-700 dark:text-emerald-400";
  }
  if (status === "待处理") {
    return "bg-warning/15 text-warning";
  }
  if (status === "处理中") {
    return "bg-primary/15 text-primary";
  }
  return "bg-bg-tertiary text-text-secondary";
}

function formatFeedbackTime() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function FeedbackTab({
  actorName,
  taskName,
  formOpen,
  onFormOpenChange,
}: {
  actorName: string;
  /** 当前任务名称，反馈详情「反馈对象」用 */
  taskName: string;
  formOpen: boolean;
  onFormOpenChange: (open: boolean) => void;
}) {
  const [feedbackDetailOpen, setFeedbackDetailOpen] = React.useState(false);
  const [feedbackDetailItem, setFeedbackDetailItem] = React.useState<FeedbackListItem | null>(null);
  const [feedbackDetailInitialPanel, setFeedbackDetailInitialPanel] = React.useState<"detail" | "edit">("detail");

  const [items, setItems] = React.useState<FeedbackListItem[]>(() => [
    {
      id: "fb-seed-1",
      title: "数仓排期阻塞",
      body: "",
      assignee: "张三",
      participants: "",
      feedbackType: "问题",
      anonymous: false,
      time: "2026-04-10 11:28",
      status: "处理中",
      source: "当前任务",
      reporterName: "张三",
    },
    {
      id: "fb-seed-2",
      title: "口径确认待业务签字",
      body: "",
      assignee: "李四",
      participants: "",
      feedbackType: "问题",
      anonymous: false,
      time: "2026-04-09 09:12",
      status: "待处理",
      source: "当前任务",
      reporterName: "李四",
    },
  ]);

  const appendFeedback = React.useCallback(
    (payload: {
      title: string;
      body: string;
      assignee: string;
      participants: string;
      feedbackType: string;
      anonymous: boolean;
    }) => {
      const row: FeedbackListItem = {
        id: `fb-${Date.now()}`,
        title: payload.title.trim(),
        body: payload.body,
        assignee: payload.anonymous ? "" : payload.assignee.trim(),
        participants: payload.participants.trim(),
        feedbackType: payload.feedbackType,
        anonymous: payload.anonymous,
        time: formatFeedbackTime(),
        status: "待处理",
        source: "当前任务",
        reporterName: payload.anonymous ? "匿名" : actorName,
      };
      setItems((prev) => [row, ...prev]);
    },
    [actorName]
  );

  return (
    <div className="flex flex-col gap-[var(--space-400)] w-full">
      <FeedbackDetailDrawer
        open={feedbackDetailOpen}
        onOpenChange={(o) => {
          setFeedbackDetailOpen(o);
          if (!o) {
            setFeedbackDetailItem(null);
            setFeedbackDetailInitialPanel("detail");
          }
        }}
        item={feedbackDetailItem}
        taskName={taskName}
        initialPanel={feedbackDetailInitialPanel}
      />
      {formOpen ? (
        <NewFeedbackForm
          onClose={() => onFormOpenChange(false)}
          onAppend={appendFeedback}
          onConfirmClose={() => onFormOpenChange(false)}
        />
      ) : (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-[var(--space-700)] text-[length:var(--font-size-xs)]"
            onClick={() => onFormOpenChange(true)}
          >
            新建反馈
          </Button>
        </div>
      )}

      <div className={LIST_TABLE_WRAP}>
        <Table>
          <TableHeader>
            <TableRow className={cn(LIST_TR_HEADER, "bg-bg-tertiary hover:bg-bg-tertiary")}>
              <TableHead className={cn(LIST_TH, "max-w-[220px]")}>名称</TableHead>
              <TableHead className={LIST_TH}>
                <span className="inline-flex items-center gap-[var(--space-100)]">
                  来源
                  <ChevronDown className="size-[14px] text-text-tertiary shrink-0" strokeWidth={2} />
                </span>
              </TableHead>
              <TableHead className={LIST_TH}>反馈人</TableHead>
              <TableHead className={LIST_TH}>
                <span className="inline-flex items-center gap-[var(--space-100)]">
                  反馈类型
                  <ChevronDown className="size-[14px] text-text-tertiary shrink-0" strokeWidth={2} />
                </span>
              </TableHead>
              <TableHead className={LIST_TH}>
                <span className="inline-flex items-center gap-[var(--space-100)]">
                  状态
                  <ChevronDown className="size-[14px] text-text-tertiary shrink-0" strokeWidth={2} />
                </span>
              </TableHead>
              <TableHead className={LIST_TH}>
                <span className="inline-flex items-center gap-[var(--space-100)]">
                  反馈时间
                  <ArrowUpDown className="size-[14px] text-text-tertiary shrink-0" strokeWidth={2} />
                </span>
              </TableHead>
              <TableHead className={LIST_TH}>经办人</TableHead>
              <TableHead className={LIST_TH}>参与人</TableHead>
              <TableHead className={cn(LIST_TH, "w-[40px] text-center px-[var(--space-200)]")}>严</TableHead>
              <TableHead className={LIST_TH_OP}>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((f) => (
              <TableRow
                key={f.id}
                className={cn(LIST_TR_BODY, "cursor-pointer")}
                role="button"
                tabIndex={0}
                onClick={() => {
                  setFeedbackDetailItem(f);
                  setFeedbackDetailInitialPanel("detail");
                  setFeedbackDetailOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setFeedbackDetailItem(f);
                    setFeedbackDetailInitialPanel("detail");
                    setFeedbackDetailOpen(true);
                  }
                }}
              >
                <TableCell className={cn(LIST_TD, "max-w-[220px]")}>
                  <span className="line-clamp-2 font-[var(--font-weight-medium)]">{f.title}</span>
                </TableCell>
                <TableCell className={LIST_TD}>{f.source}</TableCell>
                <TableCell className={LIST_TD}>{f.reporterName}</TableCell>
                <TableCell className={LIST_TD}>{f.feedbackType}</TableCell>
                <TableCell className={LIST_TD}>
                  <span
                    className={cn(
                      "inline-flex rounded-[var(--radius-100)] px-[var(--space-200)] py-[var(--space-50)] text-[length:var(--font-size-xs)]",
                      feedbackStatusPillClass(f.status)
                    )}
                  >
                    {f.status}
                  </span>
                </TableCell>
                <TableCell className={cn(LIST_TD, "tabular-nums whitespace-nowrap")}>{f.time}</TableCell>
                <TableCell className={LIST_TD}>{f.assignee || "—"}</TableCell>
                <TableCell className={cn(LIST_TD, "max-w-[120px] truncate")} title={f.participants || undefined}>
                  {f.participants?.trim() ? f.participants : "—"}
                </TableCell>
                <TableCell className={cn(LIST_TD, "text-center text-text-tertiary px-[var(--space-200)]")}>—</TableCell>
                <TableCell
                  className={LIST_TD_OP}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                >
                  <div className="inline-flex items-center justify-end gap-[var(--space-100)]">
                    <IconBtn
                      label="编辑"
                      className="inline-flex p-[var(--space-100)] rounded-[var(--radius-md)] text-text-tertiary hover:text-primary hover:bg-[var(--black-alpha-11)] transition-colors"
                      onClick={() => {
                        setFeedbackDetailItem(f);
                        setFeedbackDetailInitialPanel("edit");
                        setFeedbackDetailOpen(true);
                      }}
                    >
                      <Pencil className="size-[14px]" />
                    </IconBtn>
                    <IconBtn
                      label="打开"
                      className="inline-flex p-[var(--space-100)] rounded-[var(--radius-md)] text-text-tertiary hover:text-primary hover:bg-[var(--black-alpha-11)] transition-colors"
                    >
                      <SquareArrowOutUpRight className="size-[14px]" />
                    </IconBtn>
                    <IconBtn
                      label="更多"
                      className="inline-flex p-[var(--space-100)] rounded-[var(--radius-md)] text-text-tertiary hover:text-primary hover:bg-[var(--black-alpha-11)] transition-colors"
                    >
                      <MoreHorizontal className="size-[14px]" />
                    </IconBtn>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function NewFeedbackForm({
  onClose,
  onAppend,
  onConfirmClose,
}: {
  onClose: () => void;
  onAppend: (payload: {
    title: string;
    body: string;
    assignee: string;
    participants: string;
    feedbackType: string;
    anonymous: boolean;
  }) => void;
  onConfirmClose: () => void;
}) {
  const [name, setName] = React.useState("");
  const [body, setBody] = React.useState("");
  const [assignee, setAssignee] = React.useState("");
  const [participants, setParticipants] = React.useState("");
  const [feedbackType, setFeedbackType] = React.useState("问题");
  const [anonymous, setAnonymous] = React.useState(false);

  const resetFields = React.useCallback(() => {
    setName("");
    setBody("");
    setAssignee("");
    setParticipants("");
    setFeedbackType("问题");
    setAnonymous(false);
  }, []);

  const trySubmit = React.useCallback(
    (mode: "continue" | "confirm") => {
      const title = name.trim();
      if (!title) return;
      onAppend({
        title,
        body,
        assignee: anonymous ? "" : assignee,
        participants,
        feedbackType,
        anonymous,
      });
      resetFields();
      if (mode === "confirm") {
        onConfirmClose();
      }
    },
    [name, body, assignee, participants, feedbackType, anonymous, onAppend, resetFields, onConfirmClose]
  );

  return (
    <div className="rounded-[var(--radius-md)] border border-border bg-bg p-[var(--space-400)] flex flex-col gap-[var(--space-400)] w-full">
      <div className="flex items-center justify-between gap-[var(--space-300)]">
        <h6 className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text m-0">新建反馈</h6>
        <button
          type="button"
          onClick={() => {
            resetFields();
            onClose();
          }}
          title="关闭"
          className="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-text-secondary hover:bg-[var(--black-alpha-11)] hover:text-text outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="关闭"
        >
          <X className="size-[18px]" strokeWidth={1.5} />
        </button>
      </div>
      <div className="flex flex-col gap-[var(--space-150)]">
        <Label className="text-[length:var(--font-size-xs)] text-text-secondary">反馈名称 (必填)</Label>
        <div className="flex gap-[var(--space-200)] items-end">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 100))}
            placeholder="反馈名称 (必填)"
            className="flex-1 h-[var(--space-900)] rounded-[var(--radius-input)] border-border bg-bg"
          />
          <span className="text-[length:var(--font-size-xxs)] text-text-tertiary tabular-nums shrink-0 pb-2">{name.length}/100</span>
        </div>
      </div>
      <div className="flex flex-col gap-0">
        <div className="flex flex-wrap gap-[var(--space-200)] text-[length:var(--font-size-xxs)] text-text-secondary border border-border rounded-t-[var(--radius-md)] border-b-0 px-[var(--space-250)] py-[var(--space-200)] bg-bg-secondary">
          <span>字号</span>
          <span className="font-[var(--font-weight-semi-bold)]">B</span>
          <span className="italic">I</span>
          <span className="underline">U</span>
          <span>列表</span>
          <span>链接</span>
        </div>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value.slice(0, 5000))}
          placeholder="支持文字、图片混排"
          className="min-h-[140px] rounded-t-none border-t-0 rounded-b-[var(--radius-md)] text-[length:var(--font-size-sm)] border-border bg-bg"
        />
        <div className="flex justify-end items-center gap-[var(--space-300)] text-[length:var(--font-size-xxs)] text-text-tertiary mt-[var(--space-150)]">
          <button type="button" className="text-primary hover:underline mr-auto">
            上传附件
          </button>
          <span className="tabular-nums">{body.length}/5000</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)]">
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">经办人</Label>
          <div className="flex gap-[var(--space-200)]">
            <Input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="选择成员"
              className="flex-1 h-[var(--space-900)] rounded-[var(--radius-input)] border-border bg-bg"
            />
            <Button type="button" variant="secondary" size="sm" className="shrink-0">
              + 选择
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">参与人</Label>
          <div className="flex gap-[var(--space-200)]">
            <Input
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              placeholder="选择成员"
              className="flex-1 h-[var(--space-900)] rounded-[var(--radius-input)] border-border bg-bg"
            />
            <Button type="button" variant="secondary" size="sm" className="shrink-0">
              + 选择
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-[var(--space-150)] md:col-span-2">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">反馈类型</Label>
          <Select value={feedbackType} onValueChange={setFeedbackType}>
            <SelectTrigger className="h-[var(--space-900)] rounded-[var(--radius-input)] border-border bg-bg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="问题">问题</SelectItem>
              <SelectItem value="建议">建议</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="flex items-center gap-[var(--space-200)]">
        <Checkbox
          id="feedback-anonymous"
          checked={anonymous}
          onCheckedChange={(v) => setAnonymous(v === true)}
          className="size-[14px]"
        />
        <Label htmlFor="feedback-anonymous" className="text-[length:var(--font-size-xs)] text-text font-normal cursor-pointer">
          匿名反馈
        </Label>
      </div>
      <div className="flex w-full min-w-0 flex-wrap items-stretch gap-[var(--space-300)] border-t border-border-divider pt-[var(--space-200)] sm:flex-nowrap">
        <div className="flex flex-wrap items-center gap-[var(--space-300)] shrink-0">
          <Button
            type="button"
            variant="chat-reset"
            onClick={() => {
              resetFields();
              onClose();
            }}
          >
            取消
          </Button>
          <Button type="button" variant="chat-reset" onClick={() => trySubmit("continue")}>
            提交并继续
          </Button>
        </div>
        <Button type="button" variant="chat-submit" className="min-w-0 flex-1 sm:min-w-[88px]" onClick={() => trySubmit("confirm")}>
          确定
        </Button>
      </div>
    </div>
  );
}

function RiskTab() {
  return (
    <div className="flex flex-col gap-[var(--space-300)] w-full">
      <div className={LIST_TABLE_WRAP}>
        <Table>
          <TableHeader>
            <TableRow className={LIST_TR_HEADER}>
              <TableHead className={cn(LIST_TH, "whitespace-nowrap")}>内容</TableHead>
              <TableHead className={cn(LIST_TH, "whitespace-nowrap")}>来源</TableHead>
              <TableHead className={cn(LIST_TH, "whitespace-nowrap")}>类型</TableHead>
              <TableHead className={cn(LIST_TH, "whitespace-nowrap")}>等级</TableHead>
              <TableHead className={cn(LIST_TH, "whitespace-nowrap")}>跟进人</TableHead>
              <TableHead className={cn(LIST_TH, "whitespace-nowrap")}>日期</TableHead>
              <TableHead className={cn(LIST_TH, "whitespace-nowrap")}>状态</TableHead>
              <TableHead className={cn(LIST_TH, "whitespace-nowrap")}>附件</TableHead>
              <TableHead className={LIST_TH_OP}>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className={LIST_TR_BODY}>
              <TableCell
                colSpan={9}
                className={cn(
                  LIST_TD,
                  "!py-[var(--space-1000)] text-center text-[length:var(--font-size-sm)] text-text-tertiary"
                )}
              >
                <div className="flex flex-col items-center gap-[var(--space-300)]">
                  <ClipboardList className="size-[48px] opacity-30" />
                  暂无数据
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function DynamicsTab() {
  const items = [
    {
      time: "2025-11-12 11:21",
      name: "迟娩",
      action: "更新任务",
      detail: "删除执行内容：「测试任务…」，执行人：「迟娩」，预计工时：「0.0小时」",
      seed: "chi",
    },
    {
      time: "2025-11-11 09:03",
      name: "迟娩",
      action: "新增产出",
      detail: "产出标题：「1111」",
      seed: "chi2",
    },
  ];
  return (
    <div className="flex flex-col gap-[var(--space-400)] w-full">
      <div className="w-full">
        <ul className="flex flex-col gap-[var(--space-500)]">
          {items.map((it) => (
            <li key={it.time + it.detail} className="relative">
              <p className="text-[length:var(--font-size-xxs)] text-text-tertiary mb-[var(--space-200)] tabular-nums">{it.time}</p>
              <div className="rounded-[var(--radius-md)] border border-border bg-bg p-[var(--space-300)] flex gap-[var(--space-300)] shadow-xs">
                <Avatar className="size-[36px] shrink-0">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${it.seed}`} />
                  <AvatarFallback>{it.name[0]}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-[length:var(--font-size-xs)] mb-[var(--space-150)]">
                    <span className="font-[var(--font-weight-medium)] text-text">{it.name}</span>
                    <span className="text-text-secondary"> · {it.action}</span>
                  </p>
                  <p className="text-[length:var(--font-size-sm)] text-text leading-relaxed">{it.detail}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** 会话流中的任务模块子卡片（标题：模块名 · 任务名） */
export function TaskHubSessionCard({
  hub,
  detail,
  extraSubtasks = [],
  onPushTaskChatCard,
}: {
  hub: TaskHubKind;
  detail: TaskDetailData;
  extraSubtasks?: SubtaskRow[];
  onPushTaskChatCard?: (kind: TaskChatCardKind, options?: TaskPushChatCardOptions) => void;
}) {
  const [feedbackFormOpen, setFeedbackFormOpen] = React.useState(false);
  const [commOpen, setCommOpen] = React.useState(false);

  const seedSubtasks = React.useMemo<SubtaskRow[]>(
    () =>
      detail.subtasks.map((s, i) => ({
        id: `s-${detail.id}-${i}`,
        name: s.title,
        assignee: detail.assignee,
        owner: detail.owner,
        status: s.done ? "已完成" : "未开始",
        progress: s.done ? 100 : 0,
        due: detail.due,
        risk: "无",
      })),
    [detail.assignee, detail.due, detail.id, detail.owner, detail.subtasks]
  );

  const subtasks = React.useMemo(
    () => [...seedSubtasks, ...extraSubtasks],
    [seedSubtasks, extraSubtasks]
  );

  const openExecutionCreate = React.useCallback(
    (phase?: string) => {
      if (onPushTaskChatCard) {
        onPushTaskChatCard("execution", phase !== undefined ? { phase } : undefined);
      }
    },
    [onPushTaskChatCard]
  );

  const openExecutionEdit = React.useCallback(() => {
    const initial: ExecutionContentValues = {
      title: "字段口径核对",
      assignee: detail.assignee,
      status: "执行中",
      phase: "设计阶段",
      difficulty: "",
    };
    if (onPushTaskChatCard) {
      onPushTaskChatCard("execution_edit", { initial });
    }
  }, [detail.assignee, onPushTaskChatCard]);

  React.useEffect(() => {
    setFeedbackFormOpen(false);
  }, [detail.id, hub]);

  React.useEffect(() => {
    if (hub === "communication") {
      setCommOpen(true);
    }
  }, [hub]);

  /** 沟通：仅打开抽屉，不展示中间说明卡片（历史会话若仍有沟通子卡，进入时直接拉起抽屉） */
  if (hub === "communication") {
    return (
      <TaskGroupChatDrawer open={commOpen} onOpenChange={setCommOpen} taskTitle={detail.name} />
    );
  }

  return (
    <>
      <div className="w-full flex flex-col gap-[var(--space-300)]">
        <GenericCard
          title={TASK_HUB_LABELS[hub]}
          subtitle={detail.name}
          className="overflow-hidden"
        >
        <div className="min-w-0">
          {hub === "execution_division" && (
            <ExecutionDivisionSection
              detail={detail}
              onExecutionCreate={openExecutionCreate}
              onExecutionEdit={openExecutionEdit}
              onViewExecutionDetail={
                onPushTaskChatCard
                  ? (row) => onPushTaskChatCard("execution_content_detail", { executionRow: row })
                  : undefined
              }
            />
          )}
          {hub === "subtasks" && (
            <SubtasksSection
              subtasks={subtasks}
              onCreateSubtask={() => onPushTaskChatCard?.("subtask")}
            />
          )}
          {hub === "output" && (
            <OutputTab onRequestNewOutput={() => onPushTaskChatCard?.("new_output")} />
          )}
          {hub === "feedback" && (
            <FeedbackTab
              actorName={detail.assignee}
              taskName={detail.name}
              formOpen={feedbackFormOpen}
              onFormOpenChange={setFeedbackFormOpen}
            />
          )}
          {hub === "risk" && <RiskTab />}
          {hub === "dynamics" && <DynamicsTab />}
          {hub === "kanban" && (
            <KanbanTab
              detail={detail}
              onExecutionCreate={openExecutionCreate}
              onExecutionEdit={openExecutionEdit}
            />
          )}
        </div>
        </GenericCard>
        {hub === "execution_division" && (
          <div className="flex flex-wrap gap-[var(--space-200)] w-full justify-start">
            <ChatPromptButton
              type="button"
              onClick={() =>
                onPushTaskChatCard?.("execution_division_list", { executionDivisionScope: "mine" })
              }
            >
              只看我的
            </ChatPromptButton>
            <ChatPromptButton
              type="button"
              onClick={() =>
                onPushTaskChatCard?.("execution_division_list", { executionDivisionScope: "subordinate" })
              }
            >
              只看下属
            </ChatPromptButton>
          </div>
        )}
        {hub === "kanban" && (
          <div className="flex flex-wrap gap-[var(--space-200)] w-full justify-start">
            <ChatPromptButton
              type="button"
              onClick={() => onPushTaskChatCard?.("kanban_scope_list", { kanbanScope: "mine" })}
            >
              只看我的
            </ChatPromptButton>
            <ChatPromptButton
              type="button"
              onClick={() => onPushTaskChatCard?.("kanban_scope_list", { kanbanScope: "subordinate" })}
            >
              只看下属
            </ChatPromptButton>
          </div>
        )}
      </div>
    </>
  );
}
