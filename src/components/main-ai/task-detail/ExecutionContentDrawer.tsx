import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../ui/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";

export const EXECUTION_PHASES = ["产品阶段", "设计阶段", "研发阶段", "测试阶段", "走查阶段"] as const;

const STATUS_OPTIONS = ["未开始", "执行中", "已完成", "已暂停"] as const;

const DIFFICULTY_OPTIONS = [
  { value: "", label: "--" },
  { value: "低", label: "低" },
  { value: "中", label: "中" },
  { value: "高", label: "高" },
] as const;

export type ExecutionContentValues = {
  title: string;
  assignee: string;
  status: string;
  phase: string;
  difficulty: string;
};

export function defaultExecutionContent(defaultAssignee: string, phase?: string): ExecutionContentValues {
  return {
    title: "",
    assignee: defaultAssignee,
    status: "执行中",
    phase: phase && EXECUTION_PHASES.includes(phase as (typeof EXECUTION_PHASES)[number]) ? phase : "设计阶段",
    difficulty: "",
  };
}

type ExecutionContentDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  /** 打开抽屉时用于重置表单；新建不传则用 defaultAssignee + defaultPhase */
  initialValues: ExecutionContentValues | null;
  defaultAssignee: string;
  defaultPhase?: string;
  onSubmit?: (values: ExecutionContentValues) => void;
};

/** 新建 / 编辑执行内容；交互与任务描述抽屉一致（蒙层 + 右侧滑出） */
export function ExecutionContentDrawer({
  open,
  onOpenChange,
  mode,
  initialValues,
  defaultAssignee,
  defaultPhase,
  onSubmit,
}: ExecutionContentDrawerProps) {
  const [form, setForm] = React.useState<ExecutionContentValues>(() =>
    initialValues ?? defaultExecutionContent(defaultAssignee, defaultPhase)
  );

  React.useEffect(() => {
    if (!open) return;
    setForm(initialValues ?? defaultExecutionContent(defaultAssignee, defaultPhase));
  }, [open, mode, initialValues, defaultAssignee, defaultPhase]);

  if (typeof document === "undefined") return null;

  const title = mode === "create" ? "新建执行内容" : "编辑执行内容";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    onSubmit?.(form);
    onOpenChange(false);
  };

  return createPortal(
    <>
      {open && (
        <div
          role="presentation"
          className="fixed inset-0 z-[140] bg-[var(--color-overlay)]"
          onClick={() => onOpenChange(false)}
        />
      )}
      <div
        className={cn(
          "fixed top-0 right-0 z-[141] h-full w-[50vw] min-w-[min(50vw,100%)] max-w-[100vw] flex flex-col",
          "bg-bg border-l border-border shadow-[var(--shadow-md)]",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal={open}
        aria-label={title}
      >
        <header className="flex items-center justify-between gap-[var(--space-300)] px-[var(--space-400)] py-[var(--space-400)] border-b border-border shrink-0">
          <h2 className="text-[length:var(--font-size-md)] font-[var(--font-weight-semi-bold)] text-text leading-tight truncate">
            {title}
          </h2>
          <button
            type="button"
            title="关闭"
            className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="关闭"
            onClick={() => onOpenChange(false)}
          >
            <X className="size-[20px]" />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-[var(--space-400)] py-[var(--space-400)] flex flex-col gap-[var(--space-500)]"
        >
          <div className="flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
              执行内容 <span className="text-error">*</span>
            </Label>
            <Input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="请输入执行内容标题"
              className="h-[var(--space-900)] rounded-[var(--radius-input)] text-[length:var(--font-size-sm)]"
              maxLength={200}
            />
          </div>

          <div className="flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">执行人</Label>
            <Input
              value={form.assignee}
              onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
              placeholder="执行人姓名"
              className="h-[var(--space-900)] rounded-[var(--radius-input)] text-[length:var(--font-size-sm)]"
            />
          </div>

          <div className="flex flex-col gap-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">状态</Label>
            <Select value={form.status} onValueChange={(v) => setForm((f) => ({ ...f, status: v }))}>
              <SelectTrigger className="h-[var(--space-900)] rounded-[var(--radius-input)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
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
              <SelectTrigger className="h-[var(--space-900)] rounded-[var(--radius-input)]">
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
              <SelectTrigger className="h-[var(--space-900)] rounded-[var(--radius-input)]">
                <SelectValue placeholder="--" />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTY_OPTIONS.map((d) => (
                  <SelectItem key={d.value || "empty"} value={d.value || "__empty__"}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-auto flex w-full min-w-0 flex-wrap items-stretch gap-[var(--space-300)] border-t border-border-divider pt-[var(--space-200)] sm:flex-nowrap">
            <Button type="button" variant="chat-reset" className="shrink-0" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button type="submit" variant="chat-submit" className="min-w-0 flex-1" disabled={!form.title.trim()}>
              确定
            </Button>
          </div>
        </form>
      </div>
    </>,
    document.body
  );
}
