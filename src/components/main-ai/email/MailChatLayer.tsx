import * as React from "react";
import { ChatMessageBubble } from "../../chat/ChatMessageBubble";
import { TimestampSeparator } from "../../chat/ChatComponents";
import { cn } from "../../ui/utils";
import type { Conversation, Message, MessageOperationSource } from "../../chat/data";
import { currentUser } from "../../chat/data";
import { AssistantChatBubble } from "../../chat/ChatWelcome";
import { ChatPromptButton } from "../../chat/ChatPromptButton";
import { NewRoundSlotShell } from "../../chat/NewRoundSlotShell";
import { TaskChatMessageRow } from "../TaskChatMessageRow";
import { MailMailboxListCard } from "./MailCuiCards";
import { ReceivedNewMailCard } from "./ReceivedNewMailCard";
import { BusinessMailHubCard } from "./BusinessMailHubCard";
import { MailSettingsCuiCard } from "./MailSettingsCuiCard";
import { MailComposeCardV2 } from "./MailComposeCardV2";
import { MailReadInChatCard } from "./MailReadInChatCard";
import { MailSignatureEditorInChatCard } from "./MailSignatureEditorInChatCard";
import { MailSignatureDemoStateProvider } from "./MailSignatureDemoStateContext";
import { EmailReadDrawer } from "./EmailReadDrawer";
import { resolveOperationSourceLabel } from "../operationSource";
import { OperationSourceNavContext } from "../operationSourceNavContext";
import {
  parseMailComposeMarkerJson,
  parseMailMailboxMarkerJson,
  parseMailReadInChatMarkerJson,
  parseMailSettingsMarkerJson,
  parseMailSignatureEditorMarkerJson,
} from "../chatCardPayloadSafety";
import {
  DEMO_MAILS,
  DEMO_PERSONAL_MAILBOXES,
  MAIL_MAILBOX_MARKER,
  MAIL_NEW_MAIL_DIGEST_MARKER,
  MAIL_COMPOSE_ENTRY_MARKER,
  MAIL_READ_IN_CHAT_MARKER,
  MAIL_SIGNATURE_EDITOR_MARKER,
  MAIL_SETTINGS_MARKER,
  MAIL_TENANT_PICK_FOR_ADMIN_MARKER,
  MAIL_MAIL_ADMIN_PANEL_MARKER,
  buildMailboxListCardTitle,
  getDemoMailWelcomeGreeting,
  filterDemoMailRows,
  type MailFolderId,
  type MailListFilter,
  type MailScope,
  type MailComposeAction,
  type MailComposeEntryPayload,
  type MailWelcomeActionKind,
  type MailAdminPanelKind,
  type MailSignatureEditorMarkerPayload,
  mailSettingsPageTitle,
} from "./emailCuiData";
import { MailTenantPickForAdminCard, MailMailAdminPanelCard } from "./MailAdminCuiCards";
import { addDeletedDraftMailId, getDeletedDraftMailIds } from "./mailDraftDeletedStorage";

/** 与主会话时间分隔规则对齐的简化版 */
function mailShouldShowTimestamp(current: Message, previous: Message | null): boolean {
  if (!previous) return true;
  return current.timestamp !== previous.timestamp;
}

function messageIsMailSurfaceCard(content: string): boolean {
  return (
    content.startsWith(MAIL_MAILBOX_MARKER) ||
    content.startsWith(MAIL_NEW_MAIL_DIGEST_MARKER) ||
    content.startsWith(MAIL_SETTINGS_MARKER) ||
    content.startsWith(MAIL_COMPOSE_ENTRY_MARKER) ||
    content.startsWith(MAIL_READ_IN_CHAT_MARKER) ||
    content.startsWith(MAIL_SIGNATURE_EDITOR_MARKER) ||
    content.startsWith(MAIL_TENANT_PICK_FOR_ADMIN_MARKER) ||
    content.startsWith(MAIL_MAIL_ADMIN_PANEL_MARKER)
  );
}

export function MailChatLayer({
  messages,
  conversation,
  onAppendMailMessage,
  defaultBusinessScope,
  onMailWelcomeAction,
  /** 挂到最后一条消息外层，供主窗口 `scrollLatestCardRowToTop` 将新卡片顶对齐视口（窄卡时下方留白） */
  lastMessageRowRef,
  scrollToMessageById,
  mailAdminOrganizations = [],
  onPickTenantForMailAdmin,
  mailReadInChat = false,
  newRoundSlotWrapConfig = null,
}: {
  messages: Message[];
  conversation: Conversation;
  onAppendMailMessage?: (msg: Message) => void;
  defaultBusinessScope: string;
  onMailWelcomeAction?: (kind: MailWelcomeActionKind) => void;
  lastMessageRowRef?: React.MutableRefObject<HTMLDivElement | null>;
  scrollToMessageById: (messageId: string) => void;
  mailAdminOrganizations?: Array<{ id: string; name: string; icon?: string }>;
  onPickTenantForMailAdmin?: (
    tenantId: string,
    pending: MailAdminPanelKind,
    sourceMessageId: string,
    sourceConversationId: string
  ) => void;
  /** 0417：列表点信在会话内推读信卡片，不打开右侧抽屉 */
  mailReadInChat?: boolean;
  newRoundSlotWrapConfig?: {
    startMessageIndex: number;
    slotHeightPx: number;
    onOverflow: () => void;
    shellRef: React.RefObject<HTMLDivElement | null>;
    messageGapClassName: string;
    revealChildrenAfterMs?: number;
  } | null;
}) {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<(typeof DEMO_MAILS)[0] | null>(null);
  const drawerReadSourceRef = React.useRef<MessageOperationSource | null>(null);

  const mailIds = React.useMemo(() => DEMO_MAILS.map((m) => m.id), []);
  const selectedIndex = selected ? mailIds.indexOf(selected.id) : -1;
  const canPrevMail = selectedIndex > 0;
  const canNextMail = selectedIndex >= 0 && selectedIndex < mailIds.length - 1;

  const goPrevMail = React.useCallback(() => {
    if (selectedIndex <= 0) return;
    const id = mailIds[selectedIndex - 1];
    setSelected(DEMO_MAILS.find((m) => m.id === id) ?? null);
  }, [mailIds, selectedIndex]);

  const goNextMail = React.useCallback(() => {
    if (selectedIndex < 0 || selectedIndex >= mailIds.length - 1) return;
    const id = mailIds[selectedIndex + 1];
    setSelected(DEMO_MAILS.find((m) => m.id === id) ?? null);
  }, [mailIds, selectedIndex]);

  const appendAssistant = React.useCallback(
    (build: (ts: string, now: number) => Message, op?: MessageOperationSource) => {
      const now = Date.now();
      const ts = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const base = build(ts, now);
      onAppendMailMessage?.(op ? { ...base, operationSource: op } : base);
    },
    [onAppendMailMessage]
  );

  const handleAppendMailboxPayload = React.useCallback(
    (payload: Record<string, unknown>, fromSource?: MessageOperationSource) => {
      appendAssistant(
        (ts, now) => ({
          id: `mail-box-${now}-${JSON.stringify(payload).slice(0, 24)}`,
          senderId: conversation.user.id,
          content: `${MAIL_MAILBOX_MARKER}:${JSON.stringify(payload)}`,
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
        }),
        fromSource
      );
    },
    [appendAssistant, conversation.user.id]
  );

  const handleAppendPlainAssistant = React.useCallback(
    (text: string, fromSource?: MessageOperationSource) => {
      appendAssistant(
        (ts, now) => ({
          id: `mail-plain-${now}`,
          senderId: conversation.user.id,
          content: text,
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
        }),
        fromSource
      );
    },
    [appendAssistant, conversation.user.id]
  );

  const appendComposeEntry = React.useCallback(
    (payload?: MailComposeEntryPayload, fromSource?: MessageOperationSource) => {
      appendAssistant(
        (ts, now) => ({
          id: `mail-compose-entry-${now}`,
          senderId: conversation.user.id,
          content: `${MAIL_COMPOSE_ENTRY_MARKER}:${JSON.stringify(payload ?? {})}`,
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
        }),
        fromSource
      );
    },
    [appendAssistant, conversation.user.id]
  );

  const openMail = React.useCallback(
    (id: string, readSource?: MessageOperationSource) => {
      const row = DEMO_MAILS.find((m) => m.id === id) ?? null;
      if (mailReadInChat && !row) return;
      if (mailReadInChat && row) {
        appendAssistant(
          (ts, now) => ({
            id: `mail-read-chat-${now}-${id}`,
            senderId: conversation.user.id,
            content: `${MAIL_READ_IN_CHAT_MARKER}:${JSON.stringify({ mailId: id })}`,
            timestamp: ts,
            createdAt: now,
            isAfterPrompt: true,
            suppressAvatar: true,
          }),
          readSource
        );
        return;
      }
      setSelected(row);
      setDrawerOpen(true);
      drawerReadSourceRef.current = readSource ?? null;
    },
    [mailReadInChat, appendAssistant, conversation.user.id]
  );

  const openMailboxListRow = React.useCallback(
    (folder: MailFolderId, mailId: string, op: MessageOperationSource) => {
      if (folder === "drafts") {
        const row = DEMO_MAILS.find((m) => m.id === mailId);
        appendComposeEntry(
          {
            draftMailId: mailId,
            defaultPersonalMailboxId: row?.kind === "personal" ? row.personalMailboxId : undefined,
            defaultBusinessMailboxId: row?.kind === "business" ? row.businessMailboxId : undefined,
          },
          {
            ...op,
            sourceDetailLabel: row?.subject ?? op.sourceDetailLabel,
          }
        );
        return;
      }
      openMail(mailId, op);
    },
    [appendComposeEntry, openMail]
  );

  const [hiddenDraftIds, setHiddenDraftIds] = React.useState(() => getDeletedDraftMailIds());

  const handleDeleteDraft = React.useCallback((mailId: string) => {
    addDeletedDraftMailId(mailId);
    setHiddenDraftIds((prev) => new Set([...prev, mailId]));
  }, []);

  /** 读信抽屉：回复 / 全部回复 / 转发 → 关抽屉并在会话中推入写信卡片 */
  const handleReadDrawerCompose = React.useCallback(
    (action: MailComposeAction, row: (typeof DEMO_MAILS)[number]) => {
      setDrawerOpen(false);
      const src = drawerReadSourceRef.current;
      drawerReadSourceRef.current = null;
      appendComposeEntry(
        {
          composeAction: action,
          sourceMailId: row.id,
          defaultPersonalMailboxId: row.kind === "personal" ? row.personalMailboxId : undefined,
          defaultBusinessMailboxId: row.kind === "business" ? row.businessMailboxId : undefined,
        },
        src ? { ...src, sourceDetailLabel: row.subject } : undefined
      );
    },
    [appendComposeEntry]
  );

  /** 会话内读信卡片：回复 / 全部回复 / 转发 → 直接推入写信卡片（不关抽屉） */
  const handleInChatReadCompose = React.useCallback(
    (
      action: MailComposeAction,
      row: (typeof DEMO_MAILS)[number],
      readOp?: MessageOperationSource
    ) => {
      appendComposeEntry(
        {
          composeAction: action,
          sourceMailId: row.id,
          defaultPersonalMailboxId: row.kind === "personal" ? row.personalMailboxId : undefined,
          defaultBusinessMailboxId: row.kind === "business" ? row.businessMailboxId : undefined,
        },
        readOp ? { ...readOp, sourceDetailLabel: row.subject } : undefined
      );
    },
    [appendComposeEntry]
  );

  const appendSignatureEditorCard = React.useCallback(
    (payload: MailSignatureEditorMarkerPayload, fromSource?: MessageOperationSource) => {
      appendAssistant(
        (ts, now) => ({
          id: `mail-sig-editor-${now}`,
          senderId: conversation.user.id,
          content: `${MAIL_SIGNATURE_EDITOR_MARKER}:${JSON.stringify(payload)}`,
          timestamp: ts,
          createdAt: now,
          isAfterPrompt: true,
        }),
        fromSource
      );
    },
    [appendAssistant, conversation.user.id]
  );

  return (
    <MailSignatureDemoStateProvider>
      <>
      <div className="flex flex-col gap-[var(--space-625)] w-full">
        {(() => {
          const messageElements = messages.map((msg, index, arr) => {
          const isLastRow = index === arr.length - 1;
          const lastRowRefCallback =
            lastMessageRowRef && isLastRow
              ? (node: HTMLDivElement | null) => {
                  lastMessageRowRef.current = node;
                }
              : undefined;

          const operationSourceLabel = resolveOperationSourceLabel(
            msg,
            index,
            arr,
            conversation.id
          );
          const sourceNavValue = {
            onNavigateToOperationSource: msg.operationSource?.sourceMessageId
              ? () => scrollToMessageById(msg.operationSource!.sourceMessageId!)
              : undefined,
          };

          const isMe = msg.senderId === currentUser.id;
          const prev = index > 0 ? arr[index - 1] : null;
          const prevIsSurfaceCard = Boolean(prev && messageIsMailSurfaceCard(prev.content));
          const showTimestamp =
            !msg.suppressAvatar && mailShouldShowTimestamp(msg, prev);
          const isSameSender = Boolean(prev && prev.senderId === msg.senderId);
          const isWithin10Seconds =
            Boolean(prev) &&
            msg.createdAt !== undefined &&
            prev.createdAt !== undefined &&
            msg.createdAt - prev.createdAt <= 10000;
          /** 上一条为全宽卡片时禁止合并间距，避免气泡负 margin 叠在卡片上 */
          const hideAvatar =
            !prevIsSurfaceCard &&
            isSameSender &&
            !showTimestamp &&
            isWithin10Seconds &&
            !msg.isAfterPrompt;
          const isMailboxCard = msg.content.startsWith(MAIL_MAILBOX_MARKER);
          const isNewMailDigest = msg.content.startsWith(MAIL_NEW_MAIL_DIGEST_MARKER);
          const isComposeEntryCard = msg.content.startsWith(MAIL_COMPOSE_ENTRY_MARKER);
          const isReadInChatCard = msg.content.startsWith(MAIL_READ_IN_CHAT_MARKER);
          const isSignatureEditorCard = msg.content.startsWith(MAIL_SIGNATURE_EDITOR_MARKER);
          const isSettingsCard = msg.content.startsWith(MAIL_SETTINGS_MARKER);
          const isTenantPickCard = msg.content.startsWith(MAIL_TENANT_PICK_FOR_ADMIN_MARKER);
          const isAdminPanelCard = msg.content.startsWith(MAIL_MAIL_ADMIN_PANEL_MARKER);
          const hideAvatarForRow =
            isMailboxCard ||
            isNewMailDigest ||
            isSettingsCard ||
            isComposeEntryCard ||
            isReadInChatCard ||
            isSignatureEditorCard ||
            isTenantPickCard ||
            isAdminPanelCard
              ? Boolean(msg.suppressAvatar)
              : hideAvatar;

          if (isNewMailDigest) {
            return (
              <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
                <div
                  ref={lastRowRefCallback}
                  data-message-id={msg.id}
                  className="flex min-w-0 w-full shrink-0 flex-col gap-[var(--space-150)]"
                >
                  {showTimestamp ? (
                    <TimestampSeparator time={msg.timestamp} className="!my-0" />
                  ) : null}
                  <TaskChatMessageRow
                    hideAvatar={false}
                    collapseVerticallyWithPrevious={false}
                    avatarSrc={conversation.user.avatar}
                    operationSourceLabel={operationSourceLabel}
                  >
                    <div className="flex min-w-0 w-full flex-col gap-[var(--space-150)]">
                      <AssistantChatBubble>{getDemoMailWelcomeGreeting()}</AssistantChatBubble>
                      <ReceivedNewMailCard
                        businessScope={defaultBusinessScope as MailScope}
                        onOpenMail={(id) =>
                          openMail(id, { cardTitle: "收到新邮件", sourceMessageId: msg.id })
                        }
                      />
                      {onMailWelcomeAction ? (
                        <div className="scrollbar-hide flex w-full min-w-0 max-w-full flex-nowrap items-center justify-start gap-[var(--space-150)] overflow-x-auto overflow-y-hidden pb-[var(--space-50)]">
                          <ChatPromptButton
                            type="button"
                            onClick={() => onMailWelcomeAction("personal_inbox")}
                          >
                            我的邮箱
                          </ChatPromptButton>
                          <ChatPromptButton
                            type="button"
                            onClick={() => onMailWelcomeAction("business_inbox")}
                          >
                            业务邮箱
                          </ChatPromptButton>
                          <ChatPromptButton
                            type="button"
                            onClick={() => onMailWelcomeAction("compose")}
                          >
                            写邮件
                          </ChatPromptButton>
                        </div>
                      ) : null}
                    </div>
                  </TaskChatMessageRow>
                </div>
              </OperationSourceNavContext.Provider>
            );
          }

          if (isMailboxCard) {
            const raw = msg.content.slice(MAIL_MAILBOX_MARKER.length);
            const jsonStr = raw.startsWith(":") ? raw.slice(1) : "{}";
            const p = parseMailMailboxMarkerJson(jsonStr);
            const folder: MailFolderId = p.folder;
            const scope: MailScope = p.scope;
            const personalMailboxId = p.personalMailboxId;
            const businessMailboxId = p.businessMailboxId;
            const listFilter: MailListFilter = p.listFilter;
            const cardTitle = p.cardTitle;
            const variant = p.variant;
            if (variant === "business_hub") {
              return (
                <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
                  <div
                    ref={lastRowRefCallback}
                    data-message-id={msg.id}
                    className="flex min-w-0 w-full shrink-0 flex-col gap-[var(--space-150)]"
                  >
                    {showTimestamp ? (
                      <TimestampSeparator time={msg.timestamp} className="!my-0" />
                    ) : null}
                    <TaskChatMessageRow
                      hideAvatar={hideAvatarForRow}
                      collapseVerticallyWithPrevious={false}
                      avatarSrc={conversation.user.avatar}
                      operationSourceLabel={operationSourceLabel}
                    >
                      <BusinessMailHubCard
                        businessScope={defaultBusinessScope as MailScope}
                        onOpenMail={(id) =>
                          openMail(id, {
                            cardTitle: "业务邮箱 · 枢纽",
                            sourceMessageId: msg.id,
                          })
                        }
                        onAppendMailboxPayload={(payload) =>
                          handleAppendMailboxPayload(payload, {
                            cardTitle: "业务邮箱 · 枢纽",
                            sourceMessageId: msg.id,
                          })
                        }
                        onOpenCompose={(p) =>
                          appendComposeEntry(p, {
                            cardTitle: "业务邮箱 · 枢纽",
                            sourceMessageId: msg.id,
                            sourceDetailLabel: "写邮件",
                          })
                        }
                      />
                    </TaskChatMessageRow>
                  </div>
                </OperationSourceNavContext.Provider>
              );
            }
            const rows = filterDemoMailRows(
              folder,
              scope,
              personalMailboxId,
              listFilter,
              businessMailboxId
            );
            const title =
              cardTitle ??
              buildMailboxListCardTitle(
                folder,
                scope,
                personalMailboxId,
                listFilter,
                businessMailboxId
              );
            const subMailboxInboxHints =
              Boolean(personalMailboxId) &&
              folder === "inbox" &&
              listFilter === "all" &&
              scope === "personal";
            const aggregateFolderGrouped =
              folder === "inbox" || folder === "sent" || folder === "drafts";
            const groupByPersonalMailboxes =
              aggregateFolderGrouped &&
              scope === "personal" &&
              !personalMailboxId &&
              !businessMailboxId;
            const groupByBusinessMailboxes =
              aggregateFolderGrouped &&
              scope !== "all" &&
              scope !== "personal" &&
              !businessMailboxId;
            /** 单账号收件箱：写邮件 / 发件箱 / 草稿箱；聚合「我的邮箱·收件箱」：同上但推聚合列表卡 */
            const mailboxActionHints = (() => {
              const opBase = { cardTitle: title, sourceMessageId: msg.id };
              if (subMailboxInboxHints && personalMailboxId) {
                return [
                  {
                    label: "写邮件",
                    onClick: () =>
                      appendComposeEntry(
                        { defaultPersonalMailboxId: personalMailboxId },
                        { ...opBase, sourceDetailLabel: "写邮件" }
                      ),
                  },
                  {
                    label: "草稿箱",
                    onClick: () =>
                      handleAppendMailboxPayload(
                        { folder: "drafts", scope: "personal", personalMailboxId },
                        { ...opBase, sourceDetailLabel: "草稿箱" }
                      ),
                  },
                  {
                    label: "发件箱",
                    onClick: () =>
                      handleAppendMailboxPayload(
                        { folder: "sent", scope: "personal", personalMailboxId },
                        { ...opBase, sourceDetailLabel: "发件箱" }
                      ),
                  },
                ];
              }
              if (
                groupByPersonalMailboxes &&
                folder === "inbox" &&
                listFilter === "all" &&
                scope === "personal"
              ) {
                const firstPm = DEMO_PERSONAL_MAILBOXES[0]?.id;
                return [
                  {
                    label: "写邮件",
                    onClick: () =>
                      appendComposeEntry(
                        firstPm ? { defaultPersonalMailboxId: firstPm } : {},
                        { ...opBase, sourceDetailLabel: "写邮件" }
                      ),
                  },
                  {
                    label: "草稿箱",
                    onClick: () =>
                      handleAppendMailboxPayload(
                        { folder: "drafts", scope: "personal" },
                        { ...opBase, sourceDetailLabel: "草稿箱" }
                      ),
                  },
                  {
                    label: "发件箱",
                    onClick: () =>
                      handleAppendMailboxPayload(
                        { folder: "sent", scope: "personal" },
                        { ...opBase, sourceDetailLabel: "发件箱" }
                      ),
                  },
                ];
              }
              return undefined;
            })();
            return (
              <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
                <div
                  ref={lastRowRefCallback}
                  data-message-id={msg.id}
                  className="flex min-w-0 w-full shrink-0 flex-col gap-[var(--space-150)]"
                >
                  {showTimestamp ? (
                    <TimestampSeparator time={msg.timestamp} className="!my-0" />
                  ) : null}
                  <TaskChatMessageRow
                    hideAvatar={hideAvatarForRow}
                    collapseVerticallyWithPrevious={false}
                    avatarSrc={conversation.user.avatar}
                    operationSourceLabel={operationSourceLabel}
                  >
                    <div className="flex min-w-0 w-full flex-col gap-[var(--space-150)]">
                      <MailMailboxListCard
                        title={title}
                        rows={rows}
                        groupByPersonalMailboxes={groupByPersonalMailboxes}
                        groupByBusinessMailboxes={groupByBusinessMailboxes}
                        businessScope={groupByBusinessMailboxes ? scope : undefined}
                        folder={folder}
                        listFilter={listFilter}
                        onOpenMail={(id) =>
                          openMailboxListRow(folder, id, {
                            cardTitle: title,
                            sourceMessageId: msg.id,
                          })
                        }
                        hiddenDraftIds={folder === "drafts" ? hiddenDraftIds : undefined}
                        onDeleteDraft={folder === "drafts" ? handleDeleteDraft : undefined}
                      />
                      {mailboxActionHints && mailboxActionHints.length > 0 ? (
                        <div className="scrollbar-hide flex w-full min-w-0 max-w-full flex-nowrap items-center justify-start gap-[var(--space-150)] overflow-x-auto overflow-y-hidden pb-[var(--space-50)]">
                          {mailboxActionHints.map((h) => (
                            <ChatPromptButton key={h.label} type="button" onClick={h.onClick}>
                              {h.label}
                            </ChatPromptButton>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </TaskChatMessageRow>
                </div>
              </OperationSourceNavContext.Provider>
            );
          }

          if (isComposeEntryCard) {
            const raw = msg.content.slice(MAIL_COMPOSE_ENTRY_MARKER.length);
            const jsonStr = raw.startsWith(":") ? raw.slice(1) : "{}";
            const composePayload: MailComposeEntryPayload = parseMailComposeMarkerJson(jsonStr);
            return (
              <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
                <div
                  ref={lastRowRefCallback}
                  data-message-id={msg.id}
                  className="flex min-w-0 w-full shrink-0 flex-col gap-[var(--space-150)]"
                >
                  {showTimestamp ? (
                    <TimestampSeparator time={msg.timestamp} className="!my-0" />
                  ) : null}
                  <TaskChatMessageRow
                    hideAvatar={hideAvatarForRow}
                    collapseVerticallyWithPrevious={false}
                    avatarSrc={conversation.user.avatar}
                    operationSourceLabel={operationSourceLabel}
                  >
                    <MailComposeCardV2
                      payload={composePayload}
                      onSentDemo={(summary) =>
                        handleAppendPlainAssistant(summary, {
                          cardTitle: "写邮件",
                          sourceMessageId: msg.id,
                          sourceDetailLabel: "发送结果",
                        })
                      }
                    />
                  </TaskChatMessageRow>
                </div>
              </OperationSourceNavContext.Provider>
            );
          }

          if (isReadInChatCard) {
            const raw = msg.content.slice(MAIL_READ_IN_CHAT_MARKER.length);
            const jsonStr = raw.startsWith(":") ? raw.slice(1) : "{}";
            const parsed = parseMailReadInChatMarkerJson(jsonStr);
            const mail = parsed.mailId ? DEMO_MAILS.find((m) => m.id === parsed.mailId) : undefined;
            const idx = mail ? mailIds.indexOf(mail.id) : -1;
            const canPrevRead = idx > 0;
            const canNextRead = idx >= 0 && idx < mailIds.length - 1;
            const readOp = msg.operationSource;
            return (
              <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
                <div
                  ref={lastRowRefCallback}
                  data-message-id={msg.id}
                  className="flex min-w-0 w-full shrink-0 flex-col gap-[var(--space-150)]"
                >
                  {showTimestamp ? (
                    <TimestampSeparator time={msg.timestamp} className="!my-0" />
                  ) : null}
                  <TaskChatMessageRow
                    hideAvatar={hideAvatarForRow}
                    collapseVerticallyWithPrevious={false}
                    avatarSrc={conversation.user.avatar}
                    operationSourceLabel={operationSourceLabel}
                  >
                    {mail ? (
                      <MailReadInChatCard
                        mail={mail}
                        onComposeAction={(action, row) =>
                          handleInChatReadCompose(action, row, readOp)
                        }
                        onPrev={
                          canPrevRead
                            ? () => {
                                const prevId = mailIds[idx - 1];
                                openMail(prevId, readOp);
                              }
                            : undefined
                        }
                        onNext={
                          canNextRead
                            ? () => {
                                const nextId = mailIds[idx + 1];
                                openMail(nextId, readOp);
                              }
                            : undefined
                        }
                        canPrev={canPrevRead}
                        canNext={canNextRead}
                      />
                    ) : (
                      <div className="rounded-[var(--radius-card)] border border-border bg-bg px-[var(--space-400)] py-[var(--space-300)] text-[length:var(--font-size-sm)] text-text-secondary">
                        无法加载该邮件（演示）
                      </div>
                    )}
                  </TaskChatMessageRow>
                </div>
              </OperationSourceNavContext.Provider>
            );
          }

          if (isSignatureEditorCard) {
            const raw = msg.content.slice(MAIL_SIGNATURE_EDITOR_MARKER.length);
            const jsonStr = raw.startsWith(":") ? raw.slice(1) : "{}";
            const parsed = parseMailSignatureEditorMarkerJson(jsonStr);
            const mbId = parsed.mailboxId;
            const valid =
              mbId &&
              (parsed.mode === "create" ||
                (parsed.mode === "edit" && typeof parsed.signatureId === "string"));
            return (
              <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
                <div
                  ref={lastRowRefCallback}
                  data-message-id={msg.id}
                  className="flex min-w-0 w-full shrink-0 flex-col gap-[var(--space-150)]"
                >
                  {showTimestamp ? (
                    <TimestampSeparator time={msg.timestamp} className="!my-0" />
                  ) : null}
                  <TaskChatMessageRow
                    hideAvatar={hideAvatarForRow}
                    collapseVerticallyWithPrevious={false}
                    avatarSrc={conversation.user.avatar}
                    operationSourceLabel={operationSourceLabel}
                  >
                    {valid ? (
                      <MailSignatureEditorInChatCard
                        messageId={msg.id}
                        mode={parsed.mode}
                        mailboxId={mbId}
                        signatureId={parsed.signatureId}
                      />
                    ) : (
                      <div className="rounded-[var(--radius-card)] border border-border bg-bg px-[var(--space-400)] py-[var(--space-300)] text-[length:var(--font-size-sm)] text-text-secondary">
                        无法打开签名表单（演示）
                      </div>
                    )}
                  </TaskChatMessageRow>
                </div>
              </OperationSourceNavContext.Provider>
            );
          }

          if (isTenantPickCard) {
            const raw = msg.content.slice(MAIL_TENANT_PICK_FOR_ADMIN_MARKER.length);
            const jsonStr = raw.startsWith(":") ? raw.slice(1) : "{}";
            let pending: MailAdminPanelKind = "business";
            try {
              const p = JSON.parse(jsonStr) as { pending?: MailAdminPanelKind };
              if (p.pending === "staff" || p.pending === "business") pending = p.pending;
            } catch {
              /* ignore */
            }
            return (
              <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
                <div
                  ref={lastRowRefCallback}
                  data-message-id={msg.id}
                  className="flex min-w-0 w-full shrink-0 flex-col gap-[var(--space-150)]"
                >
                  {showTimestamp ? (
                    <TimestampSeparator time={msg.timestamp} className="!my-0" />
                  ) : null}
                  <TaskChatMessageRow
                    hideAvatar={hideAvatarForRow}
                    collapseVerticallyWithPrevious={false}
                    avatarSrc={conversation.user.avatar}
                    operationSourceLabel={operationSourceLabel}
                  >
                    <MailTenantPickForAdminCard
                      pending={pending}
                      organizations={mailAdminOrganizations}
                      onPickTenant={(tenantId) =>
                        onPickTenantForMailAdmin?.(tenantId, pending, msg.id, conversation.id)
                      }
                    />
                  </TaskChatMessageRow>
                </div>
              </OperationSourceNavContext.Provider>
            );
          }

          if (isAdminPanelCard) {
            const raw = msg.content.slice(MAIL_MAIL_ADMIN_PANEL_MARKER.length);
            const jsonStr = raw.startsWith(":") ? raw.slice(1) : "{}";
            let kind: MailAdminPanelKind = "business";
            let tenantName = "";
            let tenantId = "";
            try {
              const p = JSON.parse(jsonStr) as {
                kind?: MailAdminPanelKind;
                tenantName?: string;
                tenantId?: string;
              };
              if (p.kind === "staff" || p.kind === "business") kind = p.kind;
              if (typeof p.tenantName === "string") tenantName = p.tenantName;
              if (typeof p.tenantId === "string") tenantId = p.tenantId;
            } catch {
              /* ignore */
            }
            return (
              <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
                <div
                  ref={lastRowRefCallback}
                  data-message-id={msg.id}
                  className="flex min-w-0 w-full shrink-0 flex-col gap-[var(--space-150)]"
                >
                  {showTimestamp ? (
                    <TimestampSeparator time={msg.timestamp} className="!my-0" />
                  ) : null}
                  <TaskChatMessageRow
                    hideAvatar={hideAvatarForRow}
                    collapseVerticallyWithPrevious={false}
                    avatarSrc={conversation.user.avatar}
                    operationSourceLabel={operationSourceLabel}
                  >
                    <MailMailAdminPanelCard
                      kind={kind}
                      tenantName={tenantName || "—"}
                      tenantId={tenantId}
                      userId={conversation.user.id}
                    />
                  </TaskChatMessageRow>
                </div>
              </OperationSourceNavContext.Provider>
            );
          }

          if (isSettingsCard) {
            const raw = msg.content.slice(MAIL_SETTINGS_MARKER.length);
            const jsonStr = raw.startsWith(":") ? raw.slice(1) : "{}";
            const page = parseMailSettingsMarkerJson(jsonStr);
            return (
              <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
                <div
                  ref={lastRowRefCallback}
                  data-message-id={msg.id}
                  className="flex min-w-0 w-full shrink-0 flex-col gap-[var(--space-150)]"
                >
                  {showTimestamp ? (
                    <TimestampSeparator time={msg.timestamp} className="!my-0" />
                  ) : null}
                  <TaskChatMessageRow
                    hideAvatar={hideAvatarForRow}
                    collapseVerticallyWithPrevious={false}
                    avatarSrc={conversation.user.avatar}
                    operationSourceLabel={operationSourceLabel}
                  >
                    <MailSettingsCuiCard
                      page={page}
                      onRequestSignatureEditor={
                        page === "signature"
                          ? (p) =>
                              appendSignatureEditorCard(p, {
                                cardTitle:
                                  msg.operationSource?.cardTitle ?? mailSettingsPageTitle(page),
                                /** 指向本张设置卡消息 id，便于「与来源卡紧挨」时不展示操作来源，回跳仍回到设置卡 */
                                sourceMessageId: msg.id,
                                sourceDetailLabel: msg.operationSource?.sourceDetailLabel,
                                sourceConversationId:
                                  msg.operationSource?.sourceConversationId ?? conversation.id,
                              })
                          : undefined
                      }
                    />
                  </TaskChatMessageRow>
                </div>
              </OperationSourceNavContext.Provider>
            );
          }

          return (
            <OperationSourceNavContext.Provider key={msg.id} value={sourceNavValue}>
              <div
                ref={lastRowRefCallback}
                data-message-id={msg.id}
                className={cn(
                  "flex flex-col gap-[var(--space-150)] w-full min-w-0 shrink-0",
                  hideAvatar ? "-mt-[var(--space-600)]" : ""
                )}
              >
                {showTimestamp ? (
                  <TimestampSeparator time={msg.timestamp} className="!my-0" />
                ) : null}
                {isMe ? (
                  <ChatMessageBubble
                    msg={msg}
                    isMe={isMe}
                    userAvatar={currentUser.avatar}
                    aiAvatar={conversation.user.avatar}
                    userName={isMe ? "Me" : conversation.user.name}
                    isSpecialComponent={false}
                    hideAvatar={hideAvatar}
                  />
                ) : (
                  <TaskChatMessageRow
                    hideAvatar={hideAvatar}
                    collapseVerticallyWithPrevious={true}
                    avatarSrc={conversation.user.avatar}
                    operationSourceLabel={operationSourceLabel}
                  >
                    <ChatMessageBubble
                      msg={msg}
                      isMe={false}
                      userAvatar={currentUser.avatar}
                      aiAvatar={conversation.user.avatar}
                      userName={conversation.user.name}
                      isSpecialComponent={false}
                      hideAvatar
                      embeddedInAssistantRow
                    />
                  </TaskChatMessageRow>
                )}
              </div>
            </OperationSourceNavContext.Provider>
          );
          });

          if (!newRoundSlotWrapConfig) return messageElements;
          if (newRoundSlotWrapConfig.startMessageIndex >= messageElements.length) return messageElements;
          const head = messageElements.slice(0, newRoundSlotWrapConfig.startMessageIndex);
          const tail = messageElements.slice(newRoundSlotWrapConfig.startMessageIndex);
          return [
            ...head,
            <NewRoundSlotShell
              key="mail-new-round-conversation-slot"
              heightPx={newRoundSlotWrapConfig.slotHeightPx}
              messageGapClassName={newRoundSlotWrapConfig.messageGapClassName}
              shellRef={newRoundSlotWrapConfig.shellRef}
              onContentExceedsSlot={newRoundSlotWrapConfig.onOverflow}
              revealChildrenAfterMs={newRoundSlotWrapConfig.revealChildrenAfterMs ?? 0}
            >
              {tail}
            </NewRoundSlotShell>,
          ];
        })()}
      </div>
      {!mailReadInChat ? (
        <EmailReadDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          mail={selected}
          onPrev={goPrevMail}
          onNext={goNextMail}
          canPrev={canPrevMail}
          canNext={canNextMail}
          onComposeAction={handleReadDrawerCompose}
        />
      ) : null}
      </>
    </MailSignatureDemoStateProvider>
  );
}
