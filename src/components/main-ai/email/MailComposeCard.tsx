import * as React from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { GenericCard } from "../GenericCard";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
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
import { cn } from "../../ui/utils";
import {
  DEMO_BUSINESS_MAILBOXES,
  DEMO_MAILS,
  DEMO_PERSONAL_MAILBOXES,
  defaultComposeSelectValue,
  resolveComposeMailboxFromSelect,
  type DemoMailRow,
  type MailComposeEntryPayload,
} from "./emailCuiData";

function extractEmailFromSenderField(from: string): string {
  const t = from.trim();
  if (!t || t === "我") return "";
  const m = t.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i);
  return m ? m[0] : "";
}

function buildReSubject(original: string): string {
  const stripped = original.replace(/^(Re:\s*|回复[：:]\s*|FW:\s*)+/i, "").trim();
  return stripped ? `Re: ${stripped}` : "Re: （无主题）";
}

function buildFwdSubject(original: string): string {
  const stripped = original.replace(/^(Fwd:\s*|转发[：:]\s*|FW:\s*)+/i, "").trim();
  return stripped ? `Fwd: ${stripped}` : "Fwd: （无主题）";
}

function buildQuotedOriginal(mail: DemoMailRow): string {
  return [
    "",
    "---------- 原始邮件 ----------",
    `发件人：${mail.from}`,
    `主题：${mail.subject}`,
    `时间：${mail.time}`,
    "",
    mail.preview,
  ].join("\n");
}

const fieldLabelClass =
  "m-0 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary";

function FieldRow({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex w-full min-w-0 flex-col gap-[var(--space-150)]", className)}>
      <p className={fieldLabelClass}>{label}</p>
      {children}
    </div>
  );
}

export function MailComposeCard({
  payload,
  onSentDemo,
}: {
  payload?: MailComposeEntryPayload;
  /** 演示：点击发送后追加助手气泡 */
  onSentDemo: (summary: string) => void;
}) {
  const isDraftEdit = Boolean(payload?.draftMailId);
  const composeAction = payload?.composeAction;

  const defaultFrom = React.useMemo(() => defaultComposeSelectValue(payload), [payload]);
  const [fromValue, setFromValue] = React.useState(defaultFrom);
  const [to, setTo] = React.useState("");
  const [cc, setCc] = React.useState("");
  const [showCc, setShowCc] = React.useState(false);
  const [subject, setSubject] = React.useState("");
  const [body, setBody] = React.useState("");

  React.useEffect(() => {
    setFromValue(defaultComposeSelectValue(payload));
  }, [payload]);

  React.useEffect(() => {
    const id = payload?.draftMailId;
    if (!id) return;
    const row = DEMO_MAILS.find((m) => m.id === id);
    if (!row) return;
    setSubject(row.subject);
    setBody(row.preview);
    setTo("");
    setCc("");
    setShowCc(false);
  }, [payload?.draftMailId]);

  React.useEffect(() => {
    if (payload?.draftMailId) return;
    const action = payload?.composeAction;
    const mid = payload?.sourceMailId;
    if (!action || !mid) return;
    const row = DEMO_MAILS.find((m) => m.id === mid);
    if (!row) return;

    setFromValue(defaultFrom);
    const replyTo = extractEmailFromSenderField(row.from);
    const quote = buildQuotedOriginal(row);

    if (action === "reply") {
      setTo(replyTo);
      setShowCc(false);
      setCc("");
      setSubject(buildReSubject(row.subject));
      setBody(`\n${quote}`);
    } else if (action === "replyAll") {
      setTo(replyTo);
      setShowCc(true);
      setCc(replyTo ? "cc-demo@company.com" : "（演示：其他收件人与抄送人）");
      setSubject(buildReSubject(row.subject));
      setBody(`\n${quote}`);
    } else if (action === "forward") {
      setTo("");
      setShowCc(false);
      setCc("");
      setSubject(buildFwdSubject(row.subject));
      setBody(`\n\n${quote}`);
    }
  }, [payload?.draftMailId, payload?.composeAction, payload?.sourceMailId, defaultFrom, payload]);

  const cardTitle = isDraftEdit
    ? "编辑草稿"
    : composeAction === "reply"
      ? "回复邮件"
      : composeAction === "replyAll"
        ? "全部回复"
        : composeAction === "forward"
          ? "转发邮件"
          : "新邮件";

  const cardSubtitle = isDraftEdit
    ? "在对话中继续编辑草稿（演示）"
    : composeAction === "reply"
      ? "已从读信抽屉转入会话，在上方撰写回复（演示）"
      : composeAction === "replyAll"
        ? "回复发件人并保留抄送范围（演示数据已预填一行抄送）"
        : composeAction === "forward"
          ? "填写转发收件人后发送（演示）"
          : "撰写并发送邮件（演示）";

  const handleSend = () => {
    const trimmedTo = to.trim();
    if (!trimmedTo) {
      toast.error("请填写收件人（演示）");
      return;
    }
    const from = resolveComposeMailboxFromSelect(fromValue);
    const fromLine = from ? `${from.email}（${from.bucket}）` : fromValue;
    const ccPart = showCc && cc.trim() ? `，抄送 ${cc.trim()}` : "";
    const subjPart = subject.trim() ? `「${subject.trim()}」` : "（无主题）";
    const modeHint =
      composeAction === "reply"
        ? "回复"
        : composeAction === "replyAll"
          ? "全部回复"
          : composeAction === "forward"
            ? "转发"
            : "新邮件";
    onSentDemo(
      `已提交发送（演示，${modeHint}）：发件人 ${fromLine}，收件人 ${trimmedTo}${ccPart}，主题 ${subjPart}。正文 ${body.trim() ? "已填写" : "为空"}；正式版将调用发信接口。`
    );
    toast.success("已记录发送请求（演示）");
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <GenericCard title={cardTitle} subtitle={cardSubtitle}>
        <div className="flex w-full min-w-0 flex-col gap-[var(--space-300)]">
          <FieldRow label="发件人">
            <Select value={fromValue} onValueChange={setFromValue}>
              <SelectTrigger className="h-[var(--space-900)] !w-fit max-w-full rounded-[var(--radius-md)] text-[length:var(--font-size-sm)]">
                <SelectValue placeholder="选择发件邮箱" />
              </SelectTrigger>
              <SelectContent
                position="popper"
                className="z-[80] max-h-[min(70vh,400px)] max-w-[min(96vw,560px)] min-w-[var(--radix-select-trigger-width)] w-max"
              >
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
          </FieldRow>

          <FieldRow label="收件人">
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder={
                (composeAction === "reply" || composeAction === "replyAll") && !to.trim()
                  ? "未解析到邮箱时请手动填写原发件人地址"
                  : "name@example.com"
              }
              className="rounded-[var(--radius-md)] text-[length:var(--font-size-sm)]"
            />
          </FieldRow>

          {showCc ? (
            <FieldRow label="抄送">
              <Input
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="可选，多个地址用逗号分隔"
                className="rounded-[var(--radius-md)] text-[length:var(--font-size-sm)]"
              />
            </FieldRow>
          ) : composeAction !== "reply" ? (
            <button
              type="button"
              onClick={() => setShowCc(true)}
              className="self-start border-0 bg-transparent p-0 text-[length:var(--font-size-xs)] text-primary hover:underline"
            >
              添加抄送
            </button>
          ) : null}

          <FieldRow label="主题">
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="邮件主题"
              className="rounded-[var(--radius-md)] text-[length:var(--font-size-sm)]"
            />
          </FieldRow>

          <FieldRow label="正文">
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="请输入正文…"
              rows={8}
              className={cn(
                "min-h-[140px] w-full resize-y rounded-[var(--radius-md)] border border-border bg-input-background px-[var(--space-300)] py-[var(--space-200)]",
                "text-[length:var(--font-size-sm)] leading-relaxed text-text placeholder:text-text-placeholder",
                "focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/20"
              )}
            />
          </FieldRow>

          <div className="flex w-full flex-wrap items-center justify-end gap-[var(--space-200)] pt-[var(--space-100)]">
            <Button
              type="button"
              variant="primary"
              size="lg"
              rounded
              className="min-w-[120px] gap-[var(--space-150)]"
              onClick={handleSend}
            >
              <Send className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />
              发送
            </Button>
          </div>
        </div>
      </GenericCard>
    </div>
  );
}
