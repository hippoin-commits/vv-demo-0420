import * as React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { GenericCard } from "../GenericCard";
import { cn } from "../../ui/utils";
import {
  MAIL_LIST_BODY_SCROLL_CLASS,
  countUnreadInBusinessMailbox,
  countUnreadInPersonalMailbox,
  demoBusinessMailboxesWithUnread,
  demoPersonalMailboxesWithUnread,
  filterDemoMailRows,
  type MailScope,
} from "./emailCuiData";
import { MAILBOX_ADDRESS_ROW_CLASS, MailListRow } from "./MailCuiCards";

const sectionTitleClass =
  "m-0 text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] uppercase tracking-wide text-text-tertiary";

/**
 * 特殊卡片：收到新邮件
 * 一级：我的邮箱 / 业务邮箱；二级：仅有未读的邮箱地址及其列表；无未读账号不展示。
 * 分账号折叠：全卡按「我的邮箱 → 业务邮箱」顺序仅**第一个**有未读的邮箱默认展开，其余（含业务侧首个邮箱）默认收起（见 Guidelines · 邮箱 CUI）。
 */
export function ReceivedNewMailCard({
  businessScope,
  onOpenMail,
}: {
  businessScope: MailScope;
  onOpenMail: (id: string) => void;
}) {
  const personal = demoPersonalMailboxesWithUnread();
  const business = demoBusinessMailboxesWithUnread();
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() => {
    const p = demoPersonalMailboxesWithUnread();
    const b = demoBusinessMailboxesWithUnread();
    const o: Record<string, boolean> = {};
    [...p, ...b].forEach((mb, globalIndex) => {
      o[mb.id] = globalIndex === 0;
    });
    return o;
  });

  return (
    <GenericCard title="收到新邮件">
      <div className="flex w-full flex-col gap-[var(--space-400)]">
        {personal.length > 0 ? (
          <div className="flex flex-col gap-[var(--space-200)]">
            <p className={sectionTitleClass}>我的邮箱</p>
            <div className="flex w-full flex-col gap-[var(--space-200)]">
              {personal.map((mb, idx) => {
                const n = countUnreadInPersonalMailbox(mb.id);
                const rows = filterDemoMailRows("inbox", "personal", mb.id, "unread", undefined);
                const defaultOpen = idx === 0;
                const isOpen = expanded[mb.id] ?? defaultOpen;
                return (
                  <div
                    key={mb.id}
                    className="overflow-hidden rounded-[var(--radius-md)] border border-border"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => {
                          const cur = prev[mb.id] ?? defaultOpen;
                          return { ...prev, [mb.id]: !cur };
                        })
                      }
                      aria-expanded={isOpen}
                      className={cn(
                        MAILBOX_ADDRESS_ROW_CLASS,
                        "w-full border-0",
                        isOpen && "border-b border-border"
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                        {mb.email}
                        <span className="text-text-secondary tabular-nums"> ({n})</span>
                      </span>
                      {isOpen ? (
                        <ChevronDown className="size-4 shrink-0 text-text-tertiary" aria-hidden />
                      ) : (
                        <ChevronRight className="size-4 shrink-0 text-text-tertiary" aria-hidden />
                      )}
                    </button>
                    {isOpen ? (
                      <div
                        className={cn(
                          "divide-y divide-border bg-bg",
                          rows.length > 0 && MAIL_LIST_BODY_SCROLL_CLASS
                        )}
                      >
                        {rows.map((r) => (
                          <MailListRow key={r.id} row={r} onOpen={() => onOpenMail(r.id)} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {business.length > 0 ? (
          <div className="flex flex-col gap-[var(--space-200)]">
            <p className={sectionTitleClass}>业务邮箱</p>
            <div className="flex w-full flex-col gap-[var(--space-200)]">
              {business.map((mb, idx) => {
                const n = countUnreadInBusinessMailbox(mb.id);
                const rows = filterDemoMailRows(
                  "inbox",
                  businessScope,
                  undefined,
                  "unread",
                  mb.id
                );
                const defaultOpen = personal.length + idx === 0;
                const isOpen = expanded[mb.id] ?? defaultOpen;
                return (
                  <div
                    key={mb.id}
                    className="overflow-hidden rounded-[var(--radius-md)] border border-border"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded((prev) => {
                          const cur = prev[mb.id] ?? defaultOpen;
                          return { ...prev, [mb.id]: !cur };
                        })
                      }
                      aria-expanded={isOpen}
                      className={cn(
                        MAILBOX_ADDRESS_ROW_CLASS,
                        "w-full border-0",
                        isOpen && "border-b border-border"
                      )}
                    >
                      <span className="min-w-0 flex-1 truncate text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                        {mb.email}
                        <span className="text-text-secondary tabular-nums"> ({n})</span>
                      </span>
                      {isOpen ? (
                        <ChevronDown className="size-4 shrink-0 text-text-tertiary" aria-hidden />
                      ) : (
                        <ChevronRight className="size-4 shrink-0 text-text-tertiary" aria-hidden />
                      )}
                    </button>
                    {isOpen ? (
                      <div
                        className={cn(
                          "divide-y divide-border bg-bg",
                          rows.length > 0 && MAIL_LIST_BODY_SCROLL_CLASS
                        )}
                      >
                        {rows.map((r) => (
                          <MailListRow key={r.id} row={r} onOpen={() => onOpenMail(r.id)} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {personal.length === 0 && business.length === 0 ? (
          <p className="m-0 py-[var(--space-200)] text-center text-[length:var(--font-size-sm)] text-text-secondary">
            暂无新邮件
          </p>
        ) : null}
      </div>
    </GenericCard>
  );
}
