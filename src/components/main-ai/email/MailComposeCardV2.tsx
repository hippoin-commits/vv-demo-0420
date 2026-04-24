import * as React from "react";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Check,
  Forward,
  Italic,
  List,
  ListOrdered,
  Mail,
  Plus,
  Redo2,
  Reply,
  ReplyAll,
  Strikethrough,
  Underline,
  Undo2,
} from "lucide-react";
import { toast } from "sonner";
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
  return stripped ? `Re: ${stripped}` : "Re: (无主题)";
}

function buildFwdSubject(original: string): string {
  const stripped = original.replace(/^(Fwd:\s*|转发[：:]\s*|FW:\s*)+/i, "").trim();
  return stripped ? `Fwd: ${stripped}` : "Fwd: (无主题)";
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

const BODY_MAX = 10000;

function FormFieldLabel({
  children,
  required,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="text-[14px] leading-[20px] font-[var(--font-weight-regular)] text-text-tertiary">
      {required ? <span className="text-destructive mr-0.5">*</span> : null}
      {children}
    </span>
  );
}

/** 单行输入 / 下拉：高 36px、圆角 6px */
const inputShellClass =
  "h-[36px] w-full rounded-[6px] border border-border bg-bg px-3 py-0 text-[length:var(--font-size-base)] text-text placeholder:text-text-placeholder shadow-none transition-colors focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20";

/**
 * 「写邮件」卡片（实验样式）：顶栏返回+标题、表单项、附件、富文本工具条+正文、底栏存草稿/发送。
 * 业务逻辑与 {@link MailComposeCard} 一致；满意后可替换默认卡片。
 */
export function MailComposeCardV2({
  payload,
  onSentDemo,
}: {
  payload?: MailComposeEntryPayload;
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
  /** 点击「存草稿」后的演示时间戳 HH:mm */
  const [draftSavedAt, setDraftSavedAt] = React.useState<string | null>(null);

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
          : "写邮件";

  const headerIconEl = (() => {
    if (isDraftEdit) {
      return <Mail className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />;
    }
    switch (composeAction) {
      case "reply":
        return <Reply className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />;
      case "replyAll":
        return <ReplyAll className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />;
      case "forward":
        return <Forward className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />;
      default:
        return <Mail className="size-[18px] shrink-0" strokeWidth={2} aria-hidden />;
    }
  })();

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

  const handleSaveDraft = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    setDraftSavedAt(`${hh}:${mm}`);
    toast("草稿已保存（演示）");
  };

  const handleBodyChange = (v: string) => {
    if (v.length <= BODY_MAX) setBody(v);
  };

  return (
    <div className="flex w-full min-w-0 flex-col">
      <div
        className={cn(
          "w-full overflow-hidden rounded-[12px] border border-border bg-bg shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
        )}
      >
        {/* 顶栏：左为模式图标（信封 / 回复 / 全部回复 / 转发），文案与之一致；字色 --color-text-tertiary */}
        <div className="border-b border-border-divider pt-[14px] pr-[14px] pb-[12px] pl-[14px]">
          <div className="flex items-center gap-2">
            <span className="flex size-[18px] shrink-0 items-center justify-center text-text-tertiary">
              {headerIconEl}
            </span>
            <h3 className="m-0 min-w-0 flex-1 truncate text-[14px] font-[var(--font-weight-regular)] leading-[20px] text-text-tertiary">
              {cardTitle}
            </h3>
          </div>
        </div>

        <div className="flex flex-col gap-5 p-4">
          {/* 发件人 */}
          <div className="flex flex-col items-start gap-2">
            <FormFieldLabel required>发件人</FormFieldLabel>
            <Select value={fromValue} onValueChange={setFromValue}>
              <SelectTrigger
                className={cn(
                  inputShellClass,
                  "h-[36px] !w-fit max-w-full !py-0 text-[length:var(--font-size-base)] data-[placeholder]:text-text-muted"
                )}
              >
                <SelectValue placeholder="请选择发件邮箱" />
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
          </div>

          {/* 收件人；「添加抄送」在输入框下方 */}
          <div className="flex flex-col gap-2">
            <FormFieldLabel required>收件人</FormFieldLabel>
            <Input
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="请输入"
              className={cn(inputShellClass)}
            />
            {(composeAction === "reply" || composeAction === "replyAll") && !to.trim() ? (
              <p className="m-0 text-[length:var(--font-size-xs)] text-text-tertiary">
                未解析到邮箱时请手动填写原发件人地址
              </p>
            ) : null}
          </div>

          {/* 折叠态仅「添加抄送」按钮；点击后才出现下方「抄送」标题与输入框 */}
          {!showCc && composeAction !== "reply" ? (
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => setShowCc(true)}
                className="self-start border-0 bg-transparent p-0 text-left text-[length:var(--font-size-base)] text-primary hover:underline"
              >
                添加抄送
              </button>
            </div>
          ) : null}

          {showCc ? (
            <div className="flex flex-col gap-2">
              <FormFieldLabel>抄送</FormFieldLabel>
              <Input
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                placeholder="请输入，多个地址用逗号分隔"
                className={cn(inputShellClass)}
              />
            </div>
          ) : null}

          {/* 主题 — 类比商品名称 */}
          <div className="flex flex-col gap-2">
            <FormFieldLabel required>主题</FormFieldLabel>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="请输入"
              className={cn(inputShellClass)}
            />
          </div>

          {/* 附件 — 类比商品封面 */}
          <div className="flex flex-col gap-2">
            <FormFieldLabel>附件</FormFieldLabel>
            <button
              type="button"
              onClick={() => toast("演示：上传能力未接入，正式版可在此选择文件")}
              className={cn(
                "flex min-h-[104px] w-full flex-col items-center justify-center gap-2 rounded-[6px] border border-dashed border-primary bg-white transition-colors hover:bg-[var(--blue-alpha-11)]"
              )}
            >
              <span className="flex size-10 items-center justify-center rounded-[6px] border border-border bg-bg text-text-tertiary">
                <Plus className="size-5" strokeWidth={1.75} />
              </span>
              <span className="text-[length:var(--font-size-xs)] text-text-tertiary">
                支持 jpg、png、pdf，单文件不超过 10MB（演示）
              </span>
            </button>
          </div>

          {/* 正文 — 工具条 + 文本域 + 字数（类比商品详情） */}
          <div className="flex flex-col gap-2">
            <FormFieldLabel required>正文</FormFieldLabel>
            <div className="overflow-hidden rounded-[6px] border border-border bg-bg">
              <div
                className="flex flex-wrap items-center gap-0.5 border-b border-border bg-bg-secondary px-2 py-1.5"
                role="toolbar"
                aria-label="格式（演示，未接入富文本）"
              >
                {[
                  { Icon: Undo2, label: "撤销" },
                  { Icon: Redo2, label: "重做" },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-md p-1.5 text-text-tertiary hover:bg-bg hover:text-text"
                    aria-label={label}
                    onClick={() => toast("演示：富文本编辑器未接入")}
                  >
                    <Icon className="size-4" />
                  </button>
                ))}
                <span className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />
                {[
                  { Icon: Bold, label: "加粗" },
                  { Icon: Italic, label: "斜体" },
                  { Icon: Underline, label: "下划线" },
                  { Icon: Strikethrough, label: "删除线" },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-md p-1.5 text-text-tertiary hover:bg-bg hover:text-text"
                    aria-label={label}
                    onClick={() => toast("演示：富文本编辑器未接入")}
                  >
                    <Icon className="size-4" />
                  </button>
                ))}
                <span className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />
                {[
                  { Icon: AlignLeft, label: "左对齐" },
                  { Icon: AlignCenter, label: "居中" },
                  { Icon: AlignRight, label: "右对齐" },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-md p-1.5 text-text-tertiary hover:bg-bg hover:text-text"
                    aria-label={label}
                    onClick={() => toast("演示：富文本编辑器未接入")}
                  >
                    <Icon className="size-4" />
                  </button>
                ))}
                <span className="mx-1 h-4 w-px shrink-0 bg-border" aria-hidden />
                {[
                  { Icon: List, label: "无序列表" },
                  { Icon: ListOrdered, label: "有序列表" },
                ].map(({ Icon, label }) => (
                  <button
                    key={label}
                    type="button"
                    className="rounded-md p-1.5 text-text-tertiary hover:bg-bg hover:text-text"
                    aria-label={label}
                    onClick={() => toast("演示：富文本编辑器未接入")}
                  >
                    <Icon className="size-4" />
                  </button>
                ))}
              </div>
              <div className="relative">
                <textarea
                  value={body}
                  onChange={(e) => handleBodyChange(e.target.value)}
                  placeholder="请输入正文…"
                  rows={10}
                  className={cn(
                    "min-h-[200px] w-full resize-y border-0 bg-transparent px-3 py-2.5 pb-8",
                    "text-[length:var(--font-size-sm)] leading-relaxed text-text placeholder:text-text-placeholder",
                    "focus-visible:outline-none"
                  )}
                />
                <span className="pointer-events-none absolute bottom-2 right-3 text-[length:var(--font-size-xs)] tabular-nums text-text-tertiary">
                  {body.length} / {BODY_MAX}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 底栏：无顶部分割线；左侧草稿已保存状态；存草稿 + 发送邮件，高 42px */}
        <div className="flex items-center gap-3 pt-2 pr-[14px] pb-[14px] pl-[14px]">
          <div className="flex min-h-[42px] min-w-0 flex-1 items-center gap-1.5">
            {draftSavedAt ? (
              <>
                {/* 成功态：绿底白勾（--color-success）；文案 #2A2F3C 量级 → text-text / --color-text */}
                <span
                  className="inline-flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-success)]"
                  aria-hidden
                >
                  <Check className="size-[10px] text-[var(--color-success-foreground)]" strokeWidth={3} />
                </span>
                <span className="text-[14px] leading-[20px] text-text">草稿已保存</span>
                <time className="tabular-nums text-[14px] leading-[20px] text-text" dateTime={draftSavedAt}>
                  {draftSavedAt}
                </time>
              </>
            ) : null}
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <Button
              type="button"
              variant="chat-reset"
              className="h-[42px] min-h-[42px] shrink-0 px-5"
              onClick={handleSaveDraft}
            >
              存草稿
            </Button>
            <Button
              type="button"
              variant="chat-submit"
              className="h-[42px] min-h-[42px] min-w-[120px] px-5"
              onClick={handleSend}
            >
              发送邮件
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
