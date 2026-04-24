import * as React from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { GenericCard } from "../GenericCard";
import {
  DEMO_BUSINESS_MAILBOXES,
  DEMO_PERSONAL_MAILBOXES,
  MAX_DEMO_MAIL_SIGNATURES_PER_MAILBOX,
  type DemoMailSignature,
} from "./emailCuiData";
import { useMailSignatureDemoState } from "./MailSignatureDemoStateContext";
import { insertSignature } from "./mailSignatureFormHelpers";

type MailboxRow =
  | { kind: "personal"; id: string; email: string }
  | { kind: "business"; id: string; email: string };

const ORDERED_MAILBOXES: MailboxRow[] = [
  ...DEMO_PERSONAL_MAILBOXES.map((m) => ({ kind: "personal" as const, id: m.id, email: m.email })),
  ...DEMO_BUSINESS_MAILBOXES.map((m) => ({ kind: "business" as const, id: m.id, email: m.email })),
];

function mailboxSelectValue(mb: MailboxRow): string {
  return `${mb.kind}:${mb.id}`;
}

function parseMailboxSelectValue(v: string): MailboxRow | null {
  const i = v.indexOf(":");
  if (i < 0) return null;
  const kind = v.slice(0, i) as "personal" | "business";
  const id = v.slice(i + 1);
  if (kind === "personal") {
    const m = DEMO_PERSONAL_MAILBOXES.find((x) => x.id === id);
    return m ? { kind: "personal", id: m.id, email: m.email } : null;
  }
  const m = DEMO_BUSINESS_MAILBOXES.find((x) => x.id === id);
  return m ? { kind: "business", id: m.id, email: m.email } : null;
}

function isKnownMailboxId(id: string): boolean {
  return ORDERED_MAILBOXES.some((m) => m.id === id);
}

export function MailSignatureEditorInChatCard({
  messageId,
  mode,
  mailboxId,
  signatureId,
}: {
  messageId: string;
  mode: "create" | "edit";
  mailboxId: string;
  signatureId?: string;
}) {
  const { byMailbox, setByMailbox } = useMailSignatureDemoState();
  const mbRow = ORDERED_MAILBOXES.find((m) => m.id === mailboxId);

  const listForEdit = byMailbox[mailboxId] ?? [];
  const existingSig =
    mode === "edit" && signatureId ? listForEdit.find((s) => s.id === signatureId) : undefined;

  const [formMailbox, setFormMailbox] = React.useState(() =>
    mbRow ? mailboxSelectValue(mbRow) : mailboxSelectValue(ORDERED_MAILBOXES[0])
  );
  const [formTitle, setFormTitle] = React.useState(() =>
    mode === "edit" && existingSig ? existingSig.title : ""
  );
  const [formBody, setFormBody] = React.useState(() =>
    mode === "edit" && existingSig ? existingSig.body : ""
  );

  const saveCreate = () => {
    const mb = parseMailboxSelectValue(formMailbox);
    if (!mb) return;
    const t = formTitle.trim();
    if (!t) {
      toast.error("请填写签名标题");
      return;
    }
    const cur = byMailbox[mb.id] ?? [];
    if (cur.length >= MAX_DEMO_MAIL_SIGNATURES_PER_MAILBOX) {
      toast.error(`同一邮箱最多 ${MAX_DEMO_MAIL_SIGNATURES_PER_MAILBOX} 个签名`);
      return;
    }
    const isFirst = cur.length === 0;
    const sig: DemoMailSignature = {
      id: `sig-${Date.now()}`,
      title: t,
      body: formBody.trim(),
      isDefault: isFirst,
    };
    setByMailbox((prev) => ({
      ...prev,
      [mb.id]: insertSignature(cur, sig),
    }));
    toast.success("已新建签名（演示）");
  };

  const saveEdit = () => {
    if (!signatureId) return;
    const t = formTitle.trim();
    if (!t) {
      toast.error("请填写签名标题");
      return;
    }
    setByMailbox((prev) => {
      const list = prev[mailboxId] ?? [];
      return {
        ...prev,
        [mailboxId]: list.map((s) =>
          s.id === signatureId ? { ...s, title: t, body: formBody.trim() } : s
        ),
      };
    });
    toast.success("已保存修改（演示）");
  };

  if (!isKnownMailboxId(mailboxId) || (mode === "edit" && (!signatureId || !existingSig))) {
    return (
      <GenericCard title="签名" subtitle="无法打开此表单（演示）">
        <p className="m-0 text-[length:var(--font-size-sm)] text-text-secondary">
          签名或邮箱数据无效，请从「签名设置」重新进入。
        </p>
      </GenericCard>
    );
  }

  const title = mode === "create" ? "新建签名" : "编辑签名";
  const idPrefix = `sig-editor-${messageId}`;

  return (
    <GenericCard title={title} subtitle={mode === "create" ? "在对话中填写并保存" : "在对话中修改并保存"}>
      <div className="flex w-full min-w-0 flex-col gap-[var(--space-300)]">
        {mode === "create" ? (
          <div className="flex flex-col gap-[var(--space-150)]">
            <Label htmlFor={`${idPrefix}-mb`}>归属邮箱</Label>
            <Select value={formMailbox} onValueChange={setFormMailbox}>
              <SelectTrigger id={`${idPrefix}-mb`} className="w-full rounded-[var(--radius-md)]">
                <SelectValue placeholder="选择邮箱" />
              </SelectTrigger>
              <SelectContent position="popper" className="z-[220]">
                <SelectGroup>
                  <SelectLabel>我的邮箱</SelectLabel>
                  {DEMO_PERSONAL_MAILBOXES.map((m) => (
                    <SelectItem key={m.id} value={`personal:${m.id}`}>
                      {m.email}
                    </SelectItem>
                  ))}
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>业务邮箱</SelectLabel>
                  {DEMO_BUSINESS_MAILBOXES.map((m) => (
                    <SelectItem key={m.id} value={`business:${m.id}`}>
                      {m.email}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p className="m-0 text-[length:var(--font-size-sm)] text-text-secondary">
            归属：{mbRow?.email ?? mailboxId}
          </p>
        )}

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label htmlFor={`${idPrefix}-title`}>标题</Label>
          <Input
            id={`${idPrefix}-title`}
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder={mode === "create" ? "签名名称" : undefined}
            className="rounded-[var(--radius-md)]"
          />
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label htmlFor={`${idPrefix}-body`}>
            {mode === "create" ? "签名内容（可选）" : "签名内容"}
          </Label>
          <Textarea
            id={`${idPrefix}-body`}
            value={formBody}
            onChange={(e) => setFormBody(e.target.value)}
            placeholder={mode === "create" ? "正文、联系方式等" : undefined}
            className={
              mode === "create"
                ? "min-h-[100px] rounded-[var(--radius-md)] resize-y"
                : "min-h-[120px] rounded-[var(--radius-md)] resize-y"
            }
          />
        </div>

        <div className="flex w-full min-w-0 flex-wrap items-stretch gap-[var(--space-200)] pt-[var(--space-100)] sm:flex-nowrap">
          <Button
            type="button"
            variant="chat-reset"
            className="shrink-0"
            onClick={() => {
              if (mode === "create") {
                setFormTitle("");
                setFormBody("");
                if (mbRow) setFormMailbox(mailboxSelectValue(mbRow));
              } else if (existingSig) {
                setFormTitle(existingSig.title);
                setFormBody(existingSig.body);
              }
            }}
          >
            重置
          </Button>
          {mode === "create" ? (
            <Button type="button" variant="chat-submit" className="min-w-0 flex-1" onClick={saveCreate}>
              保存
            </Button>
          ) : (
            <Button type="button" variant="chat-submit" className="min-w-0 flex-1" onClick={saveEdit}>
              保存
            </Button>
          )}
        </div>
      </div>
    </GenericCard>
  );
}
