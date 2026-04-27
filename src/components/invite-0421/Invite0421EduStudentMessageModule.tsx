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
import { ChatNavBar } from "../chat/ChatNavBar";
import { ChatSender } from "../chat/ChatSender";
import {
  Invite0421EduStudentInviteFlowBody,
  INVITE0421_EDU_STUDENT_ORG,
  INVITE0421_EDU_STUDENT_CHILD,
  INVITE0421_EDU_SPACE_NAV,
  type Invite0421EduInviteFlowState,
} from "./Invite0421EduStudentInviteFlowBody";
import { CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME } from "../../constants/chatBusinessEntryDrawer";

/** 抽屉内「轮」与轮之间竖向间距（区别于同轮内 6px） */
const EDU_DRAWER_ROUND_STACK_GAP = "gap-[length:var(--space-500)]";

const TABS = ["全部", "@我", "未读", "单聊", "群聊", "工作"] as const;

const IM_THREAD_PAD_X = "pl-[length:var(--space-400)] pr-[length:var(--space-400)]";
const IM_CARD_MAX_W = "max-w-[length:calc(var(--space-800)*12+var(--space-400))]";
const IM_DUAL_HEADER_MIN_H =
  "min-h-[length:calc(var(--space-900)+var(--space-600))]";
const IM_DUAL_HEADER_ROW = cn(
  "flex shrink-0 items-center border-b border-border",
  IM_DUAL_HEADER_MIN_H,
);

type SessionRow = {
  id: string;
  title: string;
  subtitle: string;
  tag?: "组织";
  avatarLetter?: string;
  time?: string;
};

const SESSIONS: SessionRow[] = [
  {
    id: "xiaoce-student-invite",
    title: INVITE0421_EDU_STUDENT_ORG,
    subtitle: `邀请${INVITE0421_EDU_STUDENT_CHILD}成为${INVITE0421_EDU_STUDENT_ORG}的学生`,
    tag: "组织",
    time: "14:02",
  },
  {
    id: "zhang-san",
    title: "张三",
    subtitle: "欢迎加入「金牌舞蹈班」",
    time: "13:41",
  },
  { id: "xw", title: "小微消息", subtitle: "新手入门指南", time: "周一" },
];

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

function ImEmptyWelcome() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[length:var(--space-500)] px-6 py-10">
      <div
        className="relative h-40 w-56 shrink-0 rounded-[length:var(--radius-card)] bg-gradient-to-b from-[var(--blue-3)]/20 to-transparent"
        aria-hidden
      />
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

const SYSTEM_LINK_BTN =
  "inline border-0 bg-transparent p-0 align-baseline text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] leading-relaxed text-primary underline-offset-2 hover:underline";

/** IM 侧学生邀请卡：与「员工邀请」卡同结构；点击打开右侧业务抽屉 */
function StudentOrgInviteChatCard({
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
              学生邀请
            </p>
            <p className="mt-[length:var(--space-100)] text-[length:var(--font-size-xs)] leading-snug text-text-tertiary">
              {INVITE0421_EDU_STUDENT_ORG}
            </p>
            <p className="mt-[length:var(--space-300)] text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] leading-snug text-text">
              {INVITE0421_EDU_STUDENT_ORG} 邀请{INVITE0421_EDU_STUDENT_CHILD}加入成为学生
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
            加入
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

function EduStudentFamilyWelcomeCard({ onEnterEducationSpace }: { onEnterEducationSpace: () => void }) {
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
              教育空间
            </p>
            <p className="mt-[length:var(--space-100)] text-[length:var(--font-size-xs)] leading-snug text-text-tertiary">
              {INVITE0421_EDU_SPACE_NAV}
            </p>
            <p className="mt-[length:var(--space-300)] text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] leading-snug text-text">
              欢迎加入「{INVITE0421_EDU_SPACE_NAV}」
            </p>
            <p className="mt-[length:var(--space-250)] text-[length:var(--font-size-xs)] leading-relaxed text-text-secondary">
              你已与「{INVITE0421_EDU_STUDENT_ORG}」完成绑定，可在此查看课程、作业与成长记录。
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-[length:var(--space-400)] py-[length:var(--space-300)]">
        <button
          type="button"
          onClick={onEnterEducationSpace}
          className="flex h-[length:var(--space-900)] w-full cursor-pointer items-center justify-center rounded-[length:var(--radius-150)] border border-border bg-bg text-center text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text transition-colors hover:bg-[var(--black-alpha-06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          进入教育空间
        </button>
      </div>
    </div>
  );
}


export function Invite0421EduStudentMessageModule({
  onFlowComplete,
  inviteEduFlowState,
  onInviteEduFlowPatch,
  eduStudentFlowCompleteFromMainAi,
}: {
  onFlowComplete: () => void;
  inviteEduFlowState: Invite0421EduInviteFlowState;
  onInviteEduFlowPatch: (p: Partial<Invite0421EduInviteFlowState>) => void;
  /** 主 AI 内完成「进入教育空间」后，同步 IM 侧已加入与欢迎卡 */
  eduStudentFlowCompleteFromMainAi: boolean;
}) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerInputValue, setDrawerInputValue] = React.useState("");
  const [inviteCardPressed, setInviteCardPressed] = React.useState(false);
  const syncedFamilyFromMainRef = React.useRef(false);

  const openInvite = selectedId === "xiaoce-student-invite";

  React.useEffect(() => {
    if (!eduStudentFlowCompleteFromMainAi || syncedFamilyFromMainRef.current) return;
    syncedFamilyFromMainRef.current = true;
    onInviteEduFlowPatch({
      joined: true,
      submitted: true,
      showForm: true,
      imWelcomeVisible: true,
    });
    setInviteCardPressed(true);
  }, [eduStudentFlowCompleteFromMainAi, onInviteEduFlowPatch]);

  const handleEnterEducationSpace = () => {
    setDrawerOpen(false);
    setInviteCardPressed(true);
    onFlowComplete();
  };

  return (
    <div className="flex min-h-0 min-w-0 flex-1 bg-bg-secondary" data-invite0421-edu-student-im>
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
          {SESSIONS.map((row) => (
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

      <div className="flex min-h-0 min-w-0 flex-1 flex-col bg-bg-secondary">
        {!selectedId ? (
          <ImEmptyWelcome />
        ) : openInvite ? (
          <div className="flex min-h-0 flex-1 flex-col bg-bg">
            <header
              className={cn(
                IM_DUAL_HEADER_ROW,
                "justify-between gap-[length:var(--space-300)] px-[length:var(--space-400)]",
              )}
            >
              <div className="flex min-h-0 min-w-0 flex-1 items-center gap-[length:var(--space-250)]">
                <Avatar className="size-[length:var(--space-900)] shrink-0 rounded-[length:var(--radius-base)]">
                  <AvatarFallback className="text-[length:var(--font-size-xs)]">小</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="truncate text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] text-text">
                    {INVITE0421_EDU_STUDENT_ORG}
                  </h2>
                  <p className="mt-[length:var(--space-50)] truncate text-[length:var(--font-size-xs)] text-text-secondary">
                    官方账号 · 学生服务
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-[length:var(--space-100)] text-text-tertiary">
                <button
                  type="button"
                  className="rounded-[length:var(--radius-100)] p-[length:var(--space-100)] hover:bg-[var(--black-alpha-06)] hover:text-text"
                  aria-label="视频通话"
                >
                  <Video className="size-[length:var(--icon-sm)]" aria-hidden />
                </button>
                <button
                  type="button"
                  className="rounded-[length:var(--radius-100)] p-[length:var(--space-100)] hover:bg-[var(--black-alpha-06)] hover:text-text"
                  aria-label="语音通话"
                >
                  <Phone className="size-[length:var(--icon-sm)]" aria-hidden />
                </button>
                <button
                  type="button"
                  className="rounded-[length:var(--radius-100)] p-[length:var(--space-100)] hover:bg-[var(--black-alpha-06)] hover:text-text"
                  aria-label="搜索"
                >
                  <Search className="size-[length:var(--icon-sm)]" aria-hidden />
                </button>
                <button
                  type="button"
                  className="rounded-[length:var(--radius-100)] p-[length:var(--space-100)] hover:bg-[var(--black-alpha-06)] hover:text-text"
                  aria-label="添加成员"
                >
                  <UserPlus className="size-[length:var(--icon-sm)]" aria-hidden />
                </button>
              </div>
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">
              <ImTimestamp label="14:00" />
              <ImPeerRow
                avatar={
                  <Avatar className="size-[length:var(--space-900)] rounded-[length:var(--radius-base)]">
                    <AvatarFallback className="text-[length:var(--font-size-xs)]">小</AvatarFallback>
                  </Avatar>
                }
              >
                <StudentOrgInviteChatCard
                  agreed={inviteEduFlowState.joined}
                  pressed={inviteCardPressed}
                  onActivate={() => {
                    if (inviteEduFlowState.joined) return;
                    setInviteCardPressed(true);
                    setDrawerOpen(true);
                  }}
                />
              </ImPeerRow>
              {inviteEduFlowState.joined ? (
                <>
                  <ImTimestamp label="14:06" />
                  <ImSystemLine>
                    您已同意「{INVITE0421_EDU_STUDENT_ORG}」的{" "}
                    <button type="button" className={SYSTEM_LINK_BTN}>
                      学生邀请
                    </button>
                  </ImSystemLine>
                  <ImSystemLine>
                    管理员已同意您的{" "}
                    <button type="button" className={SYSTEM_LINK_BTN}>
                      学生邀请
                    </button>
                  </ImSystemLine>
                </>
              ) : null}
              {inviteEduFlowState.imWelcomeVisible ? (
                <>
                  <ImTimestamp label="14:08" />
                  <ImPeerRow
                    avatar={
                      <Avatar className="size-[length:var(--space-900)] rounded-[length:var(--radius-base)]">
                        <AvatarFallback className="text-[length:var(--font-size-xs)]">管</AvatarFallback>
                      </Avatar>
                    }
                  >
                    <EduStudentFamilyWelcomeCard onEnterEducationSpace={handleEnterEducationSpace} />
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
            <SheetTitle>邀请成员</SheetTitle>
            <SheetDescription>完成学生邀请与家庭空间创建</SheetDescription>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 w-full flex-col overflow-hidden bg-cui-bg">
            <ChatNavBar
              title="邀请成员"
              titleOnlyChrome
              showClose
              onClose={() => setDrawerOpen(false)}
            />
            <ScrollArea className="relative z-10 min-h-0 flex-1">
              <div
                className={cn(
                  "mx-auto flex min-h-full w-full max-w-[1920px] flex-col px-[max(20px,var(--cui-padding-max))] py-[var(--space-500)]",
                  EDU_DRAWER_ROUND_STACK_GAP,
                )}
              >
                <Invite0421EduStudentInviteFlowBody
                  state={inviteEduFlowState}
                  onPatch={onInviteEduFlowPatch}
                  onEnterSpace={handleEnterEducationSpace}
                  roundStackGapClassName={EDU_DRAWER_ROUND_STACK_GAP}
                />
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
