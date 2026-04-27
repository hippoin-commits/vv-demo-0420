import * as React from "react";
import {
  Lock,
  Mic,
  Smile,
  ImageIcon,
  Paperclip,
  Plus,
  Maximize2,
  Video,
  Phone,
  Search,
  UserPlus,
  MoreHorizontal,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "../ui/utils";
import { AssistantChatBubble } from "../chat/ChatWelcome";
import { ChatNavBar } from "../chat/ChatNavBar";
import { ChatSender } from "../chat/ChatSender";
import {
  Invite0421DrawerAssistantRow,
  INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME,
} from "./Invite0421DrawerAssistantRow";
import { vvAssistantChatAvatar } from "../vv-app-shell/vv-ai-frame-assets";
import {
  Invite0421OrgEmployeeBasicInfoForm,
  Invite0421OrgEmployeeOnboardingIntroText,
  INVITE0421_ORG_EMPLOYEE_SUBMIT_SUCCESS_TEXT,
} from "./Invite0421OrgEmployeeOnboardingPanel";
import { INVITE0421_DEMO_INVITER, INVITE0421_ORG_COMPANY_NAME } from "../../constants/invite0421InvitedTodo";
import { CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME } from "../../constants/chatBusinessEntryDrawer";
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
} from "../chat/chatMessageLayout";

const TABS = ["全部", "@我", "未读", "单聊", "群聊", "工作"] as const;

type SessionRow = {
  id: string;
  title: string;
  subtitle: string;
  tag?: "组织";
  avatarLetter?: string;
  unread?: boolean;
  time?: string;
};

const INITIAL_SESSIONS: SessionRow[] = [
  {
    id: "zhang-san",
    title: "张三",
    subtitle: "欢迎加入「金牌舞蹈班」",
    time: "13:41",
  },
  {
    id: "palogino",
    title: "PaloGino 环球科技集团",
    subtitle: "张三：我和 'PG北京科技有限公司' 的小伙伴都…",
    tag: "组织",
    time: "12:05",
  },
  {
    id: "liu-edu",
    title: "刘小宝教育空间",
    subtitle: "刘小宝 已加入 「12345」",
    time: "昨天",
  },
  {
    id: "pg-bj",
    title: "PG北京总部",
    subtitle: "你加入了群聊",
    tag: "组织",
    time: "周一",
  },
  {
    id: "xw",
    title: "小微消息",
    subtitle: "新手入门指南",
    time: "周一",
  },
];

/** 主会话区水平留白：靠左对齐，避免两侧大块留白 */
const IM_THREAD_PAD_X = "pl-[length:var(--space-400)] pr-[length:var(--space-400)]";
/** 通知卡最大宽度 400px = 32×12 + 16 */
const IM_CARD_MAX_W = "max-w-[length:calc(var(--space-800)*12+var(--space-400))]";
/** 左侧 Tab 条与右侧会话顶栏同高，便于上下边线对齐 */
const IM_DUAL_HEADER_MIN_H =
  "min-h-[length:calc(var(--space-900)+var(--space-600))]";
const IM_DUAL_HEADER_ROW = cn(
  "flex shrink-0 items-center border-b border-border",
  IM_DUAL_HEADER_MIN_H,
);

function SessionListItem({
  row,
  selected,
  onSelect,
}: {
  row: SessionRow;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full min-w-0 gap-[length:var(--space-250)] rounded-[length:var(--radius-200)] px-[length:var(--space-250)] py-[length:var(--space-300)] text-left transition-colors",
        selected
          ? "bg-[var(--black-alpha-11)] shadow-xs"
          : "hover:bg-[var(--black-alpha-06)]",
      )}
    >
      <Avatar className="size-[length:var(--space-900)] shrink-0 rounded-[length:var(--radius-base)]">
        <AvatarImage src="" alt="" />
        <AvatarFallback className="rounded-[length:var(--radius-base)] text-[length:var(--font-size-xs)]">
          {row.avatarLetter ?? row.title.slice(0, 1)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-[length:var(--space-200)]">
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-[length:var(--space-100)]">
              <span className="truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                {row.title}
              </span>
              {row.tag ? (
                <span className="shrink-0 rounded-[length:var(--radius-100)] bg-[var(--tag-brand-bg)] px-[length:var(--space-100)] py-0 text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] leading-tight text-[var(--tag-brand-fg)]">
                  {row.tag}
                </span>
              ) : null}
            </div>
            <p className="mt-[length:var(--space-100)] line-clamp-2 text-[length:var(--font-size-xs)] leading-snug text-text-secondary">
              {row.subtitle}
            </p>
          </div>
          {row.time ? (
            <span className="shrink-0 pt-[length:var(--space-50)] text-[length:var(--font-size-xs)] text-text-tertiary">
              {row.time}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  );
}

function ImTimestamp({ label }: { label: string }) {
  return (
    <div className="flex justify-center py-[length:var(--space-300)]">
      <span className="text-[length:var(--font-size-xs)] text-text-tertiary">{label}</span>
    </div>
  );
}

function ImSystemLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center px-[length:var(--space-400)] pb-[length:var(--space-300)]">
      <p className="max-w-[length:calc(var(--space-800)*15+var(--space-400))] text-center text-[length:var(--font-size-xs)] leading-relaxed text-text-secondary">
        {children}
      </p>
    </div>
  );
}

function ImPeerRow({ avatar, children }: { avatar: React.ReactNode; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "flex w-full items-start justify-start gap-[length:var(--space-200)] pb-[length:var(--space-400)]",
        IM_THREAD_PAD_X,
      )}
    >
      <div className="shrink-0 pt-[length:var(--space-50)]">{avatar}</div>
      <div className={cn("min-w-0 w-full", IM_CARD_MAX_W)}>{children}</div>
    </div>
  );
}

/** 员工邀请卡片：整卡单一热区；点击后灰底；同意后底栏「已加入」（IM 侧非 AI 气泡） */
function EmployeeInviteChatCard({
  agreed,
  pressed,
  onActivate,
}: {
  agreed: boolean;
  pressed: boolean;
  onActivate: () => void;
}) {
  const body = (
    <>
      <div className="px-[length:var(--space-400)] pt-[length:var(--space-350)] pb-[length:var(--space-300)]">
        <div className="flex items-start gap-[length:var(--space-200)]">
          <span
            className="mt-[length:var(--space-50)] h-[length:var(--icon-sm)] w-[var(--stroke-lg)] shrink-0 rounded-full bg-primary/35"
            aria-hidden
          />
          <div className="min-w-0 flex-1 select-none">
            <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-snug text-text-secondary">
              员工邀请
            </p>
            <p className="mt-[length:var(--space-100)] text-[length:var(--font-size-xs)] leading-snug text-text-tertiary">
              {INVITE0421_ORG_COMPANY_NAME}
            </p>
            <p className="mt-[length:var(--space-300)] text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] leading-snug text-text">
              {INVITE0421_DEMO_INVITER}邀请您加入{INVITE0421_ORG_COMPANY_NAME}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-[length:var(--space-400)] py-[length:var(--space-300)]">
        {agreed ? (
          <p className="pointer-events-none text-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text-secondary">
            已加入
          </p>
        ) : (
          <p className="pointer-events-none text-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary">
            同意加入
          </p>
        )}
      </div>
    </>
  );

  if (agreed) {
    return (
      <div className="w-full overflow-hidden rounded-[length:var(--radius-200)] border border-border bg-bg text-left shadow-xs">
        {body}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onActivate}
      className={cn(
        "w-full cursor-pointer overflow-hidden rounded-[length:var(--radius-200)] border text-left shadow-xs transition-[background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        "border-border",
        pressed
          ? "bg-[var(--black-alpha-09)] hover:bg-[var(--black-alpha-09)]"
          : "bg-bg hover:bg-[var(--black-alpha-06)]",
      )}
    >
      {body}
    </button>
  );
}

function MemberWelcomeCard() {
  return (
    <div className="w-full overflow-hidden rounded-[length:var(--radius-200)] border border-border bg-bg text-left shadow-xs">
      <div className="px-[length:var(--space-400)] pt-[length:var(--space-350)] pb-[length:var(--space-300)]">
        <div className="flex items-start gap-[length:var(--space-200)]">
          <span
            className="mt-[length:var(--space-50)] h-[length:var(--icon-sm)] w-[var(--stroke-lg)] shrink-0 rounded-full bg-primary/35"
            aria-hidden
          />
          <div className="min-w-0 flex-1 select-none">
            <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-snug text-text-secondary">
              成员管理
            </p>
            <p className="mt-[length:var(--space-100)] text-[length:var(--font-size-xs)] leading-snug text-text-tertiary">
              金牌舞蹈班
            </p>
            <p className="mt-[length:var(--space-300)] text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] leading-snug text-text">
              欢迎加入「金牌舞蹈班」
            </p>
            <p className="mt-[length:var(--space-250)] text-[length:var(--font-size-xs)] leading-relaxed text-text-secondary">
              你已受邀成为「金牌舞蹈班」的教师，可在此创建课程，处理教学任务和管理学生
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-[length:var(--space-400)] py-[length:var(--space-300)]">
        <button
          type="button"
          className="flex h-[length:var(--space-900)] w-full cursor-pointer items-center justify-center rounded-[length:var(--radius-150)] border border-border bg-bg text-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text transition-colors hover:bg-[var(--black-alpha-06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          进入教育空间
        </button>
      </div>
    </div>
  );
}

function ImEmptyWelcome() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[length:var(--space-500)] px-6 py-10">
      <div className="relative h-40 w-56 shrink-0 rounded-[length:var(--radius-card)] bg-gradient-to-b from-[var(--blue-3)]/20 to-transparent" aria-hidden />
      <div className="text-center">
        <h1 className="text-[length:var(--font-size-xl)] font-[var(--font-weight-semibold)] text-text">
          欢迎使用 VV
        </h1>
        <p className="mt-[length:var(--space-200)] text-[length:var(--font-size-sm)] text-text-secondary">
          您的对话和通话都是私密的
        </p>
      </div>
    </div>
  );
}


export function Invite0421MessageModule({
  hasOrganization,
  onJoinOrganizationComplete,
}: {
  hasOrganization: boolean;
  onJoinOrganizationComplete: () => void;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerInputValue, setDrawerInputValue] = React.useState("");
  const [inviteAgreed, setInviteAgreed] = React.useState(false);
  const [inviteCardPressed, setInviteCardPressed] = React.useState(false);
  const [formSubmitted, setFormSubmitted] = React.useState(false);
  const [showWelcomeCard, setShowWelcomeCard] = React.useState(false);

  /** 主 AI 侧先完成入组时，消息页同步为已同意 + 欢迎卡 */
  React.useEffect(() => {
    if (!hasOrganization) return;
    setSelectedId("zhang-san");
    setInviteAgreed(true);
    setInviteCardPressed(true);
    setFormSubmitted(true);
    setShowWelcomeCard(true);
  }, [hasOrganization]);

  const openZhangSanDm = selectedId === "zhang-san";

  const handleDrawerSubmit = (_payload: { name: string; gender: string }) => {
    setFormSubmitted(true);
    setInviteAgreed(true);
    setShowWelcomeCard(true);
    onJoinOrganizationComplete();
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 bg-bg-secondary" data-invite0421-im>
      {/* 会话列表 */}
      <div className="flex w-[min(100%,320px)] shrink-0 flex-col border-r border-border bg-bg">
        <div className={cn(IM_DUAL_HEADER_ROW, "gap-0 px-[length:var(--space-200)] scrollbar-hide")}>
          <div className="flex min-h-0 min-w-0 flex-1 items-center gap-0 overflow-x-auto">
            {TABS.map((t) => {
              const active = t === "全部";
              return (
                <button
                  key={t}
                  type="button"
                  className={cn(
                    "relative flex h-full shrink-0 items-center px-[length:var(--space-300)] py-0 text-[length:var(--font-size-xs)] transition-colors",
                    active
                      ? "font-[var(--font-weight-medium)] text-primary"
                      : "text-text-secondary hover:text-text",
                  )}
                >
                  {t}
                  {active ? (
                    <span className="absolute inset-x-[length:var(--space-250)] bottom-0 h-[var(--stroke-lg)] rounded-full bg-primary" />
                  ) : null}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="shrink-0 rounded-[length:var(--radius-100)] p-[length:var(--space-100)] text-text-tertiary hover:bg-[var(--black-alpha-06)] hover:text-text"
            aria-label="更多"
          >
            <MoreHorizontal className="size-[length:var(--icon-sm)]" aria-hidden />
          </button>
        </div>
        <div className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-1">
          {INITIAL_SESSIONS.map((row) => (
            <SessionListItem
              key={row.id}
              row={row}
              selected={selectedId === row.id}
              onSelect={() => setSelectedId(row.id)}
            />
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-1 border-t border-border px-3 py-2 text-[10px] text-text-tertiary">
          <Lock className="size-3 shrink-0" aria-hidden />
          <span className="leading-tight">您的个人消息已进行 端对端加密</span>
        </div>
      </div>

      {/* 主区 */}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-bg-secondary">
        {!selectedId ? (
          <ImEmptyWelcome />
        ) : openZhangSanDm ? (
          <div className="flex min-h-0 flex-1 flex-col bg-bg">
            <header
              className={cn(
                IM_DUAL_HEADER_ROW,
                "justify-between gap-[length:var(--space-300)] px-[length:var(--space-400)]",
              )}
            >
              <div className="flex min-h-0 min-w-0 flex-1 items-center gap-[length:var(--space-250)]">
                <Avatar className="size-[length:var(--space-900)] shrink-0 rounded-[length:var(--radius-base)]">
                  <AvatarFallback className="text-[length:var(--font-size-xs)]">张</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="truncate text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-text">
                    张三
                  </h2>
                  <p className="mt-[length:var(--space-50)] truncate text-[length:var(--font-size-xs)] text-text-secondary">
                    群主 | 总裁办公室 - PG科技 团
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-[length:var(--space-100)] text-text-tertiary">
                <button
                  type="button"
                  className="rounded-[length:var(--radius-100)] p-[length:var(--space-100)] hover:bg-[var(--black-alpha-06)] hover:text-text"
                  aria-label="视频通话"
                >
                  <Video className="size-[length:var(--icon-sm)]" />
                </button>
                <button
                  type="button"
                  className="rounded-[length:var(--radius-100)] p-[length:var(--space-100)] hover:bg-[var(--black-alpha-06)] hover:text-text"
                  aria-label="语音通话"
                >
                  <Phone className="size-[length:var(--icon-sm)]" />
                </button>
                <button
                  type="button"
                  className="rounded-[length:var(--radius-100)] p-[length:var(--space-100)] hover:bg-[var(--black-alpha-06)] hover:text-text"
                  aria-label="搜索"
                >
                  <Search className="size-[length:var(--icon-sm)]" />
                </button>
                <button
                  type="button"
                  className="rounded-[length:var(--radius-100)] p-[length:var(--space-100)] hover:bg-[var(--black-alpha-06)] hover:text-text"
                  aria-label="添加成员"
                >
                  <UserPlus className="size-[length:var(--icon-sm)]" />
                </button>
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ImTimestamp label="13:36" />
              <ImPeerRow
                avatar={
                  <Avatar className="size-[length:var(--space-900)] rounded-[length:var(--radius-base)]">
                    <AvatarFallback className="text-[length:var(--font-size-xs)]">张</AvatarFallback>
                  </Avatar>
                }
              >
                <EmployeeInviteChatCard
                  agreed={inviteAgreed}
                  pressed={inviteCardPressed}
                  onActivate={() => {
                    if (inviteAgreed) return;
                    setInviteCardPressed(true);
                    setDrawerOpen(true);
                  }}
                />
              </ImPeerRow>
              {formSubmitted ? (
                <>
                  <ImTimestamp label="13:38" />
                  <ImSystemLine>
                    您已同意张三的{" "}
                    <button
                      type="button"
                      className="inline border-0 bg-transparent p-0 align-baseline text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-relaxed text-primary underline-offset-2 hover:underline"
                    >
                      员工邀请
                    </button>
                  </ImSystemLine>
                  <ImSystemLine>
                    管理员已同意您的{" "}
                    <button
                      type="button"
                      className="inline border-0 bg-transparent p-0 align-baseline text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-relaxed text-primary underline-offset-2 hover:underline"
                    >
                      员工邀请
                    </button>
                  </ImSystemLine>
                </>
              ) : null}
              {showWelcomeCard ? (
                <>
                  <ImTimestamp label="13:40" />
                  <ImPeerRow
                    avatar={
                      <Avatar className="size-[length:var(--space-900)] rounded-[length:var(--radius-base)]">
                        <AvatarFallback className="text-[length:var(--font-size-xs)]">管</AvatarFallback>
                      </Avatar>
                    }
                  >
                    <MemberWelcomeCard />
                  </ImPeerRow>
                </>
              ) : null}
            </div>
            <div className="shrink-0 bg-bg px-[length:var(--space-400)] pb-[length:var(--space-400)] pt-[length:var(--space-300)]">
              <div className="flex min-h-[length:var(--space-1200)] flex-col gap-[length:var(--space-200)] rounded-[length:var(--radius-300)] border border-border bg-bg px-[length:var(--space-400)] py-[length:var(--space-300)] shadow-xs">
                <input
                  type="text"
                  readOnly
                  placeholder="请输入消息，Shift+Enter换行，Enter发送"
                  className="min-h-[length:var(--space-900)] w-full bg-transparent text-[length:var(--font-size-sm)] outline-none placeholder:text-text-tertiary"
                />
                <div className="flex items-center justify-end gap-[length:var(--space-200)] text-text-tertiary">
                  <Mic className="size-[length:var(--icon-sm)] shrink-0" aria-hidden />
                  <Smile className="size-[length:var(--icon-sm)] shrink-0" aria-hidden />
                  <ImageIcon className="size-[length:var(--icon-sm)] shrink-0" aria-hidden />
                  <Paperclip className="size-[length:var(--icon-sm)] shrink-0" aria-hidden />
                  <Plus className="size-[length:var(--icon-sm)] shrink-0" aria-hidden />
                  <Maximize2 className="size-[length:var(--icon-sm)] shrink-0" aria-hidden />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center text-[length:var(--font-size-sm)] text-text-secondary">
            请选择会话查看内容
          </div>
        )}
      </div>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="right" className={CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME}>
          <div className="sr-only">
            <SheetTitle>员工邀请</SheetTitle>
            <SheetDescription>完善信息以加入组织</SheetDescription>
          </div>
          <div className="flex min-h-0 flex-1 flex-col w-full overflow-hidden bg-cui-bg">
            <ChatNavBar
              title="员工邀请"
              titleOnlyChrome
              showClose
              onClose={() => setDrawerOpen(false)}
            />
            <ScrollArea className="relative z-10 min-h-0 flex-1">
              <div
                className={cn(
                  "mx-auto flex min-h-full w-full max-w-[1920px] flex-col px-[max(20px,var(--cui-padding-max))] py-[var(--space-500)]",
                  INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME,
                )}
              >
                <Invite0421DrawerAssistantRow
                  showAvatar
                  avatar={
                    <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                      <AvatarImage
                        src={vvAssistantChatAvatar}
                        alt=""
                        className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME}
                      />
                      <AvatarFallback className="text-[length:var(--font-size-xs)]">AI</AvatarFallback>
                    </Avatar>
                  }
                >
                  <AssistantChatBubble>{Invite0421OrgEmployeeOnboardingIntroText()}</AssistantChatBubble>
                </Invite0421DrawerAssistantRow>
                <Invite0421DrawerAssistantRow showAvatar={false}>
                  <Invite0421OrgEmployeeBasicInfoForm frozen={formSubmitted} onSubmit={handleDrawerSubmit} />
                </Invite0421DrawerAssistantRow>
                {formSubmitted ? (
                  /** 新一轮助手回合：与上组竖向净距 24px（父级 `gap-[6px]` + 本段 `mt-[calc(24px-6px)]`） */
                  <div className="mt-[calc(24px-6px)] w-full min-w-0">
                    <Invite0421DrawerAssistantRow
                      showAvatar
                      avatar={
                        <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                          <AvatarImage
                            src={vvAssistantChatAvatar}
                            alt=""
                            className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME}
                          />
                          <AvatarFallback className="text-[length:var(--font-size-xs)]">AI</AvatarFallback>
                        </Avatar>
                      }
                    >
                      <AssistantChatBubble>{INVITE0421_ORG_EMPLOYEE_SUBMIT_SUCCESS_TEXT}</AssistantChatBubble>
                    </Invite0421DrawerAssistantRow>
                  </div>
                ) : null}
              </div>
            </ScrollArea>
            <div className="relative z-20 w-full flex-none px-[max(20px,var(--cui-padding-max))] pb-[var(--space-400)] pt-0">
              <ChatSender
                inputValue={drawerInputValue}
                setInputValue={setDrawerInputValue}
                handleSendMessage={() => {}}
                handleKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                  }
                }}
                placeholder="我可以帮您做什么？"
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
