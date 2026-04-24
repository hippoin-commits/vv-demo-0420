import * as React from "react";
import { createPortal } from "react-dom";
import { X, Search, Pin, Volume2, Copy } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { cn } from "../../ui/utils";

type TaskGroupChatDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskTitle: string;
  orgName?: string;
};

/** 任务群聊 · 右侧抽屉（非卡片内嵌，与参考图一致） */
export function TaskGroupChatDrawer({
  open,
  onOpenChange,
  taskTitle,
  orgName = "PG科技",
}: TaskGroupChatDrawerProps) {
  if (typeof document === "undefined") return null;

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
        aria-label="任务群聊"
      >
        <header className="flex items-start justify-between gap-[var(--space-300)] px-[var(--space-400)] py-[var(--space-400)] border-b border-border shrink-0">
          <div className="min-w-0">
            <h2 className="text-[length:var(--font-size-md)] font-[var(--font-weight-semi-bold)] text-text leading-tight truncate">
              【任务群】{taskTitle} (2)
            </h2>
            <p className="text-[length:var(--font-size-xs)] text-text-secondary mt-[var(--space-100)]">{orgName}</p>
          </div>
          <div className="flex items-center gap-[var(--space-100)] shrink-0">
            <button
              type="button"
              title="静音"
              className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="静音"
            >
              <Volume2 className="size-[18px]" />
            </button>
            <button
              type="button"
              title="搜索"
              className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="搜索"
            >
              <Search className="size-[18px]" />
            </button>
            <button
              type="button"
              title="置顶"
              className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="置顶"
            >
              <Pin className="size-[18px]" />
            </button>
            <button
              type="button"
              title="复制"
              className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="复制"
            >
              <Copy className="size-[18px]" />
            </button>
            <button
              type="button"
              title="关闭"
              className="p-[var(--space-150)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="关闭"
              onClick={() => onOpenChange(false)}
            >
              <X className="size-[18px]" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-[var(--space-400)] py-[var(--space-400)] flex flex-col gap-[var(--space-400)] bg-bg-secondary/40">
          <div className="rounded-[var(--radius-md)] border border-border bg-[var(--blue-alpha-11)] px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-xs)] text-text-secondary">
            团队每位成员都应有强烈的责任心与使命感！{" "}
            <button type="button" className="text-primary hover:underline">
              查看详情
            </button>
          </div>
          <p className="text-center text-[length:var(--font-size-xxs)] text-text-tertiary">2025-8-25 15:39</p>
          <ChatNoticeCard
            name="迟焕"
            title="任务评价"
            body="已对任务给出评价【10 分】，内容：okk"
          />
          <p className="text-center text-[length:var(--font-size-xxs)] text-text-tertiary">2025-9-4 11:15</p>
          <ChatNoticeCard
            name="迟焕"
            title="执行内容流转"
            body="执行内容「测试任务2」已从完成阶段退回到设计阶段，请相关成员尽快调整。"
          />
        </div>

        <footer className="border-t border-border p-[var(--space-300)] shrink-0 bg-bg">
          <textarea
            readOnly
            placeholder="请输入消息，Shift+Enter 换行，Enter 发送"
            className="w-full min-h-[72px] rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)] text-text placeholder:text-text-muted resize-none mb-[var(--space-200)]"
          />
          <div className="flex flex-wrap gap-[var(--space-200)] text-[length:var(--font-size-xxs)] text-text-tertiary">
            <span>语音</span>
            <span>表情</span>
            <span>@</span>
            <span>图片</span>
            <span>截图</span>
            <span>文件夹</span>
          </div>
        </footer>
      </div>
    </>,
    document.body
  );
}

function ChatNoticeCard({ name, title, body }: { name: string; title: string; body: string }) {
  return (
    <div className="flex gap-[var(--space-300)]">
      <Avatar className="size-[36px] shrink-0">
        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`} />
        <AvatarFallback>{name[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0 rounded-[var(--radius-md)] border border-border bg-bg p-[var(--space-300)] shadow-xs">
        <p className="text-[length:var(--font-size-xs)] text-text mb-[var(--space-150)]">
          <span className="font-[var(--font-weight-medium)] text-text">{name}</span>
          <span className="text-text-secondary"> · {title}</span>
        </p>
        <p className="text-[length:var(--font-size-sm)] text-text leading-relaxed">{body}</p>
        <button type="button" className="mt-[var(--space-200)] text-[length:var(--font-size-xs)] text-primary hover:underline">
          查看详情
        </button>
      </div>
    </div>
  );
}
