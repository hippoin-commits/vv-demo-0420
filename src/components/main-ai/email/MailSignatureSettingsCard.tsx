import * as React from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
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
import { MAILBOX_ADDRESS_ROW_CLASS } from "./MailCuiCards";
import {
  DEMO_BUSINESS_MAILBOXES,
  DEMO_PERSONAL_MAILBOXES,
  type DemoMailSignature,
} from "./emailCuiData";
import { useMailSignatureDemoState } from "./MailSignatureDemoStateContext";
import { afterDelete, setDefaultInList } from "./mailSignatureFormHelpers";

const sectionTitleClass =
  "m-0 text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)] uppercase tracking-wide text-text-tertiary";

type MailboxRow =
  | { kind: "personal"; id: string; email: string }
  | { kind: "business"; id: string; email: string };

const ORDERED_MAILBOXES: MailboxRow[] = [
  ...DEMO_PERSONAL_MAILBOXES.map((m) => ({ kind: "personal" as const, id: m.id, email: m.email })),
  ...DEMO_BUSINESS_MAILBOXES.map((m) => ({ kind: "business" as const, id: m.id, email: m.email })),
];

const tableHeadClass =
  "text-left text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary px-[var(--space-300)] py-[var(--space-200)]";
const tableCellClass =
  "px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)] text-text align-middle";

export function MailSignatureSettingsCard({
  onRequestSignatureEditor,
}: {
  /** 在对话中追加「新建 / 编辑签名」卡片（替代弹窗） */
  onRequestSignatureEditor?: (p: {
    mode: "create" | "edit";
    mailboxId: string;
    signatureId?: string;
  }) => void;
} = {}) {
  const { byMailbox, setByMailbox } = useMailSignatureDemoState();

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() => {
    const o: Record<string, boolean> = {};
    ORDERED_MAILBOXES.forEach((mb, index) => {
      o[mb.id] = index === 0;
    });
    return o;
  });

  const [deleteTarget, setDeleteTarget] = React.useState<{ mailboxId: string; sig: DemoMailSignature } | null>(
    null
  );

  const confirmDelete = () => {
    if (!deleteTarget) return;
    const { mailboxId, sig } = deleteTarget;
    setByMailbox((prev) => ({
      ...prev,
      [mailboxId]: afterDelete(prev[mailboxId] ?? [], sig.id),
    }));
    toast.success("已删除签名（演示）");
    setDeleteTarget(null);
  };

  const setAsDefault = (mailboxId: string, signatureId: string) => {
    setByMailbox((prev) => ({
      ...prev,
      [mailboxId]: setDefaultInList(prev[mailboxId] ?? [], signatureId),
    }));
    toast.success("已设为默认签名（演示）");
  };

  const openCreateForMailbox = (mb: MailboxRow) => {
    onRequestSignatureEditor?.({ mode: "create", mailboxId: mb.id });
  };

  const openEdit = (mailboxId: string, sig: DemoMailSignature) => {
    onRequestSignatureEditor?.({ mode: "edit", mailboxId, signatureId: sig.id });
  };

  return (
    <>
      <div
        className={cn(
          "relative flex w-full min-w-0 flex-col items-start gap-[var(--space-250)] rounded-[var(--radius-card)] bg-bg p-[var(--space-350)] shadow-elevation-sm"
        )}
      >
        <div className="relative flex w-full min-w-0 shrink-0 flex-col gap-[var(--space-200)]">
          <div className="flex min-w-0 flex-1 items-start gap-[var(--space-200)]">
            <div className="bg-primary h-[22px] w-[3px] shrink-0 self-start rounded-full" aria-hidden />
            <div className="flex min-w-0 flex-1 flex-col gap-[var(--space-100)]">
              <h3 className="m-0 min-w-0 text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] leading-[22px] text-text">
                签名设置
              </h3>
              <p
                className="m-0 min-w-0 text-[length:var(--font-size-xs)] text-text-tertiary"
                title="同一归属最多可创建10个邮件签名"
              >
                同一个归属最多可创建10个邮件签名
              </p>
            </div>
          </div>
        </div>

        <div className="flex w-full min-w-0 flex-col gap-[var(--space-400)]">
          {DEMO_PERSONAL_MAILBOXES.length > 0 ? (
            <div className="flex flex-col gap-[var(--space-200)]">
              <p className={sectionTitleClass}>我的邮箱</p>
              <div className="flex flex-col gap-[var(--space-100)]">
                {DEMO_PERSONAL_MAILBOXES.map((mb, mbIndex) => {
                  const globalIndex = mbIndex;
                  const defaultOpen = globalIndex === 0;
                  const isOpen = expanded[mb.id] ?? defaultOpen;
                  const rows = byMailbox[mb.id] ?? [];
                  return (
                    <MailboxSignatureBlock
                      key={mb.id}
                      email={mb.email}
                      isOpen={isOpen}
                      onToggle={() =>
                        setExpanded((prev) => {
                          const cur = prev[mb.id] ?? defaultOpen;
                          return { ...prev, [mb.id]: !cur };
                        })
                      }
                      rows={rows}
                      onSetDefault={(id) => setAsDefault(mb.id, id)}
                      onEdit={(sig) => openEdit(mb.id, sig)}
                      onDelete={(sig) => setDeleteTarget({ mailboxId: mb.id, sig })}
                      onNewSignature={() =>
                        openCreateForMailbox({ kind: "personal", id: mb.id, email: mb.email })
                      }
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          {DEMO_BUSINESS_MAILBOXES.length > 0 ? (
            <div className="flex flex-col gap-[var(--space-200)]">
              <p className={sectionTitleClass}>业务邮箱</p>
              <div className="flex flex-col gap-[var(--space-100)]">
                {DEMO_BUSINESS_MAILBOXES.map((mb, mbIndex) => {
                  const globalIndex = DEMO_PERSONAL_MAILBOXES.length + mbIndex;
                  const defaultOpen = globalIndex === 0;
                  const isOpen = expanded[mb.id] ?? defaultOpen;
                  const rows = byMailbox[mb.id] ?? [];
                  return (
                    <MailboxSignatureBlock
                      key={mb.id}
                      email={mb.email}
                      isOpen={isOpen}
                      onToggle={() =>
                        setExpanded((prev) => {
                          const cur = prev[mb.id] ?? defaultOpen;
                          return { ...prev, [mb.id]: !cur };
                        })
                      }
                      rows={rows}
                      onSetDefault={(id) => setAsDefault(mb.id, id)}
                      onEdit={(sig) => openEdit(mb.id, sig)}
                      onDelete={(sig) => setDeleteTarget({ mailboxId: mb.id, sig })}
                      onNewSignature={() =>
                        openCreateForMailbox({ kind: "business", id: mb.id, email: mb.email })
                      }
                    />
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <AlertDialog open={Boolean(deleteTarget)} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="z-[210]">
          <AlertDialogHeader>
            <AlertDialogTitle>删除签名？</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget ? `将删除「${deleteTarget.sig.title}」，此操作可在演示中撤销（刷新页面恢复初始数据）。` : null}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function MailboxSignatureBlock({
  email,
  isOpen,
  onToggle,
  rows,
  onSetDefault,
  onEdit,
  onDelete,
  onNewSignature,
}: {
  email: string;
  isOpen: boolean;
  onToggle: () => void;
  rows: DemoMailSignature[];
  onSetDefault: (id: string) => void;
  onEdit: (sig: DemoMailSignature) => void;
  onDelete: (sig: DemoMailSignature) => void;
  onNewSignature: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(MAILBOX_ADDRESS_ROW_CLASS, isOpen && "border-b border-border")}
      >
        <span className="min-w-0 flex-1 truncate text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
          {email}
        </span>
        {isOpen ? (
          <ChevronDown className="size-4 shrink-0 text-text-tertiary" aria-hidden />
        ) : (
          <ChevronRight className="size-4 shrink-0 text-text-tertiary" aria-hidden />
        )}
      </button>
      {isOpen ? (
        <div className="flex flex-col bg-bg">
          {rows.length === 0 ? (
            <p className="m-0 px-[var(--space-300)] py-[var(--space-400)] text-center text-[length:var(--font-size-sm)] text-text-secondary">
              暂无签名
            </p>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse">
                <thead>
                  <tr className="border-b border-border bg-bg-secondary/50">
                    <th className={tableHeadClass}>标题</th>
                    <th className={cn(tableHeadClass, "w-[120px]")}>设为默认</th>
                    <th className={cn(tableHeadClass, "w-[100px] text-right")}>操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td className={tableCellClass}>
                        <span className="font-[var(--font-weight-medium)]">{row.title}</span>
                      </td>
                      <td className={tableCellClass}>
                        {row.isDefault ? (
                          <span
                            className="inline-flex items-center rounded-[var(--radius-full)] px-[var(--space-150)] py-[var(--space-50)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-[color:var(--color-success)] bg-[color-mix(in_srgb,var(--color-success)_14%,transparent)]"
                          >
                            默认签名
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSetDefault(row.id)}
                            className="border-0 bg-transparent p-0 text-[length:var(--font-size-sm)] text-primary underline-offset-2 hover:underline cursor-pointer"
                          >
                            设为默认
                          </button>
                        )}
                      </td>
                      <td className={cn(tableCellClass, "text-right")}>
                        <div className="inline-flex items-center justify-end gap-[var(--space-100)]">
                          <button
                            type="button"
                            onClick={() => onEdit(row)}
                            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-text"
                            aria-label={`编辑 ${row.title}`}
                          >
                            <Pencil className="size-4" strokeWidth={1.75} />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(row)}
                            className="inline-flex size-8 items-center justify-center rounded-[var(--radius-md)] text-text-secondary transition-colors hover:bg-[var(--black-alpha-11)] hover:text-[color:var(--color-error)]"
                            aria-label={`删除 ${row.title}`}
                          >
                            <Trash2 className="size-4" strokeWidth={1.75} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="border-t border-border px-[var(--space-300)] py-[var(--space-250)]">
            <button
              type="button"
              onClick={onNewSignature}
              className="border-0 bg-transparent p-0 text-left text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary underline-offset-2 hover:underline cursor-pointer"
            >
              新建签名
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
