import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { cn } from "../ui/utils";

interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  task?: {
    iconSrc: string;
    title: string;
    time?: string;
    description?: string;
    members?: Array<{
      id: string;
      name: string;
      avatar: string;
    }>;
  };
}

/** 待办详情侧栏；与任务群聊/任务描述抽屉一致：全屏蒙层 + 右侧滑出，点击蒙层仅关闭 */
export function TaskDetailDrawer({ isOpen, onClose, task }: TaskDetailDrawerProps) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {isOpen && (
        <div
          role="presentation"
          className="fixed inset-0 z-[140] bg-[var(--color-overlay)]"
          onClick={onClose}
        />
      )}
      <div
        className={cn(
          "fixed top-0 right-0 z-[141] h-full w-full md:w-[400px] max-w-[100vw] flex flex-col",
          "bg-bg border-l border-border shadow-[var(--shadow-md)]",
          "transition-transform duration-300 ease-out",
          isOpen && task ? "translate-x-0" : "translate-x-full pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal={isOpen}
        aria-label="待办详情"
      >
        {task && (
          <>
            <div className="flex items-center justify-between p-[var(--space-400)] border-b border-border shrink-0">
              <h2 className="text-text text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)]">
                待办详情
              </h2>
              <button
                type="button"
                title="关闭"
                onClick={onClose}
                className="w-[var(--space-800)] h-[var(--space-800)] flex items-center justify-center rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] transition-colors text-text-secondary outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="关闭"
              >
                <X className="w-[18px] h-[18px]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-[var(--space-400)] min-h-0">
              <div className="bg-bg border border-border rounded-[var(--radius-lg)] p-[var(--space-400)] mb-[var(--space-400)]">
                <div className="flex items-start gap-[var(--space-300)]">
                  <div className="w-[var(--space-1000)] h-[var(--space-1000)] flex items-center justify-center shrink-0">
                    <img src={task.iconSrc} alt={task.title} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-text text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] mb-[var(--space-100)]">
                      {task.title}
                    </h3>
                    {task.time && (
                      <p className="text-text-secondary text-[length:var(--font-size-xs)] mb-[var(--space-200)]">
                        {task.time}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-[var(--space-100)]">
                      <span className="inline-flex items-center px-[var(--space-200)] py-[var(--space-50)] rounded-[var(--radius-sm)] bg-[var(--blue-alpha-11)] text-primary text-[length:var(--font-size-xs)]">
                        待处理
                      </span>
                      <span className="inline-flex items-center px-[var(--space-200)] py-[var(--space-50)] rounded-[var(--radius-sm)] bg-[var(--orange-alpha-11)] text-warning text-[length:var(--font-size-xs)]">
                        优先级高
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-[var(--space-400)]">
                <h4 className="text-text text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] mb-[var(--space-200)]">
                  描述
                </h4>
                <p className="text-text-secondary text-[length:var(--font-size-base)] leading-[var(--line-height-base)]">
                  {task.description || "暂无描述"}
                </p>
              </div>

              {task.members && task.members.length > 0 && (
                <div className="mb-[var(--space-400)]">
                  <h4 className="text-text text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] mb-[var(--space-200)]">
                    相关成员
                  </h4>
                  <div className="flex flex-wrap gap-[var(--space-200)]">
                    {task.members.map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center gap-[var(--space-200)] p-[var(--space-200)] rounded-[var(--radius-md)] hover:bg-[var(--black-alpha-11)] cursor-pointer transition-colors"
                      >
                        <Avatar className="w-[var(--space-800)] h-[var(--space-800)]">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-text text-[length:var(--font-size-base)]">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-[var(--space-400)] border-t border-border flex gap-[var(--space-200)] shrink-0 bg-bg">
              <Button variant="primary" className="flex-1">
                标记完成
              </Button>
              <Button variant="secondary" className="flex-1" onClick={onClose}>
                关闭
              </Button>
            </div>
          </>
        )}
      </div>
    </>,
    document.body
  );
}
