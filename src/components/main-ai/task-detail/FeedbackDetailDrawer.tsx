import * as React from "react";
import { createPortal } from "react-dom";
import {
  X,
  List,
  SquarePlus,
  FileText,
  SquareArrowOutUpRight,
  Link2,
  MessageSquare,
  Share2,
  Pencil,
  ChevronDown,
  ChevronUp,
  Smile,
  AtSign,
  Send,
  Flag,
  Copy,
  ArrowLeft,
} from "lucide-react";
import { cn } from "../../ui/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { FeedbackListItem } from "./feedbackTypes";
import { FeedbackEditFormPanel } from "./FeedbackEditFormPanel";

export type FeedbackDrawerPanel = "detail" | "edit";

type TagTone = "gray" | "yellow" | "red" | "blue" | "orange" | "muted";

function TagBadge({ children, tone }: { children: React.ReactNode; tone: TagTone }) {
  const tones: Record<TagTone, string> = {
    gray: "bg-bg-tertiary text-text-secondary border-border",
    yellow: "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800",
    red: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900",
    blue: "bg-primary/10 text-primary border-primary/20",
    orange: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-300",
    muted: "bg-bg-secondary text-text-secondary border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded px-[6px] py-[2px] text-[11px] leading-tight border",
        tones[tone]
      )}
    >
      {children}
    </span>
  );
}

type CommentNode = {
  id: string;
  name: string;
  seed: string;
  time: string;
  text: string;
  replies?: CommentNode[];
};

function buildDemoModel(item: FeedbackListItem, taskName: string) {
  const isA = item.id === "fb-seed-1";
  const headline = isA
    ? "【分享】复制链接放到 vv IM 发送后，显示见下图"
    : item.title;
  const linkDemo = "https://uat-bj.vvtechnology.cn/common/wak…";
  const ft = item.time.includes(" ") ? item.time.replace(/^\d{4}-/, "").replace(/\s+/, " ") : item.time;
  const ut = isA ? "04-10 18:26" : "04-09 10:05";
  const ftShort = isA ? "04-10 10:21" : ft.slice(0, 11);

  const tags: { label: string; tone: TagTone; icon?: "flag" }[] = isA
    ? [
        { label: "Bug", tone: "gray" },
        { label: "一般", tone: "yellow" },
        { label: "高", tone: "red", icon: "flag" },
        { label: "PC", tone: "blue" },
        { label: "UI样式缺陷", tone: "muted" },
        { label: "预生产环境", tone: "gray" },
        { label: "功能测试", tone: "gray" },
        { label: "必现", tone: "orange" },
      ]
    : [
        { label: item.feedbackType || "问题", tone: "gray" },
        { label: "一般", tone: "yellow" },
        { label: "中", tone: "muted" },
      ];

  const comments: CommentNode[] = isA
    ? [
        {
          id: "c1",
          name: "费照君",
          seed: "fei",
          time: "2026-04-10 20:40",
          text: "已复现，麻烦 @于洪娜 协助看下链接跳转。",
          replies: [
            {
              id: "c1-1",
              name: "于洪娜",
              seed: "yu",
              time: "2026-04-10 21:05",
              text: "收到，我这边再抓一下 HAR。",
            },
          ],
        },
        {
          id: "c2",
          name: "李静",
          seed: "li",
          time: "2026-04-10 22:10",
          text: "附一张 IM 内嵌页截图（演示）。",
        },
      ]
    : [
        {
          id: "c1",
          name: item.reporterName,
          seed: item.reporterName,
          time: item.time,
          text: "请经办人跟进处理，谢谢。",
        },
      ];

  return {
    headline,
    tags,
    linkDemo,
    reporter: isA
      ? { name: "于洪娜", seed: "yuhongna" }
      : { name: item.reporterName, seed: item.reporterName },
    assignee: isA
      ? { name: "孙旭东", seed: "sunxudong" }
      : { name: item.assignee || "—", seed: item.assignee || "assignee" },
    participants: isA
      ? "费照君 等5人"
      : item.participants?.trim()
        ? `${item.participants.split(/[,，\s]+/)[0]} 等5人`
        : "—",
    responsible: "无",
    feedbackTimeShort: ftShort,
    updateTimeShort: ut,
    feedbackObject: `任务：${taskName}`,
    interactionCount: isA ? 16 : 3,
    comments,
    status: item.status,
    /** 反馈正文：优先列表项 body，否则演示占位 */
    descriptionText:
      item.body?.trim() ||
      (isA ? "404 Not Found" : "请经办人跟进处理，谢谢。"),
  };
}

function CommentCard({
  node,
  depth = 0,
}: {
  node: CommentNode;
  depth?: number;
}) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-md)] border border-border bg-bg-secondary p-[var(--space-300)]",
        depth > 0 && "ml-[var(--space-500)] mt-[var(--space-200)] border-dashed"
      )}
    >
      <div className="flex items-start justify-between gap-[var(--space-200)] mb-[var(--space-150)]">
        <div className="flex items-center gap-[var(--space-200)] min-w-0">
          <Avatar className="size-8 shrink-0">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(node.seed)}`} />
            <AvatarFallback>{node.name[0]}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-[length:var(--font-size-xs)] text-text">
              <span className="font-[var(--font-weight-medium)]">{node.name}</span>
              <span className="text-text-tertiary tabular-nums"> · {node.time}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0 text-text-tertiary">
          <button type="button" className="p-1 rounded hover:bg-[var(--black-alpha-11)]" aria-label="表情">
            <Smile className="size-[14px]" />
          </button>
          <button type="button" className="p-1 rounded hover:bg-[var(--black-alpha-11)]" aria-label="回复">
            <MessageSquare className="size-[14px]" />
          </button>
        </div>
      </div>
      <p className="text-[length:var(--font-size-sm)] text-text leading-relaxed whitespace-pre-wrap">{node.text}</p>
      {node.replies?.map((r) => (
        <CommentCard key={r.id} node={r} depth={depth + 1} />
      ))}
    </div>
  );
}

export function FeedbackDetailDrawer({
  open,
  onOpenChange,
  item,
  taskName,
  initialPanel = "detail",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: FeedbackListItem | null;
  /** 当前任务名称，用于「反馈对象」与编辑表单任务标签 */
  taskName: string;
  /** 打开抽屉时默认进入详情或编辑表单（列表「编辑」用 edit） */
  initialPanel?: FeedbackDrawerPanel;
}) {
  const [status, setStatus] = React.useState("待处理");
  const [metaExpanded, setMetaExpanded] = React.useState(true);
  const [tab, setTab] = React.useState<"interaction" | "related" | "log">("interaction");
  const [panel, setPanel] = React.useState<FeedbackDrawerPanel>("detail");

  const model = React.useMemo(() => (item ? buildDemoModel(item, taskName) : null), [item, taskName]);

  React.useEffect(() => {
    if (open && item) {
      setStatus(item.status);
      setPanel(initialPanel);
    }
  }, [open, item, initialPanel]);

  if (typeof document === "undefined") return null;
  if (!open || !item || !model) return null;

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
          "fixed top-0 right-0 z-[141] h-full flex flex-col",
          "w-[50vw] min-w-0 max-w-[100vw]",
          "bg-bg border-l border-border",
          "transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal={open}
        aria-label={panel === "edit" ? "编辑反馈" : "反馈详情"}
      >
        {/* Header */}
        <header className="flex items-center justify-between gap-[var(--space-300)] px-[var(--space-400)] py-[var(--space-350)] border-b border-border shrink-0">
          {panel === "edit" ? (
            <>
              <div className="flex items-center gap-[var(--space-200)] min-w-0 flex-1">
                <button
                  type="button"
                  title="返回详情"
                  className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="返回详情"
                  onClick={() => setPanel("detail")}
                >
                  <ArrowLeft className="size-[20px]" />
                </button>
                <h2 className="text-[length:var(--font-size-md)] font-[var(--font-weight-semi-bold)] text-text m-0 truncate">
                  编辑反馈
                </h2>
              </div>
              <button
                type="button"
                title="关闭"
                className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
                aria-label="关闭"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-[20px]" />
              </button>
            </>
          ) : (
            <>
              <h2 className="text-[length:var(--font-size-md)] font-[var(--font-weight-semi-bold)] text-text m-0 truncate">
                反馈详情
              </h2>
              <div className="flex items-center gap-[var(--space-100)] shrink-0">
                <button
                  type="button"
                  className="inline-flex items-center gap-[var(--space-100)] px-[var(--space-200)] py-[var(--space-100)] rounded-[var(--radius-md)] text-[length:var(--font-size-xs)] text-text-secondary hover:bg-[var(--black-alpha-11)] hover:text-text"
                >
                  <List className="size-[16px]" />
                  更多反馈
                </button>
                <button
                  type="button"
                  className="inline-flex items-center gap-[var(--space-100)] px-[var(--space-200)] py-[var(--space-100)] rounded-[var(--radius-md)] text-[length:var(--font-size-xs)] text-text-secondary hover:bg-[var(--black-alpha-11)] hover:text-text"
                  onClick={() => setPanel("edit")}
                >
                  <Pencil className="size-[16px]" />
                  编辑
                </button>
                <button
                  type="button"
                  title="关闭"
                  className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="关闭"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="size-[20px]" />
                </button>
              </div>
            </>
          )}
        </header>

        {panel === "edit" && item ? (
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <FeedbackEditFormPanel item={item} taskName={taskName} hideFooter />
            </div>
            <footer className="shrink-0 border-t border-border bg-bg px-[var(--space-400)] py-[var(--space-300)] shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
              <div className="flex w-full min-w-0 flex-wrap items-stretch gap-[var(--space-300)] sm:flex-nowrap">
                <Button
                  type="button"
                  variant="chat-reset"
                  className="h-10 w-fit shrink-0 px-4"
                  onClick={() => setPanel("detail")}
                >
                  取消
                </Button>
                <Button
                  type="button"
                  variant="chat-submit"
                  className="h-10 min-w-0 flex-1 px-4 sm:min-w-[88px]"
                  onClick={() => setPanel("detail")}
                >
                  确定
                </Button>
              </div>
            </footer>
          </div>
        ) : (
        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-[var(--space-300)] px-[var(--space-400)] py-[var(--space-300)] border-b border-border shrink-0">
            <div className="flex items-center gap-1 text-text-tertiary">
              <button type="button" className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] hover:text-text" aria-label="添加">
                <SquarePlus className="size-[18px]" />
              </button>
              <button type="button" className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] hover:text-text" aria-label="文档">
                <FileText className="size-[18px]" />
              </button>
              <button type="button" className="p-2 rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] hover:text-text" aria-label="打开外链">
                <SquareArrowOutUpRight className="size-[18px]" />
              </button>
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-8 w-fit min-w-[120px] rounded-full border border-border bg-bg px-3 text-[length:var(--font-size-xs)] gap-2">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={cn(
                      "size-2 rounded-full shrink-0",
                      status === "待处理" && "bg-warning",
                      status === "处理中" && "bg-primary",
                      status === "已完成" && "bg-emerald-500"
                    )}
                  />
                  <SelectValue />
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="待处理">待处理</SelectItem>
                <SelectItem value="处理中">处理中</SelectItem>
                <SelectItem value="已完成">已完成</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="px-[var(--space-400)] py-[var(--space-400)] flex flex-col gap-[var(--space-500)]">
            {metaExpanded ? (
              <>
                {/* Summary */}
                <section className="rounded-[var(--radius-md)] border border-border bg-bg-secondary p-[var(--space-400)]">
                  <h3 className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text leading-snug m-0 mb-[var(--space-300)]">
                    {model.headline}
                  </h3>
                  <div className="flex flex-wrap gap-[var(--space-150)] mb-[var(--space-400)]">
                    {model.tags.map((t) => (
                      <TagBadge key={t.label + t.tone} tone={t.tone}>
                        {t.icon === "flag" ? (
                          <>
                            <Flag className="size-3 text-red-600 shrink-0" />
                            {t.label}
                          </>
                        ) : (
                          t.label
                        )}
                      </TagBadge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between gap-[var(--space-300)] pt-[var(--space-200)] border-t border-border-divider">
                    <div className="flex items-center gap-2 text-text-tertiary">
                      <button type="button" className="p-1.5 rounded hover:bg-[var(--black-alpha-11)] hover:text-text" aria-label="链接">
                        <Link2 className="size-[16px]" />
                      </button>
                      <button type="button" className="p-1.5 rounded hover:bg-[var(--black-alpha-11)] hover:text-text" aria-label="评论">
                        <MessageSquare className="size-[16px]" />
                      </button>
                      <button type="button" className="p-1.5 rounded hover:bg-[var(--black-alpha-11)] hover:text-text" aria-label="分享">
                        <Share2 className="size-[16px]" />
                      </button>
                    </div>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="h-8 w-fit rounded-full border border-border bg-bg px-3 text-[length:var(--font-size-xs)]">
                        <span className="inline-flex items-center gap-1.5">
                          <span className="size-2 rounded-full bg-warning shrink-0" />
                          <SelectValue />
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="待处理">待处理</SelectItem>
                        <SelectItem value="处理中">处理中</SelectItem>
                        <SelectItem value="已完成">已完成</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </section>

                {/* Metadata grid */}
                <section className="grid grid-cols-1 sm:grid-cols-2 gap-x-[var(--space-600)] gap-y-[var(--space-400)] text-[length:var(--font-size-xs)]">
                  <div className="flex flex-col gap-[var(--space-150)]">
                    <span className="text-text-tertiary">反馈人</span>
                    <div className="flex items-center gap-2 text-text">
                      <Avatar className="size-7">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(model.reporter.seed)}`}
                        />
                        <AvatarFallback>{model.reporter.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-[var(--font-weight-medium)]">{model.reporter.name}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[var(--space-150)]">
                    <span className="text-text-tertiary">经办人</span>
                    <div className="flex items-center gap-2 text-text">
                      <Avatar className="size-7">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(model.assignee.seed)}`}
                        />
                        <AvatarFallback>{model.assignee.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-[var(--font-weight-medium)]">{model.assignee.name}</span>
                      <button
                        type="button"
                        className="p-1 rounded text-text-tertiary hover:text-primary"
                        aria-label="编辑"
                        onClick={() => setPanel("edit")}
                      >
                        <Pencil className="size-[14px]" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[var(--space-150)]">
                    <span className="text-text-tertiary">参与人</span>
                    <div className="flex items-center gap-2 text-text min-w-0">
                      <span className="truncate">{model.participants}</span>
                      <ChevronDown className="size-4 text-text-tertiary shrink-0" />
                      <button
                        type="button"
                        className="p-1 rounded text-text-tertiary hover:text-primary shrink-0"
                        aria-label="编辑"
                        onClick={() => setPanel("edit")}
                      >
                        <Pencil className="size-[14px]" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[var(--space-150)]">
                    <span className="text-text-tertiary">责任人</span>
                    <div className="flex items-center gap-2 text-text">
                      <span>{model.responsible}</span>
                      <button
                        type="button"
                        className="p-1 rounded text-text-tertiary hover:text-primary"
                        aria-label="编辑"
                        onClick={() => setPanel("edit")}
                      >
                        <Pencil className="size-[14px]" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[var(--space-100)]">
                    <span className="text-text-tertiary">反馈时间</span>
                    <span className="text-text tabular-nums">{model.feedbackTimeShort}</span>
                  </div>
                  <div className="flex flex-col gap-[var(--space-100)]">
                    <span className="text-text-tertiary">更新时间</span>
                    <span className="text-text tabular-nums">{model.updateTimeShort}</span>
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-[var(--space-100)]">
                    <span className="text-text-tertiary">反馈对象</span>
                    <span className="text-text leading-relaxed break-words">{model.feedbackObject}</span>
                  </div>
                </section>
              </>
            ) : null}

            {/* 反馈描述（只读：链接 + 正文，无输入框、头像与底部工具条） */}
            <section>
              <p className="text-[length:var(--font-size-xs)] text-text-tertiary mb-[var(--space-200)]">反馈描述</p>
              <div className="rounded-[var(--radius-md)] border border-border bg-bg-secondary p-[var(--space-400)] flex flex-col gap-[var(--space-300)]">
                <div className="inline-flex items-center gap-2 min-w-0 flex-wrap">
                  <a
                    href={model.linkDemo}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-[length:var(--font-size-sm)] break-all hover:underline min-w-0"
                  >
                    {model.linkDemo}
                  </a>
                  <button
                    type="button"
                    className="shrink-0 inline-flex text-text-tertiary hover:text-primary p-0.5 rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    aria-label="复制链接"
                    onClick={() => {
                      void navigator.clipboard?.writeText(model.linkDemo);
                    }}
                  >
                    <Copy className="size-4" />
                  </button>
                </div>
                <p className="text-[length:var(--font-size-sm)] text-text leading-relaxed m-0 whitespace-pre-wrap">
                  {model.descriptionText}
                </p>
              </div>
            </section>

            {/* 收起 / 展开 */}
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full border-border text-[length:var(--font-size-xs)] gap-1"
                onClick={() => setMetaExpanded((v) => !v)}
              >
                {metaExpanded ? (
                  <>
                    收起
                    <ChevronUp className="size-4" />
                  </>
                ) : (
                  <>
                    展开
                    <ChevronDown className="size-4" />
                  </>
                )}
              </Button>
            </div>

            {/* 附件 */}
            <section>
              <p className="text-[length:var(--font-size-xs)] text-text-tertiary mb-[var(--space-200)]">附件</p>
              <p className="text-[length:var(--font-size-sm)] text-text-tertiary m-0">--</p>
            </section>

            {/* Tabs */}
            <section className="border-t border-border pt-[var(--space-400)]">
              <div className="flex items-center justify-between gap-[var(--space-200)] mb-[var(--space-300)]">
                <div className="flex items-center gap-1 min-w-0 overflow-x-auto scrollbar-hide">
                  {(
                    [
                      { id: "interaction" as const, label: `互动 ${model.interactionCount}` },
                      { id: "related" as const, label: "关联任务" },
                      { id: "log" as const, label: "操作日志" },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTab(t.id)}
                      className={cn(
                        "shrink-0 px-3 py-2 text-[length:var(--font-size-xs)] border-b-2 -mb-px transition-colors",
                        tab === t.id
                          ? "text-primary border-primary font-[var(--font-weight-medium)]"
                          : "text-text-secondary border-transparent hover:text-text"
                      )}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-1 shrink-0 text-text-tertiary">
                  <button type="button" className="p-2 rounded hover:bg-[var(--black-alpha-11)]" aria-label="添加">
                    <SquarePlus className="size-[16px]" />
                  </button>
                  <button type="button" className="p-2 rounded hover:bg-[var(--black-alpha-11)]" aria-label="文档">
                    <FileText className="size-[16px]" />
                  </button>
                </div>
              </div>

              {tab === "interaction" && (
                <div className="flex flex-col gap-[var(--space-300)]">
                  {model.comments.map((c) => (
                    <CommentCard key={c.id} node={c} />
                  ))}
                </div>
              )}
              {tab === "related" && (
                <p className="text-[length:var(--font-size-xs)] text-text-tertiary m-0 py-4 text-center">暂无关联任务（演示）</p>
              )}
              {tab === "log" && (
                <p className="text-[length:var(--font-size-xs)] text-text-tertiary m-0 py-4 text-center">暂无操作日志（演示）</p>
              )}
            </section>
          </div>
        </div>
        )}

        {/* Bottom composer */}
        {panel === "detail" && (
        <footer className="shrink-0 border-t border-border px-[var(--space-400)] py-[var(--space-300)] bg-bg">
          <div className="relative flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg-secondary px-3 py-2">
            <Input
              readOnly
              placeholder="请输入评论"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 h-9 px-0 text-[length:var(--font-size-sm)]"
            />
            <div className="flex items-center gap-1 shrink-0 text-text-tertiary">
              <button type="button" className="p-1.5 rounded hover:bg-[var(--black-alpha-11)] hover:text-text" aria-label="表情">
                <Smile className="size-[18px]" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-[var(--black-alpha-11)] hover:text-text" aria-label="提及">
                <AtSign className="size-[18px]" />
              </button>
              <button type="button" className="p-1.5 rounded hover:bg-primary/15 text-primary" aria-label="发送">
                <Send className="size-[18px]" />
              </button>
            </div>
          </div>
        </footer>
        )}
      </div>
    </>,
    document.body
  );
}
