import * as React from "react";
import { ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import { GenericCard } from "../GenericCard";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../ui/alert-dialog";
import { cn } from "../../ui/utils";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  DEMO_BUSINESS_MAILBOXES,
  DEMO_PERSONAL_MAILBOXES,
  MAIL_LIST_BODY_SCROLL_CLASS,
  countUnreadInBusinessMailbox,
  countUnreadInPersonalMailbox,
  filterDemoMailRows,
  type DemoMailRow,
  type MailFolderId,
  type MailListFilter,
  type MailScope,
} from "./emailCuiData";

/** 列表行：主行名称 + 副行地址（与 from / fromDisplayName 一致） */
function mailListSenderLines(row: DemoMailRow): { primary: string; secondary?: string } {
  const from = row.from.trim();
  const name = row.fromDisplayName?.trim();
  if (name) {
    if (from && from !== name) {
      return { primary: name, secondary: from };
    }
    return { primary: name };
  }
  return { primary: from || "—" };
}

/** 无头像时：取展示名或地址的首字符（支持中文等） */
function mailListAvatarFallbackChar(row: DemoMailRow): string {
  const source = (row.fromDisplayName?.trim() || row.from.trim() || "?");
  const first = [...source][0];
  if (!first) return "?";
  if (/[a-zA-Z]/.test(first)) return first.toUpperCase();
  return first;
}

export function MailListRow({
  row,
  onOpen,
  showDraftDelete,
  onDraftDeleteClick,
}: {
  row: DemoMailRow;
  onOpen: () => void;
  /** 草稿箱：行尾删除，与点击行打开编辑互斥触发 */
  showDraftDelete?: boolean;
  onDraftDeleteClick?: () => void;
}) {
  const unread = Boolean(row.unread);
  const { primary: senderPrimary, secondary: senderSecondary } = mailListSenderLines(row);
  const fallbackChar = mailListAvatarFallbackChar(row);

  return (
    <div className="flex w-full min-w-0 items-stretch">
      <button
        type="button"
        onClick={onOpen}
        className="flex min-w-0 flex-1 items-stretch gap-[var(--space-250)] px-[var(--space-300)] py-[var(--space-300)] text-left transition-colors hover:bg-[var(--black-alpha-11)]"
      >
        <Avatar className="size-11 shrink-0 self-start border border-border/70 bg-bg-secondary shadow-none">
          {row.fromAvatarUrl ? (
            <AvatarImage src={row.fromAvatarUrl} alt="" className="object-cover" />
          ) : null}
          <AvatarFallback
            delayMs={row.fromAvatarUrl ? 60 : 0}
            className="rounded-full bg-muted text-[length:var(--font-size-sm)] font-semibold text-text-secondary"
          >
            {fallbackChar}
          </AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-100)]">
          <div className="flex min-w-0 items-start justify-between gap-[var(--space-200)]">
            <div className="min-w-0 flex-1 flex flex-col gap-[2px]">
              <span
                className={cn(
                  "truncate text-[length:var(--font-size-sm)] leading-snug",
                  unread ? "font-semibold text-text" : "font-[var(--font-weight-medium)] text-text"
                )}
              >
                {senderPrimary}
              </span>
              {senderSecondary ? (
                <span className="truncate text-[length:var(--font-size-xs)] leading-snug text-text-secondary">
                  {senderSecondary}
                </span>
              ) : null}
            </div>
            <span className="shrink-0 pt-[1px] text-[length:var(--font-size-xxs)] text-text-tertiary tabular-nums">
              {row.time}
            </span>
          </div>
          <span
            className={cn(
              "line-clamp-2 text-[length:var(--font-size-sm)] leading-snug",
              unread ? "font-bold text-text" : "font-[var(--font-weight-medium)] text-text-secondary"
            )}
          >
            {row.subject}
          </span>
          <span className="line-clamp-2 text-[length:var(--font-size-xs)] leading-relaxed text-text-tertiary">
            {row.preview}
          </span>
        </div>
      </button>
      {showDraftDelete ? (
        <button
          type="button"
          aria-label="删除草稿"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDraftDeleteClick?.();
          }}
          className="flex shrink-0 items-center justify-center px-[var(--space-250)] text-text-tertiary hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <Trash2 className="size-[18px]" strokeWidth={2} aria-hidden />
        </button>
      ) : null}
    </div>
  );
}

/** 地址行：灰底，与下方白底列表区分（业务 / 我的邮箱分块共用） */
export const MAILBOX_ADDRESS_ROW_CLASS =
  "flex w-full items-center justify-between gap-[var(--space-200)] bg-bg-secondary px-[var(--space-300)] py-[var(--space-200)] text-left transition-colors hover:bg-[var(--black-alpha-11)]";

/** 分组列表默认展开态：每个账号列表仅首项展开（演示数据与 Guidelines 一致） */
function defaultExpandedMapForDemoMailboxes(): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  DEMO_PERSONAL_MAILBOXES.forEach((mb, i) => {
    out[mb.id] = i === 0;
  });
  DEMO_BUSINESS_MAILBOXES.forEach((mb, i) => {
    out[mb.id] = i === 0;
  });
  return out;
}

/** 地址行括号内数字：收件箱为未读数；发件箱/草稿箱为该账号下当前列表条数 */
function addressBadgeLabel(
  folder: MailFolderId,
  kind: "personal" | "business",
  mailboxId: string,
  sectionRows: DemoMailRow[]
): string | null {
  if (folder === "inbox") {
    const n =
      kind === "personal"
        ? countUnreadInPersonalMailbox(mailboxId)
        : countUnreadInBusinessMailbox(mailboxId);
    return n > 0 ? String(n) : null;
  }
  const n = sectionRows.length;
  return n > 0 ? String(n) : null;
}

export function MailMailboxListCard({
  title,
  rows,
  onOpenMail,
  /** 聚合「我的邮箱」按账号分块（收件箱 / 发件箱 / 草稿箱） */
  groupByPersonalMailboxes = false,
  /** 聚合「业务邮箱」按账号分块，需传 businessScope（租户 id） */
  groupByBusinessMailboxes = false,
  businessScope,
  folder = "inbox",
  listFilter = "all",
  /** 草稿箱：已从列表移除的演示邮件 id */
  hiddenDraftIds,
  /** 草稿箱：确认删除后由父级写入存储并更新 state */
  onDeleteDraft,
}: {
  title: string;
  rows: DemoMailRow[];
  onOpenMail: (id: string) => void;
  groupByPersonalMailboxes?: boolean;
  groupByBusinessMailboxes?: boolean;
  businessScope?: MailScope;
  folder?: MailFolderId;
  listFilter?: MailListFilter;
  hiddenDraftIds?: ReadonlySet<string>;
  onDeleteDraft?: (id: string) => void;
}) {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(defaultExpandedMapForDemoMailboxes);
  const [draftDeleteTargetId, setDraftDeleteTargetId] = React.useState<string | null>(null);

  const showDraftDelete = folder === "drafts" && Boolean(onDeleteDraft);

  const filterDraftHidden = React.useCallback(
    (list: DemoMailRow[]) => {
      if (!showDraftDelete || !hiddenDraftIds?.size) return list;
      return list.filter((r) => !hiddenDraftIds.has(r.id));
    },
    [showDraftDelete, hiddenDraftIds]
  );

  const draftDeleteDialog = (
    <AlertDialog
      open={Boolean(draftDeleteTargetId)}
      onOpenChange={(o) => !o && setDraftDeleteTargetId(null)}
    >
      <AlertDialogContent className="z-[210]">
        <AlertDialogHeader>
          <AlertDialogTitle>确定删除草稿？</AlertDialogTitle>
          <AlertDialogDescription>
            删除后将从草稿箱移除。演示数据保存在本机浏览器，清除站点数据可恢复列表。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>取消</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (draftDeleteTargetId && onDeleteDraft) onDeleteDraft(draftDeleteTargetId);
              setDraftDeleteTargetId(null);
            }}
          >
            删除
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  const groupedKind = groupByBusinessMailboxes ? "business" : groupByPersonalMailboxes ? "personal" : null;

  const businessAggregateInvalid =
    groupedKind === "business" &&
    (businessScope === undefined || businessScope === "all" || businessScope === "personal");

  if (groupedKind && !businessAggregateInvalid) {
    const scopeForFilter: MailScope =
      groupedKind === "personal" ? "personal" : (businessScope as MailScope);
    const mailboxes =
      groupedKind === "personal" ? DEMO_PERSONAL_MAILBOXES : DEMO_BUSINESS_MAILBOXES;

    return (
      <>
        <GenericCard title={title} className="gap-[var(--space-150)]">
          <div className="flex w-full flex-col gap-[var(--space-100)]">
              {mailboxes.map((mb, mbIndex) => {
                let sectionRows = filterDemoMailRows(
                  folder,
                  scopeForFilter,
                  groupedKind === "personal" ? mb.id : undefined,
                  listFilter,
                  groupedKind === "business" ? mb.id : undefined
                );
                sectionRows = filterDraftHidden(sectionRows);
                const isEmpty = sectionRows.length === 0;
                const badge = addressBadgeLabel(folder, groupedKind, mb.id, sectionRows);
                /** 默认仅展开当前分组内第一个邮箱，其余收起（见 Guidelines · 邮箱 CUI） */
                const defaultOpen = mbIndex === 0;
                const isOpen = expanded[mb.id] ?? defaultOpen;
                return (
                  <div key={mb.id} className="overflow-hidden rounded-[var(--radius-md)] border border-border">
                    {isEmpty ? (
                      <div
                        className="flex w-full items-center gap-[var(--space-200)] bg-bg-secondary px-[var(--space-300)] py-[var(--space-200)]"
                        role="group"
                        aria-label={`${mb.email}，暂无邮件`}
                      >
                        <p className="m-0 min-w-0 flex-1 text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] leading-snug text-text">
                          <span className="break-all">{mb.email}</span>
                          <span className="text-text-tertiary font-[var(--font-weight-regular)] text-[length:var(--font-size-xs)]">
                            {" "}
                            暂无邮件
                          </span>
                        </p>
                      </div>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((prev) => {
                              const cur = prev[mb.id] ?? defaultOpen;
                              return { ...prev, [mb.id]: !cur };
                            })
                          }
                          aria-expanded={isOpen}
                          className={cn(MAILBOX_ADDRESS_ROW_CLASS, isOpen && "border-b border-border")}
                        >
                          <span className="min-w-0 flex-1 truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                            {mb.email}
                            {badge !== null ? (
                              <span className="text-text-secondary tabular-nums"> ({badge})</span>
                            ) : null}
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
                              sectionRows.length > 0 && MAIL_LIST_BODY_SCROLL_CLASS
                            )}
                          >
                            {sectionRows.map((r) => (
                              <MailListRow
                                key={r.id}
                                row={r}
                                onOpen={() => onOpenMail(r.id)}
                                showDraftDelete={showDraftDelete}
                                onDraftDeleteClick={
                                  showDraftDelete ? () => setDraftDeleteTargetId(r.id) : undefined
                                }
                              />
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                );
              })}
          </div>
        </GenericCard>
        {draftDeleteDialog}
      </>
    );
  }

  const flatRows = filterDraftHidden(rows);

  return (
    <>
      <GenericCard title={title}>
        <div
          className={cn(
            "flex flex-col gap-0 w-full rounded-[var(--radius-md)] border border-border divide-y divide-border bg-bg overflow-hidden",
            flatRows.length > 0 && MAIL_LIST_BODY_SCROLL_CLASS
          )}
        >
          {flatRows.length === 0 ? (
            <p className="text-[length:var(--font-size-sm)] text-text-secondary py-[var(--space-400)] px-[var(--space-300)] m-0 text-center">
              暂无邮件
            </p>
          ) : (
            flatRows.map((r) => (
              <MailListRow
                key={r.id}
                row={r}
                onOpen={() => onOpenMail(r.id)}
                showDraftDelete={showDraftDelete}
                onDraftDeleteClick={
                  showDraftDelete ? () => setDraftDeleteTargetId(r.id) : undefined
                }
              />
            ))
          )}
        </div>
      </GenericCard>

      {draftDeleteDialog}
    </>
  );
}
