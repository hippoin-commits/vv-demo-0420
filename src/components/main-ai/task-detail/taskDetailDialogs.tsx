import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { cn } from "../../ui/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../ui/hover-card";
import { Search, Network, Users, Contact, Zap, Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  TaskActionIcon,
  taskDetailToolbarIconBtnClass,
  taskDetailToolbarIconBtnClassFigma0417,
} from "./taskListRowActions";
import type { ExecutionDivisionRow } from "../taskAppData";

const pillBtn =
  "rounded-full px-5 py-2 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] transition-colors";
const pillSecondary =
  "border border-border bg-bg text-text hover:bg-[var(--black-alpha-11)]";
const pillPrimary = "bg-primary text-primary-foreground hover:bg-primary/90";

export function MeetingHoverTrigger({
  className,
  onQuickMeeting,
  onScheduleMeeting,
  /** 与任务详情卡底栏一致：默认 20×20 热区；`figma0417` 为 Weekly 规范 32×32 + 18px 图标 */
  toolbarVariant = "default",
}: {
  className?: string;
  onQuickMeeting: () => void;
  onScheduleMeeting: () => void;
  toolbarVariant?: "default" | "figma0417";
}) {
  const btnClass =
    toolbarVariant === "figma0417" ? taskDetailToolbarIconBtnClassFigma0417 : taskDetailToolbarIconBtnClass;
  const iconSize = toolbarVariant === "figma0417" ? "lg" : "md";
  return (
    <HoverCard openDelay={80} closeDelay={120}>
      <HoverCardTrigger asChild>
        <button
          type="button"
          title="会议"
          aria-label="会议"
          className={cn(btnClass, className)}
        >
          <TaskActionIcon actionId="meeting" size={iconSize} />
        </button>
      </HoverCardTrigger>
      <HoverCardContent
        align="end"
        sideOffset={6}
        className="z-[160] w-auto min-w-[148px] max-w-[min(220px,calc(100vw-48px))] rounded-[var(--radius-md)] border border-border bg-bg p-1 shadow-md"
      >
        <div className="flex flex-col gap-px">
          <button
            type="button"
            className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-[length:var(--font-size-xs)] text-text leading-tight hover:bg-[var(--black-alpha-11)] transition-colors"
            onClick={onQuickMeeting}
          >
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-secondary text-text">
              <Zap className="size-[14px]" strokeWidth={1.5} />
            </span>
            快速会议
          </button>
          <button
            type="button"
            className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1.5 text-left text-[length:var(--font-size-xs)] text-text leading-tight hover:bg-[var(--black-alpha-11)] transition-colors"
            onClick={onScheduleMeeting}
          >
            <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-secondary text-text">
              <Calendar className="size-[14px]" strokeWidth={1.5} />
            </span>
            预约会议
          </button>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

const SHARE_CONTACTS = [
  { id: "c1", name: "张三 (我)", seed: "zhang" },
  { id: "c2", name: "李四", seed: "li" },
  { id: "c3", name: "王五", seed: "wang" },
  { id: "c4", name: "张三（协作）", seed: "zhang-xie" },
  { id: "c5", name: "李四（审批）", seed: "li-shen" },
];

export function ShareTaskDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [q, setQ] = React.useState("");
  const [tab, setTab] = React.useState<"contacts" | "groups">("contacts");
  const [selected, setSelected] = React.useState<Record<string, boolean>>({});
  const [msg, setMsg] = React.useState("");
  const count = Object.values(selected).filter(Boolean).length;

  const filtered = SHARE_CONTACTS.filter((c) => c.name.includes(q) || q === "");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[960px] w-[calc(100vw-40px)] p-0 gap-0 overflow-hidden rounded-2xl max-h-[min(720px,calc(100vh-48px))] flex flex-col"
        onPointerDownOutside={preventDismissOnOverlay}
      >
        <DialogHeader className="border-b border-border-divider px-5 py-3 shrink-0">
          <DialogTitle className="text-[length:var(--font-size-md)]">分享</DialogTitle>
        </DialogHeader>
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 flex flex-col min-w-0 border-r border-border-divider">
            <div className="p-4 border-b border-border-divider">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-tertiary" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="请选择"
                  className="pl-9 h-10 rounded-lg border-border bg-bg-secondary"
                />
              </div>
            </div>
            <div className="px-4 pt-4 grid grid-cols-3 gap-3">
              {[
                { icon: Network, label: "组织架构" },
                { icon: Users, label: "我的群组" },
                { icon: Contact, label: "我的好友" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex flex-col items-center gap-2 py-3 rounded-xl border border-transparent hover:bg-[var(--black-alpha-11)] transition-colors"
                >
                  <span className="inline-flex size-12 items-center justify-center rounded-xl bg-bg-secondary text-text">
                    <Icon className="size-6" strokeWidth={1.25} />
                  </span>
                  <span className="text-[length:var(--font-size-xs)] text-text text-center">{label}</span>
                </button>
              ))}
            </div>
            <div className="px-4 pt-2 flex gap-6 border-b border-border-divider">
              <button
                type="button"
                onClick={() => setTab("contacts")}
                className={cn(
                  "pb-2 text-[length:var(--font-size-sm)] border-b-2 -mb-px transition-colors",
                  tab === "contacts" ? "border-primary text-primary font-[var(--font-weight-medium)]" : "border-transparent text-text-secondary"
                )}
              >
                最近联系人
              </button>
              <button
                type="button"
                onClick={() => setTab("groups")}
                className={cn(
                  "pb-2 text-[length:var(--font-size-sm)] border-b-2 -mb-px transition-colors",
                  tab === "groups" ? "border-primary text-primary font-[var(--font-weight-medium)]" : "border-transparent text-text-secondary"
                )}
              >
                最近群聊
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-2">
              {tab === "contacts" ? (
                <ul className="flex flex-col gap-0.5">
                  {filtered.map((c) => (
                    <li key={c.id}>
                      <label className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[var(--black-alpha-11)] cursor-pointer">
                        <Checkbox
                          checked={!!selected[c.id]}
                          onCheckedChange={(v) =>
                            setSelected((s) => ({ ...s, [c.id]: v === true }))
                          }
                        />
                        <Avatar className="size-8">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${c.seed}`} />
                          <AvatarFallback>{c.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-[length:var(--font-size-sm)] text-text">{c.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[length:var(--font-size-sm)] text-text-tertiary px-3 py-8 text-center">暂无最近群聊</p>
              )}
            </div>
          </div>
          <div className="w-[min(380px,42%)] flex flex-col shrink-0 bg-bg-secondary/40">
            <div className="px-4 py-3 border-b border-border-divider text-[length:var(--font-size-sm)] text-text">
              已选：<span className="tabular-nums font-[var(--font-weight-medium)]">{count}</span> 人
            </div>
            <div className="flex-1 min-h-[120px] p-3" />
            <div className="border-t border-border-divider p-4">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary mb-2 block">留言</Label>
              <Textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                placeholder="留言"
                className="min-h-[100px] rounded-xl border-border bg-bg resize-none"
              />
            </div>
            <div className="flex justify-end gap-3 px-4 pb-4">
              <button type="button" className={cn(pillBtn, pillSecondary)} onClick={() => onOpenChange(false)}>
                取消
              </button>
              <button type="button" className={cn(pillBtn, pillPrimary)} onClick={() => onOpenChange(false)}>
                确定
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** 含输入项的弹窗：拦截蒙层 pointer，避免误触关闭（须用取消/确定或右上角关闭） */
function preventDismissOnOverlay(
  e: Parameters<NonNullable<React.ComponentProps<typeof DialogContent>["onPointerDownOutside"]>>[0]
) {
  e.preventDefault();
}

/** 与标题行对齐的小号警示图标（避免喧宾夺主） */
function WarnIcon() {
  return (
    <div
      className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#FF9800] text-white shadow-sm"
      aria-hidden
    >
      <span className="text-[13px] font-bold leading-none">!</span>
    </div>
  );
}

export function PauseTaskDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm?: (reason: string) => void;
}) {
  const [reason, setReason] = React.useState("");
  React.useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[480px] rounded-2xl p-0 gap-0 overflow-hidden max-h-[min(560px,calc(100vh-80px))] flex flex-col"
        onPointerDownOutside={preventDismissOnOverlay}
      >
        <div className="p-6 pb-2 shrink-0">
          <div className="flex gap-2.5 items-center pr-8">
            <WarnIcon />
            <DialogTitle className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text leading-snug border-0 p-0">
              确定暂停任务？
            </DialogTitle>
          </div>
        </div>
        <div className="px-6 pb-6 flex-1 min-h-0 flex flex-col">
          <div className="relative rounded-xl border border-border bg-bg flex-1 min-h-[120px] flex flex-col">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              placeholder="请输入原因"
              className="min-h-[120px] flex-1 border-0 rounded-xl resize-y pr-16 pb-8"
              maxLength={500}
            />
            <span className="absolute bottom-2 right-3 text-[length:var(--font-size-xxs)] text-text-tertiary tabular-nums">
              {reason.length} / 500
            </span>
          </div>
          <div className="flex justify-end gap-3 mt-6 shrink-0">
            <button type="button" className={cn(pillBtn, pillSecondary)} onClick={() => onOpenChange(false)}>
              取消
            </button>
            <button
              type="button"
              className={cn(pillBtn, pillPrimary)}
              onClick={() => {
                onConfirm?.(reason);
                onOpenChange(false);
              }}
            >
              确定
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function TerminateTaskDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm?: (reason: string) => void;
}) {
  const [reason, setReason] = React.useState("");
  React.useEffect(() => {
    if (!open) setReason("");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-[480px] rounded-2xl p-0 gap-0 overflow-hidden max-h-[min(620px,calc(100vh-80px))] flex flex-col"
        onPointerDownOutside={preventDismissOnOverlay}
      >
        <div className="p-6 pb-2 shrink-0">
          <div className="flex gap-2.5 items-start pr-8">
            <WarnIcon />
            <div className="min-w-0 pt-0.5">
              <DialogTitle className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text leading-snug">
                确定终止任务？
              </DialogTitle>
              <p className="text-[length:var(--font-size-sm)] text-text-secondary mt-2 leading-relaxed">
                已终止的任务无法执行或记录工时，重启后可继续执行任务
              </p>
            </div>
          </div>
        </div>
        <div className="px-6 pb-6 flex-1 min-h-0 flex flex-col">
          <div className="relative rounded-xl border border-border bg-bg flex-1 min-h-[120px] flex flex-col">
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value.slice(0, 500))}
              placeholder="请输入原因"
              className="min-h-[120px] flex-1 border-0 rounded-xl resize-y pr-16 pb-8"
              maxLength={500}
            />
            <span className="absolute bottom-2 right-3 text-[length:var(--font-size-xxs)] text-text-tertiary tabular-nums">
              {reason.length} / 500
            </span>
          </div>
          <div className="flex justify-end gap-3 mt-6 shrink-0">
            <button type="button" className={cn(pillBtn, pillSecondary)} onClick={() => onOpenChange(false)}>
              取消
            </button>
            <button
              type="button"
              className={cn(pillBtn, pillPrimary)}
              onClick={() => {
                onConfirm?.(reason);
                onOpenChange(false);
              }}
            >
              确定
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function DeleteTaskDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onConfirm?: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] rounded-2xl p-0 gap-0 overflow-hidden max-h-[min(480px,calc(100vh-80px))]">
        <div className="p-6">
          <div className="flex gap-2.5 items-start pr-8">
            <WarnIcon />
            <div>
              <DialogTitle className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text">
                确定删除任务？
              </DialogTitle>
              <p className="text-[length:var(--font-size-sm)] text-text-secondary mt-3">任务删除后不可恢复</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8">
            <button type="button" className={cn(pillBtn, pillSecondary)} onClick={() => onOpenChange(false)}>
              取消
            </button>
            <button
              type="button"
              className={cn(pillBtn, pillPrimary)}
              onClick={() => {
                onConfirm?.();
                onOpenChange(false);
              }}
            >
              确定
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ExecutionStatusReadonly({ label }: { label: string }) {
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

/** 执行内容分工行详情：字段与列表一致，只读展示 */
export function ExecutionDivisionDetailDialog({
  open,
  onOpenChange,
  row,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  row: ExecutionDivisionRow | null;
}) {
  return (
    <Dialog open={Boolean(open && row)} onOpenChange={onOpenChange}>
      {row ? (
        <DialogContent className="max-w-[560px] w-[calc(100vw-40px)] rounded-2xl gap-0 p-0 overflow-hidden max-h-[min(640px,calc(100vh-48px))] flex flex-col z-[200]">
          <DialogHeader className="border-b border-border-divider px-5 py-4 shrink-0 text-left">
            <DialogTitle className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text">
              执行内容详情
            </DialogTitle>
            <p className="text-[length:var(--font-size-xs)] text-text-secondary m-0 mt-1 font-[var(--font-weight-regular)]">
              与列表字段一致，仅供查看（演示）
            </p>
          </DialogHeader>
          <div className="overflow-y-auto p-5 flex flex-col gap-[var(--space-500)]">
            <div className="flex flex-col gap-[var(--space-100)] min-w-0">
              <span className="text-[length:var(--font-size-xxs)] text-text-tertiary uppercase tracking-wide">
                执行内容
              </span>
              <p className="text-[length:var(--font-size-sm)] text-text font-[var(--font-weight-medium)] m-0 leading-snug">
                {row.content}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[var(--space-400)] gap-y-[var(--space-500)]">
              <div className="flex flex-col gap-[var(--space-100)] min-w-0">
                <span className="text-[length:var(--font-size-xxs)] text-text-tertiary uppercase tracking-wide">
                  执行人
                </span>
                <span className="text-[length:var(--font-size-sm)] text-text font-[var(--font-weight-medium)] truncate">
                  {row.assignee}
                </span>
              </div>
              <div className="flex flex-col gap-[var(--space-100)] min-w-0">
                <span className="text-[length:var(--font-size-xxs)] text-text-tertiary uppercase tracking-wide">
                  状态
                </span>
                <div>
                  <ExecutionStatusReadonly label={row.statusLabel} />
                </div>
              </div>
              <div className="flex flex-col gap-[var(--space-100)] min-w-0">
                <span className="text-[length:var(--font-size-xxs)] text-text-tertiary uppercase tracking-wide">
                  阶段
                </span>
                <span className="text-[length:var(--font-size-sm)] text-text font-[var(--font-weight-medium)]">
                  {row.phase}
                </span>
              </div>
              <div className="flex flex-col gap-[var(--space-100)] min-w-0">
                <span className="text-[length:var(--font-size-xxs)] text-text-tertiary uppercase tracking-wide">
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
              <div className="flex flex-col gap-[var(--space-100)] min-w-0 sm:col-span-2">
                <span className="text-[length:var(--font-size-xxs)] text-text-tertiary uppercase tracking-wide">
                  更新时间
                </span>
                <span className="text-[length:var(--font-size-sm)] text-text font-[var(--font-weight-medium)] tabular-nums">
                  {row.updatedAt}
                </span>
              </div>
            </div>
          </div>
          <div className="border-t border-border-divider px-5 py-3 flex justify-end shrink-0">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              关闭
            </Button>
          </div>
        </DialogContent>
      ) : null}
    </Dialog>
  );
}
