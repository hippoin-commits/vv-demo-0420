import * as React from "react";
import { GenericCard } from "../GenericCard";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { CircleHelp, Paperclip, Plus, Pencil } from "lucide-react";
import { cn } from "../../ui/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  TaskFormFields,
  type TaskFormFieldsHandle,
  type TaskFormSnapshot,
  snapshotFromDetail,
  snapshotForNewSubtask,
} from "./TaskFormFields";
import type { ExecutionDivisionRow, TaskDetailData } from "../taskAppData";
import { DEMO_CURRENT_USER, getTasksForLinkPicker } from "../taskAppData";
import { ExecutionStatusReadonly } from "./taskDetailDialogs";
import {
  EXECUTION_PHASES,
  defaultExecutionContent,
  type ExecutionContentValues,
} from "./ExecutionContentDrawer";

const hint = "请填写以下信息（演示数据，不提交真实后端）";

const NEW_OUTPUT_TOOL_OPTIONS = ["Figma", "Sketch", "Office 文档", "原型工具", "Notion", "其他"] as const;
const NEW_OUTPUT_TYPE_OPTIONS = ["文档", "附件", "设计稿", "链接", "数据", "其他"] as const;
const NEW_OUTPUT_VISIBILITY_OPTIONS = [
  { value: "task_public", label: "公开 (该任务的人员可见)" },
  { value: "assignee_only", label: "仅经办人可见" },
  { value: "self_only", label: "仅自己可见" },
] as const;

export type NewOutputFormPayload = {
  title: string;
  tool: string;
  linkOrAttach: string;
  producer: string;
  outputType: string;
  visibility: string;
  linkProject: boolean;
  linkGoal: boolean;
  notifyMembers: boolean;
};

/** 新建产出 · GenericCard + ChatTaskFormFooter（重置 + 确定，无取消） */
export function NewOutputFormCard({
  defaultProducer,
  onConfirm,
}: {
  defaultProducer: string;
  onConfirm?: (payload: NewOutputFormPayload) => void;
}) {
  const uid = React.useId();
  const [title, setTitle] = React.useState("");
  const [tool, setTool] = React.useState<string>(NEW_OUTPUT_TOOL_OPTIONS[0]);
  const [linkOrAttach, setLinkOrAttach] = React.useState("");
  const [producer, setProducer] = React.useState(defaultProducer);
  const [outputType, setOutputType] = React.useState<string>(NEW_OUTPUT_TYPE_OPTIONS[0]);
  const [visibility, setVisibility] = React.useState<string>(NEW_OUTPUT_VISIBILITY_OPTIONS[0].value);
  const [linkProject, setLinkProject] = React.useState(false);
  const [linkGoal, setLinkGoal] = React.useState(false);
  const [notifyMembers, setNotifyMembers] = React.useState(true);

  React.useEffect(() => {
    setProducer(defaultProducer);
  }, [defaultProducer]);

  const fieldClass =
    "h-[var(--space-900)] rounded-[var(--radius-input)] text-[length:var(--font-size-sm)] border border-border bg-bg";

  const resetForm = React.useCallback(() => {
    setTitle("");
    setTool(NEW_OUTPUT_TOOL_OPTIONS[0]);
    setLinkOrAttach("");
    setProducer(defaultProducer);
    setOutputType(NEW_OUTPUT_TYPE_OPTIONS[0]);
    setVisibility(NEW_OUTPUT_VISIBILITY_OPTIONS[0].value);
    setLinkProject(false);
    setLinkGoal(false);
    setNotifyMembers(true);
  }, [defaultProducer]);

  const trySubmit = () => {
    const t = title.trim();
    const link = linkOrAttach.trim();
    if (!t || !link) return;
    onConfirm?.({
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
  };

  return (
    <GenericCard title="新建产出">
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-400)]">{hint}</p>
      <div className="flex flex-col gap-[var(--space-400)] w-full">
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
            产出物标题 <span className="text-error">*</span>
          </Label>
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

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">产出工具</Label>
          <Select value={tool} onValueChange={setTool}>
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="产出工具" />
            </SelectTrigger>
            <SelectContent>
              {NEW_OUTPUT_TOOL_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
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

        <div className="flex flex-col gap-[var(--space-150)]">
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

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">产出类型</Label>
          <Select value={outputType} onValueChange={setOutputType}>
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="产出类型" />
            </SelectTrigger>
            <SelectContent>
              {NEW_OUTPUT_TYPE_OPTIONS.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">公开范围</Label>
          <Select value={visibility} onValueChange={setVisibility}>
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NEW_OUTPUT_VISIBILITY_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">关联</Label>
          <div className="flex flex-wrap gap-[var(--space-400)] items-center">
            <div className="flex items-center gap-[var(--space-200)]">
              <Checkbox
                id={`${uid}-link-project`}
                checked={linkProject}
                onCheckedChange={(v) => setLinkProject(v === true)}
                className="size-[14px]"
              />
              <Label
                htmlFor={`${uid}-link-project`}
                className="text-[length:var(--font-size-xs)] text-text font-normal cursor-pointer"
              >
                关联的项目
              </Label>
            </div>
            <div className="flex items-center gap-[var(--space-200)]">
              <Checkbox
                id={`${uid}-link-goal`}
                checked={linkGoal}
                onCheckedChange={(v) => setLinkGoal(v === true)}
                className="size-[14px]"
              />
              <Label
                htmlFor={`${uid}-link-goal`}
                className="text-[length:var(--font-size-xs)] text-text font-normal cursor-pointer"
              >
                关联的目标
              </Label>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-[var(--space-200)]">
          <Checkbox
            id={`${uid}-notify`}
            checked={notifyMembers}
            onCheckedChange={(v) => setNotifyMembers(v === true)}
            className="size-[14px]"
          />
          <Label htmlFor={`${uid}-notify`} className="text-[length:var(--font-size-xs)] text-text font-normal cursor-pointer">
            通知任务成员
          </Label>
        </div>
      </div>

      <ChatTaskFormFooter onReset={resetForm} onConfirm={trySubmit} />
    </GenericCard>
  );
}

const EXECUTION_STATUS_OPTIONS = ["未开始", "执行中", "已完成", "已暂停"] as const;
const EXECUTION_DIFFICULTY_OPTIONS = [
  { value: "", label: "--" },
  { value: "低", label: "低" },
  { value: "中", label: "中" },
  { value: "高", label: "高" },
] as const;

/** 对话表单卡片底栏：左「重置 / 保存草稿」`chat-reset`，右主操作 `chat-submit` 且 `flex-1`（与 Guidelines · 卡片表单底栏一致） */
export function ChatTaskFormFooter({
  onReset,
  showSaveDraft,
  onSaveDraft,
  onConfirm,
  confirmLabel = "确定",
  disabled = false,
}: {
  onReset: () => void;
  showSaveDraft?: boolean;
  onSaveDraft?: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  /** 表单固化后：底栏按钮禁用并置灰 */
  disabled?: boolean;
}) {
  return (
    <div className="mt-[var(--space-500)] flex w-full min-w-0 flex-wrap items-stretch gap-[var(--space-300)] border-t border-border-divider pt-[var(--space-400)] sm:flex-nowrap">
      <div className="flex flex-wrap items-center gap-[var(--space-300)] shrink-0">
        <Button
          type="button"
          variant="chat-reset"
          className="h-10 w-fit shrink-0 px-4"
          onClick={onReset}
          disabled={disabled}
        >
          重置
        </Button>
        {showSaveDraft ? (
          <Button
            type="button"
            variant="chat-reset"
            className="h-10 w-fit shrink-0 px-4"
            onClick={onSaveDraft}
            disabled={disabled}
          >
            保存草稿
          </Button>
        ) : null}
      </div>
      <Button
        type="button"
        variant="chat-submit"
        className="h-10 min-w-0 flex-1 px-4 sm:min-w-[88px]"
        onClick={onConfirm}
        disabled={disabled}
      >
        {confirmLabel}
      </Button>
    </div>
  );
}

/** 编辑任务 · 与新建任务同款 GenericCard + 表单 */
export function EditTaskFormCard({
  detail,
  onConfirm,
  solidified = false,
  solidifiedSnapshot,
  /** 原位置编辑（0417 inline）：与详情卡一致使用「任务详情」标题 */
  cardTitle = "编辑任务",
}: {
  detail: TaskDetailData;
  /** 确定时回传当前表单快照（0417 固化与详情合并用） */
  onConfirm?: (snapshot?: TaskFormSnapshot) => void;
  solidified?: boolean;
  solidifiedSnapshot?: TaskFormSnapshot;
  cardTitle?: string;
}) {
  const formRef = React.useRef<TaskFormFieldsHandle>(null);
  const [tick, setTick] = React.useState(0);
  const initial = React.useMemo(() => {
    if (solidified) return solidifiedSnapshot ?? snapshotFromDetail(detail);
    return snapshotFromDetail(detail);
  }, [solidified, solidifiedSnapshot, detail]);

  return (
    <GenericCard title={cardTitle} className={solidified ? "opacity-[0.92]" : undefined}>
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-400)]">{hint}</p>
      <TaskFormFields
        ref={formRef}
        resetKey={solidified ? "solidified" : tick}
        initial={initial}
        readOnly={solidified}
      />
      <ChatTaskFormFooter
        disabled={solidified}
        onReset={() => setTick((n) => n + 1)}
        onConfirm={() => {
          onConfirm?.(formRef.current?.getSnapshot());
        }}
      />
    </GenericCard>
  );
}

/** 创建子任务 */
export function CreateSubtaskFormCard({
  parent,
  onConfirm,
}: {
  parent: TaskDetailData;
  onConfirm?: (snapshot: TaskFormSnapshot) => void;
}) {
  const formRef = React.useRef<TaskFormFieldsHandle>(null);
  const [tick, setTick] = React.useState(0);
  const initial = React.useMemo(() => snapshotForNewSubtask(parent), [parent]);

  return (
    <GenericCard title="创建子任务">
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-400)]">{hint}</p>
      <TaskFormFields
        ref={formRef}
        resetKey={tick}
        initial={initial}
        parentTaskName={parent.name}
      />
      <ChatTaskFormFooter
        onReset={() => setTick((n) => n + 1)}
        onConfirm={() => {
          const snap = formRef.current?.getSnapshot();
          if (snap) onConfirm?.(snap);
        }}
      />
    </GenericCard>
  );
}

/** 交接 */
export function HandoverTaskCard({
  onConfirm,
}: {
  onConfirm?: () => void;
}) {
  const [fromRole, setFromRole] = React.useState("");
  const [toRole, setToRole] = React.useState("");
  const [recipient, setRecipient] = React.useState("");
  const [reason, setReason] = React.useState("");

  const resetHandover = React.useCallback(() => {
    setFromRole("");
    setToRole("");
    setRecipient("");
    setReason("");
  }, []);

  return (
    <GenericCard title="交接">
      <div className="flex flex-col gap-4 w-full">
        <div>
          <Label className="text-[length:var(--font-size-sm)] text-text mb-1.5 flex items-center gap-1">
            交接人
            <CircleHelp className="size-3.5 text-text-tertiary" />
            <span className="text-error">*</span>
          </Label>
          <Select value={fromRole} onValueChange={setFromRole}>
            <SelectTrigger className="h-10 rounded-xl border-border bg-bg">
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="殷朝">{DEMO_CURRENT_USER}</SelectItem>
              <SelectItem value="段鹏">段鹏</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[length:var(--font-size-sm)] text-text mb-1.5">
            交接角色 <span className="text-error">*</span>
          </Label>
          <Select value={toRole} onValueChange={setToRole}>
            <SelectTrigger className="h-10 rounded-xl border-border bg-bg">
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="执行人">执行人</SelectItem>
              <SelectItem value="负责人">负责人</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-[length:var(--font-size-sm)] text-text mb-1.5 flex items-center gap-1">
            接收人
            <CircleHelp className="size-3.5 text-text-tertiary" />
            <span className="text-error">*</span>
          </Label>
          <div className="flex gap-2">
            <Input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="搜索或选择接收人 (必填)"
              className="h-10 rounded-xl flex-1 border-border bg-bg"
            />
            <Button type="button" variant="secondary" size="sm" className="shrink-0 rounded-xl">
              + 选择
            </Button>
          </div>
        </div>
        <div>
          <Label className="text-[length:var(--font-size-sm)] text-text mb-1.5">交接原因</Label>
          <div className="relative rounded-xl border border-border bg-bg">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 100))}
              placeholder="交接原因"
              className="min-h-[100px] border-0 rounded-xl resize-none pb-7"
              maxLength={100}
            />
            <span className="absolute bottom-2 right-3 text-[length:var(--font-size-xxs)] text-text-tertiary tabular-nums">
              {reason.length} / 100
            </span>
          </div>
        </div>
      </div>
      <ChatTaskFormFooter onReset={resetHandover} onConfirm={() => onConfirm?.()} />
    </GenericCard>
  );
}

/** 新建 / 编辑执行内容 · GenericCard + ChatTaskFormFooter（会话流） */
export function ExecutionContentFormCard({
  mode = "create",
  defaultAssignee,
  defaultPhase,
  initialValues,
  onConfirm,
}: {
  mode?: "create" | "edit";
  defaultAssignee: string;
  defaultPhase?: string;
  /** 编辑模式下的表单初值（与抽屉编辑一致） */
  initialValues?: ExecutionContentValues | null;
  onConfirm?: (values: ExecutionContentValues) => void;
}) {
  const [tick, setTick] = React.useState(0);
  const [form, setForm] = React.useState<ExecutionContentValues>(() =>
    mode === "edit" && initialValues
      ? { ...initialValues }
      : defaultExecutionContent(defaultAssignee, defaultPhase)
  );
  React.useEffect(() => {
    if (mode === "edit" && initialValues) {
      setForm({ ...initialValues });
    } else {
      setForm(defaultExecutionContent(defaultAssignee, defaultPhase));
    }
  }, [mode, initialValues, defaultAssignee, defaultPhase, tick]);

  const fieldClass =
    "h-[var(--space-900)] rounded-[var(--radius-input)] text-[length:var(--font-size-sm)] border border-border bg-bg";

  const title = mode === "edit" ? "编辑执行内容" : "新建执行内容";

  return (
    <GenericCard title={title}>
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-400)]">{hint}</p>
      <div className="flex flex-col gap-[var(--space-400)] w-full">
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
            执行内容 <span className="text-error">*</span>
          </Label>
          <Input
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="请输入执行内容标题"
            className={fieldClass}
            maxLength={200}
          />
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">执行人</Label>
          <Input
            value={form.assignee}
            onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
            placeholder="执行人姓名"
            className={fieldClass}
          />
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">状态</Label>
          <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXECUTION_STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">阶段</Label>
          <Select value={form.phase} onValueChange={(v) => setForm((f) => ({ ...f, phase: v }))}>
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXECUTION_PHASES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">难度</Label>
          <Select
            value={form.difficulty || "__empty__"}
            onValueChange={(v) => setForm((f) => ({ ...f, difficulty: v === "__empty__" ? "" : v }))}
          >
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="--" />
            </SelectTrigger>
            <SelectContent>
              {EXECUTION_DIFFICULTY_OPTIONS.map((d) => (
                <SelectItem key={d.value || "empty"} value={d.value || "__empty__"}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ChatTaskFormFooter
        onReset={() => setTick((n) => n + 1)}
        onConfirm={() => {
          if (!form.title.trim()) return;
          onConfirm?.(form);
        }}
      />
    </GenericCard>
  );
}

/** 关联子任务 */
export function LinkSubtaskChatCard({
  taskId,
  onConfirm,
}: {
  taskId: string;
  onConfirm?: (ids: string[]) => void;
}) {
  const rows = React.useMemo(() => getTasksForLinkPicker(taskId), [taskId]);
  const [picked, setPicked] = React.useState<Record<string, boolean>>({});

  return (
    <GenericCard title="关联子任务">
      <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-3">从任务库中选择要关联为子任务的条目（演示）</p>
      <div className="rounded-xl border border-border divide-y divide-border bg-bg-secondary/40 w-full">
        {rows.map((r) => (
          <label
            key={r.id}
            className="flex items-center gap-3 px-3 py-2.5 hover:bg-[var(--black-alpha-11)] cursor-pointer"
          >
            <Checkbox
              checked={!!picked[r.id]}
              onCheckedChange={(v) => setPicked((p) => ({ ...p, [r.id]: v === true }))}
            />
            <div className="flex-1 min-w-0">
              <p className="text-[length:var(--font-size-sm)] text-text truncate">{r.name}</p>
              <p className="text-[length:var(--font-size-xxs)] text-text-tertiary">
                {r.assignee} · {r.status}
              </p>
            </div>
          </label>
        ))}
      </div>
      <ChatTaskFormFooter
        onReset={() => setPicked({})}
        onConfirm={() => {
          const ids = Object.entries(picked)
            .filter(([, v]) => v)
            .map(([k]) => k);
          onConfirm?.(ids);
        }}
      />
    </GenericCard>
  );
}

/** 执行内容分工行详情 · 会话流只读卡片（替代弹窗，与任务详情卡片同为 GenericCard） */
export function ExecutionDivisionDetailChatCard({
  row,
}: {
  row: ExecutionDivisionRow;
}) {
  return (
    <GenericCard
      title="执行内容详情"
      subtitle="与列表字段一致，仅供查看（演示）"
    >
      <div className="flex w-full flex-col gap-[var(--space-500)]">
        <div className="flex min-w-0 flex-col gap-[var(--space-100)]">
          <span className="text-[length:var(--font-size-xxs)] text-text-tertiary uppercase tracking-wide">
            执行内容
          </span>
          <p className="m-0 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-snug text-text">
            {row.content}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-x-[var(--space-400)] gap-y-[var(--space-500)] sm:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-[var(--space-100)]">
            <span className="text-[length:var(--font-size-xxs)] uppercase tracking-wide text-text-tertiary">
              执行人
            </span>
            <span className="truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
              {row.assignee}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-[var(--space-100)]">
            <span className="text-[length:var(--font-size-xxs)] uppercase tracking-wide text-text-tertiary">
              状态
            </span>
            <div>
              <ExecutionStatusReadonly label={row.statusLabel} />
            </div>
          </div>
          <div className="flex min-w-0 flex-col gap-[var(--space-100)]">
            <span className="text-[length:var(--font-size-xxs)] uppercase tracking-wide text-text-tertiary">
              阶段
            </span>
            <span className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
              {row.phase}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-[var(--space-100)]">
            <span className="text-[length:var(--font-size-xxs)] uppercase tracking-wide text-text-tertiary">
              难度
            </span>
            <span
              className={cn(
                "text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]",
                row.difficulty === "--" && "text-text-tertiary"
              )}
            >
              {row.difficulty}
            </span>
          </div>
          <div className="flex min-w-0 flex-col gap-[var(--space-100)] sm:col-span-2">
            <span className="text-[length:var(--font-size-xxs)] uppercase tracking-wide text-text-tertiary">
              更新时间
            </span>
            <span className="tabular-nums text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
              {row.updatedAt}
            </span>
          </div>
        </div>
      </div>
    </GenericCard>
  );
}

/** 任务评价记录（会话内卡片：高度随内容撑开，不单独出现卡片内滚动条） */
export function TaskEvaluationRecordsCard() {
  return (
    <GenericCard title="任务评价记录">
      <div className="flex flex-wrap items-center justify-between gap-3 w-full mb-4">
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 text-[length:var(--font-size-sm)]">
            <span className="inline-flex items-center gap-1.5 text-primary font-[var(--font-weight-medium)] border-l-4 border-primary pl-2">
              评价明细 <span className="tabular-nums">3</span>
            </span>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-text-secondary border border-border rounded-lg px-2 py-1 text-[length:var(--font-size-xs)] bg-bg"
            >
              评价模板 <span className="text-[10px]">▼</span>
            </button>
          </div>
        </div>
        <Button type="button" size="sm" className="shrink-0 rounded-lg gap-1">
          <Plus className="size-4" />
          新增评价
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-bg-secondary/50 p-4 w-full">
        <div className="rounded-xl border border-border bg-[#E8F1FC]/60 p-5 mb-5">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[length:var(--font-size-sm)] text-text mb-2">
                综合评分
                <CircleHelp className="size-3.5 text-text-tertiary" />
              </div>
              <p className="text-3xl font-[var(--font-weight-bold)] text-primary tabular-nums mb-3">10分</p>
              <div className="h-2.5 rounded-full bg-primary/20 overflow-hidden">
                <div className="h-full w-full bg-primary rounded-full" />
              </div>
            </div>
            <div className="w-full lg:w-[220px] shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-[200px] h-[200px] text-primary/80">
                <polygon
                  points="60,8 108,44 88,100 32,100 12,44"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.35"
                />
                <polygon points="60,8 60,8 60,60 60,60 60,60" fill="currentColor" fillOpacity="0.25" />
                <text x="60" y="22" textAnchor="middle" fill="currentColor" fontSize="9">
                  产品设计自我评 10分
                </text>
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-bg p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-9">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${DEMO_CURRENT_USER}`} />
                <AvatarFallback>殷</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text m-0">
                  {DEMO_CURRENT_USER}
                </p>
                <span className="inline-flex mt-1 rounded-full bg-[#FFF4E0] text-[#B8860B] px-2 py-0.5 text-[length:var(--font-size-xs)]">
                  任务评分：<strong>10/10</strong>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[length:var(--font-size-xs)] text-text-tertiary">
              <span className="tabular-nums">2025-11-19 10:02</span>
              <button type="button" className="p-1 rounded hover:bg-[var(--black-alpha-11)] text-text-secondary">
                <Pencil className="size-3.5" />
              </button>
            </div>
          </div>
          <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-4">评价模板：产品设计自我评价</p>
          <ol className="list-decimal pl-5 space-y-4 text-[length:var(--font-size-sm)] text-text">
            <li>
              <span className="font-[var(--font-weight-medium)]">产品得分</span>
              <span className="ml-2 rounded bg-bg-secondary px-2 py-0.5 text-[length:var(--font-size-xs)]">
                评分：<strong>10</strong>
              </span>
              <p className="mt-1 text-text-secondary leading-relaxed">
                阿萨德服务费深V出去玩额发生的法师打发
              </p>
            </li>
            <li>
              <span className="font-[var(--font-weight-medium)]">设计评分</span>
              <span className="ml-2 rounded bg-bg-secondary px-2 py-0.5 text-[length:var(--font-size-xs)]">
                评分：<strong>10</strong>
              </span>
              <p className="mt-1 text-text-secondary leading-relaxed">
                啊所发生的发生的法师打发三大发啥打法是打发
              </p>
            </li>
            <li>
              <span className="font-[var(--font-weight-medium)]">情绪价值描述</span>
              <p className="mt-1 tabular-nums text-text">2112213</p>
            </li>
          </ol>
        </div>
      </div>
    </GenericCard>
  );
}
