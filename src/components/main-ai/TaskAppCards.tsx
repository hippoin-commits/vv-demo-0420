import * as React from "react";
import { GenericCard } from "./GenericCard";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Progress } from "../ui/progress";
import { cn } from "../ui/utils";
import type { TaskRow } from "./taskAppData";
import { DEMO_CURRENT_USER, getTaskRowsForFilter } from "./taskAppData";
import { Calendar, Trash2 } from "lucide-react";
import { TaskListRowActions, TaskActionIcon } from "./task-detail/taskListRowActions";
import {
  TaskFormFields,
  emptyTaskFormSnapshot,
  type TaskFormFieldsHandle,
  type TaskFormSnapshot,
} from "./task-detail/TaskFormFields";
import { ChatTaskFormFooter } from "./task-detail/TaskChatCards";
import {
  listTaskDrafts,
  removeTaskDraft,
  upsertTaskDraft,
  type StoredTaskDraft,
} from "./taskDraftStorage";

export {
  TaskDetailCard,
  TaskHubSessionCard,
  FilteredExecutionDivisionListCard,
  KanbanScopeListCard,
  TASK_HUB_LABELS,
} from "./task-detail/TaskDetailCard";
export type {
  SubtaskRow,
  TaskChatCardKind,
  TaskHubKind,
  TaskPushChatCardOptions,
} from "./task-detail/TaskDetailCard";
export {
  ChatTaskFormFooter,
  EditTaskFormCard,
  CreateSubtaskFormCard,
  HandoverTaskCard,
  LinkSubtaskChatCard,
  TaskEvaluationRecordsCard,
  ExecutionContentFormCard,
  NewOutputFormCard,
  ExecutionDivisionDetailChatCard,
} from "./task-detail/TaskChatCards";
export type { NewOutputFormPayload } from "./task-detail/TaskChatCards";

export function TaskManagementTableCard({
  rows: rowsProp,
  filterHint,
  onRowClick,
  viewedTaskIds,
}: {
  rows?: TaskRow[];
  filterHint?: string;
  onRowClick?: (row: TaskRow) => void;
  /** 用户已从列表打开过详情的任务 id，名称列显示为浅色「已查看」 */
  viewedTaskIds?: ReadonlySet<string>;
}) {
  const rows = rowsProp ?? getTaskRowsForFilter(filterHint);

  return (
    <GenericCard title="任务管理">
      {filterHint ? (
        <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-300)]">{filterHint}</p>
      ) : null}
      <div className="w-full overflow-x-auto rounded-[var(--radius-md)] border border-border bg-bg-secondary">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                名称
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                执行人
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                负责人
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                状态
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)] min-w-[120px]">
                实际进度
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                截止时间
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                风险
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)] w-[1%] text-right whitespace-nowrap">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow
                key={r.id || i}
                role={onRowClick ? "button" : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={() => onRowClick?.(r)}
                onKeyDown={(e) => {
                  if (!onRowClick) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onRowClick(r);
                  }
                }}
                className={cn(
                  "border-border hover:bg-[var(--black-alpha-11)]",
                  onRowClick && "cursor-pointer"
                )}
              >
                <TableCell
                  className={cn(
                    "text-[length:var(--font-size-xs)] px-[var(--space-300)] py-[var(--space-250)] max-w-[200px]",
                    viewedTaskIds?.has(r.id) ? "text-text-tertiary" : "text-text"
                  )}
                >
                  {r.name}
                </TableCell>
                <TableCell className="text-[length:var(--font-size-xs)] text-text px-[var(--space-300)]">
                  {r.assignee}
                </TableCell>
                <TableCell className="text-[length:var(--font-size-xs)] text-text px-[var(--space-300)]">
                  {r.owner}
                </TableCell>
                <TableCell className="px-[var(--space-300)]">
                  <span
                    className={cn(
                      "inline-flex rounded-[var(--radius-100)] px-[var(--space-200)] py-[var(--space-50)] text-[length:var(--font-size-xs)]",
                      r.status === "进行中"
                        ? "bg-primary/15 text-primary"
                        : "bg-bg-tertiary text-text-secondary"
                    )}
                  >
                    {r.status}
                  </span>
                </TableCell>
                <TableCell className="px-[var(--space-300)]">
                  <div className="flex items-center gap-[var(--space-200)] min-w-[100px]">
                    <Progress value={r.progress} className="h-[6px] flex-1" />
                    <span className="text-[length:var(--font-size-xs)] text-text-secondary tabular-nums shrink-0">
                      {r.progress}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-[length:var(--font-size-xs)] text-text px-[var(--space-300)] whitespace-nowrap">
                  {r.due}
                </TableCell>
                <TableCell className="px-[var(--space-300)]">
                  <span
                    className={cn(
                      "text-[length:var(--font-size-xs)]",
                      r.risk === "有风险"
                        ? "text-warning"
                        : "text-text-secondary"
                    )}
                  >
                    {r.risk}
                  </span>
                </TableCell>
                <TableCell className="text-[length:var(--font-size-xs)] text-text px-[var(--space-300)] py-[var(--space-250)] text-right align-middle">
                  <TaskListRowActions />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </GenericCard>
  );
}

/** 筛选任务 · 单卡片入口（无二级菜单） */
export function TaskFilterCard() {
  const chips = ["进行中", "未开始", "已完成", "有风险", `执行人：${DEMO_CURRENT_USER}`];
  return (
    <GenericCard title="筛选任务">
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-400)]">
        组合以下条件以缩小列表范围（演示交互，不请求后端）。
      </p>
      <div className="flex flex-wrap gap-[var(--space-200)] mb-[var(--space-500)]">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            className="px-[var(--space-300)] py-[var(--space-150)] rounded-full border border-border bg-bg-secondary text-[length:var(--font-size-xs)] text-text hover:bg-[var(--black-alpha-11)] transition-colors"
          >
            {c}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--space-400)] w-full">
        <div className="flex flex-col gap-[var(--space-150)]">
          <span className="text-[length:var(--font-size-xs)] text-text-secondary">时间范围</span>
          <div className="flex gap-[var(--space-200)] items-center">
            <Input readOnly placeholder="开始日期" className="h-[var(--space-900)] rounded-[var(--radius-input)] border border-border bg-bg text-[length:var(--font-size-sm)]" />
            <span className="text-text-tertiary">—</span>
            <Input readOnly placeholder="结束日期" className="h-[var(--space-900)] rounded-[var(--radius-input)] border border-border bg-bg text-[length:var(--font-size-sm)]" />
          </div>
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <span className="text-[length:var(--font-size-xs)] text-text-secondary">关键词</span>
          <Input readOnly placeholder="标题 / 编号" className="h-[var(--space-900)] rounded-[var(--radius-input)] border border-border bg-bg text-[length:var(--font-size-sm)]" />
        </div>
      </div>
      <div className="mt-[var(--space-500)] flex w-full min-w-0 flex-wrap items-stretch gap-[var(--space-300)] border-t border-border-divider pt-[var(--space-400)] sm:flex-nowrap">
        <Button type="button" variant="chat-reset" className="shrink-0">
          重置
        </Button>
        <Button type="button" variant="chat-submit" className="min-w-0 flex-1">
          查看任务
        </Button>
      </div>
    </GenericCard>
  );
}

/** 设置 · 单卡片入口 */
export function TaskSettingsCard() {
  return (
    <GenericCard title="任务设置">
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-400)]">
        管理任务通知与列表默认行为（演示）。
      </p>
      <div className="flex flex-col gap-[var(--space-400)] w-full">
        {[
          { title: "截止前提醒", desc: "在截止日前 1 天通过站内信提醒负责人与执行人", on: true },
          { title: "逾期任务高亮", desc: "在列表与摘要中优先展示逾期项", on: true },
          { title: "下属任务汇总", desc: "在「下属的」入口默认按逾期排序", on: false },
        ].map((row) => (
          <div
            key={row.title}
            className="flex items-start justify-between gap-[var(--space-400)] p-[var(--space-400)] rounded-[var(--radius-md)] border border-border bg-bg-secondary"
          >
            <div>
              <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">{row.title}</p>
              <p className="text-[length:var(--font-size-xs)] text-text-secondary mt-[var(--space-100)]">{row.desc}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={row.on}
              className={cn(
                "shrink-0 w-[44px] h-[26px] rounded-full relative transition-colors",
                row.on ? "bg-primary" : "bg-[var(--black-alpha-11)] border border-border"
              )}
            >
              <span
                className={cn(
                  "absolute top-[3px] size-[20px] rounded-full bg-[var(--color-white)] shadow-sm transition-transform",
                  row.on ? "left-[22px]" : "left-[3px]"
                )}
              />
            </button>
          </div>
        ))}
      </div>
      <div className="mt-[var(--space-500)] flex w-full border-t border-border-divider pt-[var(--space-400)]">
        <Button type="button" variant="chat-submit" className="w-full min-w-0">
          保存设置
        </Button>
      </div>
    </GenericCard>
  );
}

const draftRowBtnClass =
  "p-0 border-0 bg-transparent cursor-pointer rounded-[var(--radius-sm)] text-text-tertiary hover:bg-[var(--black-alpha-11)] inline-flex items-center justify-center min-h-[22px] min-w-[22px] outline-none focus-visible:ring-2 focus-visible:ring-ring";

function formatDraftSavedAt(ts: number) {
  try {
    return new Date(ts).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
}

/** 草稿箱：仅「编辑」「删除」，数据存 localStorage */
export function TaskDraftsTableCard({
  onEditDraft,
}: {
  onEditDraft: (draftId: string) => void;
}) {
  const [rows, setRows] = React.useState<StoredTaskDraft[]>(() => listTaskDrafts());
  React.useEffect(() => {
    const sync = () => setRows(listTaskDrafts());
    window.addEventListener("cui-task-drafts-changed", sync);
    return () => window.removeEventListener("cui-task-drafts-changed", sync);
  }, []);

  return (
    <GenericCard title="草稿箱">
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-300)]">
        以下为已保存的草稿，可继续编辑；数据仅保存在本机浏览器（演示）。
      </p>
      <div className="w-full overflow-x-auto rounded-[var(--radius-md)] border border-border bg-bg-secondary">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                草稿标题
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)]">
                保存时间
              </TableHead>
              <TableHead className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)] h-9 px-[var(--space-300)] w-[1%] text-right whitespace-nowrap">
                操作
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="border-border">
                <TableCell
                  colSpan={3}
                  className="text-[length:var(--font-size-xs)] text-text-secondary px-[var(--space-300)] py-[var(--space-400)] text-center"
                >
                  暂无草稿。在「新建任务」中填写后点击「保存草稿」即可出现在此列表。
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id} className="border-border hover:bg-[var(--black-alpha-11)]">
                  <TableCell className="text-[length:var(--font-size-xs)] text-text px-[var(--space-300)] py-[var(--space-250)] max-w-[220px] truncate">
                    {r.title}
                  </TableCell>
                  <TableCell className="text-[length:var(--font-size-xs)] text-text-secondary px-[var(--space-300)] whitespace-nowrap">
                    {formatDraftSavedAt(r.savedAt)}
                  </TableCell>
                  <TableCell className="px-[var(--space-300)] text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-[var(--space-100)]">
                      <button
                        type="button"
                        title="编辑"
                        aria-label="编辑"
                        className={draftRowBtnClass}
                        onClick={() => onEditDraft(r.id)}
                      >
                        <TaskActionIcon actionId="edit" size="sm" />
                      </button>
                      <button
                        type="button"
                        title="删除"
                        aria-label="删除"
                        className={draftRowBtnClass}
                        onClick={() => {
                          removeTaskDraft(r.id);
                          setRows(listTaskDrafts());
                        }}
                      >
                        <Trash2 className="size-[14px]" strokeWidth={1.5} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </GenericCard>
  );
}

export function CreateTaskFullFormCard({
  onSaveDraft,
  onConfirm,
  editingDraftId: editingDraftIdProp,
  initialSnapshot: initialSnapshotProp,
  cardTitle,
}: {
  onSaveDraft?: (info: { draftId: string; title: string }) => void;
  onConfirm?: () => void;
  editingDraftId?: string;
  initialSnapshot?: TaskFormSnapshot;
  cardTitle?: string;
}) {
  const formRef = React.useRef<TaskFormFieldsHandle>(null);
  const emptyInitial = React.useMemo(() => emptyTaskFormSnapshot(), []);
  const [formResetKey, setFormResetKey] = React.useState(0);
  const [manualEmpty, setManualEmpty] = React.useState(false);
  const [localDraftId, setLocalDraftId] = React.useState<string | undefined>(editingDraftIdProp);

  React.useEffect(() => {
    setManualEmpty(false);
    setLocalDraftId(editingDraftIdProp);
  }, [editingDraftIdProp]);

  const initial = manualEmpty ? emptyInitial : (initialSnapshotProp ?? emptyInitial);
  const title = cardTitle ?? (editingDraftIdProp ? "编辑草稿" : "新建任务");

  return (
    <GenericCard title={title}>
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-400)]">
        请填写以下信息（演示数据，不提交真实后端）
      </p>

      <TaskFormFields
        key={`${editingDraftIdProp ?? "new"}-${formResetKey}`}
        ref={formRef}
        resetKey={formResetKey}
        initial={initial}
        hint={undefined}
      />

      <ChatTaskFormFooter
        onReset={() => {
          setManualEmpty(true);
          setLocalDraftId(undefined);
          setFormResetKey((k) => k + 1);
        }}
        showSaveDraft
        onSaveDraft={() => {
          const snap = formRef.current?.getSnapshot();
          if (!snap) return;
          const rec = upsertTaskDraft(localDraftId, snap);
          setLocalDraftId(rec.id);
          onSaveDraft?.({ draftId: rec.id, title: rec.title });
        }}
        onConfirm={() => {
          formRef.current?.getSnapshot();
          onConfirm?.();
        }}
      />
    </GenericCard>
  );
}
