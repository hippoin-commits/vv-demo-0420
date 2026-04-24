import * as React from "react";
import { Copy, Eye, EyeOff, Pencil } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "../ui/utils";
import {
  Invite0421DrawerAssistantRow,
  INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME,
} from "./Invite0421DrawerAssistantRow";
import { AssistantChatBubble } from "../chat/ChatWelcome";
import { ChatPromptButton } from "../chat/ChatPromptButton";
import { GenericCard } from "../main-ai/GenericCard";
import { ChatTaskFormFooter } from "../main-ai/task-detail/TaskChatCards";
import { toast } from "sonner";
import { vvAssistantChatAvatar } from "../vv-app-shell/vv-ai-frame-assets";
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
  cnChatAssistantMessageRow,
} from "../chat/chatMessageLayout";

export const INVITE0421_EDU_STUDENT_ORG = "小测教育机构";
export const INVITE0421_EDU_STUDENT_CHILD = "张小宝";
export const INVITE0421_EDU_SPACE_NAME_FIELD = "张小宝教育空间";
export const INVITE0421_EDU_SPACE_CREATED_LABEL = "张小宝教育空间";
export const INVITE0421_EDU_SPACE_NAV = "张小宝家庭教育";
const WEIWEI_ID = "zhangxiaobao8430";

const INVITE_TASK_STYLE_FIELD_CLASS =
  "w-full h-[var(--space-900)] px-[var(--space-300)] rounded-[var(--radius-input)] border border-border bg-bg text-[length:var(--font-size-sm)] text-text";

/** 主 AI 内每一轮助手回复：独立一行头像 + 内容（与 SimpleOrg0421 等 CUI 一致） */
function MainAiInviteAssistantRound({
  assistantAvatarSrc,
  mergedWithPrevious,
  children,
}: {
  assistantAvatarSrc: string;
  mergedWithPrevious: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cnChatAssistantMessageRow({ mergedWithPrevious })}>
      <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
        <AvatarImage src={assistantAvatarSrc} alt="" className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
        <AvatarFallback className="text-[length:var(--font-size-xs)]">AI</AvatarFallback>
      </Avatar>
      <div className="min-w-0 w-full">{children}</div>
    </div>
  );
}

export type Invite0421EduInviteFlowState = {
  joined: boolean;
  askedWhatIs: boolean;
  showForm: boolean;
  spaceName: string;
  roleChoice: "parent" | "self";
  submitted: boolean;
  imWelcomeVisible: boolean;
};

export const INVITE0421_EDU_INVITE_FLOW_INITIAL: Invite0421EduInviteFlowState = {
  joined: false,
  askedWhatIs: false,
  showForm: false,
  spaceName: INVITE0421_EDU_SPACE_NAME_FIELD,
  roleChoice: "parent",
  submitted: false,
  imWelcomeVisible: false,
};

function EduDrawerAiRow({
  lead,
  hideAssistantAvatar,
  children,
}: {
  lead: boolean;
  /** 主 AI 外层已有助手头像时为 true：不重复头像列，与主对话 CUI 左缘对齐 */
  hideAssistantAvatar?: boolean;
  children: React.ReactNode;
}) {
  if (hideAssistantAvatar) {
    return <div className="min-w-0 w-full">{children}</div>;
  }
  return (
    <Invite0421DrawerAssistantRow
      showAvatar={lead}
      avatar={
        <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
          <AvatarImage src={vvAssistantChatAvatar} alt="" className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
          <AvatarFallback className="text-[length:var(--font-size-xs)]">AI</AvatarFallback>
        </Avatar>
      }
    >
      <div className="min-w-0 w-full">{children}</div>
    </Invite0421DrawerAssistantRow>
  );
}

/** 加入机构后：引导创建教育空间（图2：白底气泡 + 内层浅灰底，灰区四边距气泡 12px；右侧「创建空间」样式区；整块可点） */
function EduCreateFamilySpacePromoCard({
  childName,
  onCreateSpace,
}: {
  childName: string;
  onCreateSpace: () => void;
}) {
  return (
    <button
      type="button"
      className="w-full cursor-pointer rounded-[length:var(--radius-300)] border border-border bg-bg p-[length:var(--space-300)] text-left shadow-xs transition-colors hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      onClick={onCreateSpace}
    >
      <div className="flex min-w-0 items-center justify-between gap-[length:var(--space-300)] rounded-[length:var(--radius-200)] bg-bg-secondary px-[length:var(--space-400)] py-[length:var(--space-350)]">
        <p className="m-0 min-w-0 flex-1 text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] leading-snug text-text">
          为 {childName} 创建教育空间
        </p>
        <span
          aria-hidden
          className="inline-flex h-[length:var(--space-800)] shrink-0 items-center justify-center rounded-full border border-primary bg-bg px-[length:var(--space-350)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary pointer-events-none"
        >
          创建空间
        </span>
      </div>
    </button>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full min-w-0 items-start justify-end gap-[length:var(--space-200)]">
      <div className="max-w-[length:calc(var(--space-800)*12+var(--space-400))] rounded-[length:var(--radius-200)] bg-primary px-[length:var(--space-300)] py-[length:var(--space-250)] text-[length:var(--font-size-sm)] leading-relaxed text-primary-foreground shadow-xs">
        {children}
      </div>
      <Avatar className="size-[length:var(--space-900)] shrink-0 rounded-[length:var(--radius-base)]">
        <AvatarFallback className="text-[length:var(--font-size-xs)]">我</AvatarFallback>
      </Avatar>
    </div>
  );
}

function EduSubmittedRound({
  onEnterSpace,
  spaceCreatedLabel,
  childName,
  hideAssistantAvatar,
}: {
  onEnterSpace: () => void;
  spaceCreatedLabel: string;
  childName: string;
  hideAssistantAvatar?: boolean;
}) {
  const [demoPwdVisible, setDemoPwdVisible] = React.useState(false);

  const copyWeiweiId = async () => {
    try {
      await navigator.clipboard.writeText(WEIWEI_ID);
      toast("已复制");
    } catch {
      toast("复制失败（演示）");
    }
  };

  return (
    <div className={cn("flex w-full min-w-0 flex-col", INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME)}>
      <EduDrawerAiRow lead hideAssistantAvatar={hideAssistantAvatar}>
        <AssistantChatBubble>
          {`${spaceCreatedLabel}创建成功，已与机构空间完成绑定，孩子独立账号同步生成。`}
        </AssistantChatBubble>
      </EduDrawerAiRow>
      <EduDrawerAiRow lead={false} hideAssistantAvatar={hideAssistantAvatar}>
        <GenericCard title="孩子账号" subtitle="孩子的专属账号，可独立登录薇薇参与课程计划">
          <div className="flex w-full flex-col gap-[length:var(--space-200)] rounded-[length:var(--radius-200)] bg-bg-secondary p-[length:var(--space-250)] text-[length:var(--font-size-xs)]">
            <div className="flex items-center justify-between gap-[length:var(--space-200)]">
              <span className="text-text-secondary">微微号</span>
              <span className="font-mono text-text">{WEIWEI_ID}</span>
            </div>
            <div className="flex items-center justify-between gap-[length:var(--space-200)]">
              <span className="text-text-secondary">密码</span>
              <div className="flex min-w-0 items-center gap-[length:var(--space-150)]">
                <span className="truncate font-mono text-text">
                  {demoPwdVisible ? "DemoPwd1!" : "********"}
                </span>
                <button
                  type="button"
                  className="shrink-0 rounded-[length:var(--radius-100)] p-[length:var(--space-100)] text-text-tertiary hover:bg-[var(--black-alpha-06)] hover:text-text"
                  aria-label={demoPwdVisible ? "隐藏密码" : "显示密码"}
                  onClick={() => setDemoPwdVisible((v) => !v)}
                >
                  {demoPwdVisible ? (
                    <EyeOff className="size-[length:var(--icon-sm)]" aria-hidden />
                  ) : (
                    <Eye className="size-[length:var(--icon-sm)]" aria-hidden />
                  )}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-[length:var(--space-300)] flex w-full items-center justify-end gap-[length:var(--space-150)]">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-text-tertiary hover:text-text"
              aria-label="复制微微号"
              onClick={() => void copyWeiweiId()}
            >
              <Copy className="size-[length:var(--icon-sm)]" strokeWidth={1.75} aria-hidden />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="text-text-tertiary hover:text-text"
              aria-label="编辑孩子信息"
              onClick={() => toast("演示：跳转编辑页未接入")}
            >
              <Pencil className="size-[length:var(--icon-sm)]" strokeWidth={1.75} aria-hidden />
            </Button>
          </div>
        </GenericCard>
      </EduDrawerAiRow>
      <EduDrawerAiRow lead={false} hideAssistantAvatar={hideAssistantAvatar}>
        <div className="scrollbar-hide flex w-full min-w-0 max-w-full flex-nowrap items-center justify-start gap-[length:var(--space-150)] overflow-x-auto overflow-y-hidden pb-[length:var(--space-50)]">
          <ChatPromptButton type="button" onClick={onEnterSpace}>
            进入{spaceCreatedLabel}
          </ChatPromptButton>
          <ChatPromptButton type="button" onClick={() => toast("演示：跳转编辑页未接入")}>
            编辑{childName}信息
          </ChatPromptButton>
        </div>
      </EduDrawerAiRow>
    </div>
  );
}

type Patch = Partial<Invite0421EduInviteFlowState>;

export function Invite0421EduStudentInviteFlowBody({
  state,
  onPatch,
  onEnterSpace,
  roundStackGapClassName,
  mainAiAssistantAvatarSrc,
  mainAiMergeFirstAssistantRoundWithPrevious = false,
}: {
  state: Invite0421EduInviteFlowState;
  onPatch: (p: Patch) => void;
  onEnterSpace: () => void;
  roundStackGapClassName: string;
  /** 主 AI 会话：每轮助手回复单独一行头像；传入与主对话一致的助手头像 URL */
  mainAiAssistantAvatarSrc?: string;
  /** 与上一条助手消息合并纵向间距（同 `hideAvatar` 语义） */
  mainAiMergeFirstAssistantRoundWithPrevious?: boolean;
}) {
  const { joined, askedWhatIs, showForm, spaceName, roleChoice, submitted } = state;
  const embedMainAi = Boolean(mainAiAssistantAvatarSrc);
  const innerHide = embedMainAi;

  const handleEnterSpace = () => {
    onPatch({ imWelcomeVisible: true });
    onEnterSpace();
  };

  const wrapMainAiRound = (mergedWithPrevious: boolean, node: React.ReactNode) =>
    embedMainAi && mainAiAssistantAvatarSrc ? (
      <MainAiInviteAssistantRound
        assistantAvatarSrc={mainAiAssistantAvatarSrc}
        mergedWithPrevious={mergedWithPrevious}
      >
        {node}
      </MainAiInviteAssistantRound>
    ) : (
      node
    );

  const inviteCardInner = (
    <div className={cn("flex w-full min-w-0 flex-col", INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME)}>
      <EduDrawerAiRow lead hideAssistantAvatar={innerHide}>
        <GenericCard title="学生邀请" subtitle={INVITE0421_EDU_STUDENT_ORG}>
          <p className="m-0 text-[length:var(--font-size-base)] font-[var(--font-weight-semibold)] leading-snug text-text">
            {INVITE0421_EDU_STUDENT_ORG} 邀请 {INVITE0421_EDU_STUDENT_CHILD} 加入成为学生
          </p>
          <p className="m-0 mt-[length:var(--space-200)] text-[length:var(--font-size-xs)] text-text-secondary">
            邀请人：yzhao
          </p>
          <p className="m-0 text-[length:var(--font-size-xs)] text-text-secondary">
            {new Date().toLocaleString("zh-CN", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
          <div className="mt-[length:var(--space-400)] w-full border-t border-border pt-[length:var(--space-400)]">
            <Button
              type="button"
              variant="primary"
              rounded
              size="lg"
              className={cn(
                "h-[length:var(--space-900)] w-full !rounded-[length:var(--radius-input)] !px-[var(--space-400)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)]",
                joined && "pointer-events-none opacity-[0.72]",
              )}
              disabled={joined}
              onClick={() => onPatch({ joined: true })}
            >
              加入
            </Button>
          </div>
        </GenericCard>
      </EduDrawerAiRow>
    </div>
  );

  const joinedBindingBubbleInner = (
    <div className={cn("flex w-full min-w-0 flex-col", INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME)}>
      <EduDrawerAiRow lead hideAssistantAvatar={innerHide}>
        <AssistantChatBubble>
          {`${INVITE0421_EDU_STUDENT_ORG}邀请 ${INVITE0421_EDU_STUDENT_CHILD} 加入空间建立绑定关系。绑定后，${INVITE0421_EDU_STUDENT_ORG}的相关数据将自动同步至${INVITE0421_EDU_SPACE_NAME_FIELD}。`}
        </AssistantChatBubble>
      </EduDrawerAiRow>
    </div>
  );

  const joinedPromoAndWhatIsInner = (
    <div className={cn("flex w-full min-w-0 flex-col", INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME)}>
      <EduDrawerAiRow lead hideAssistantAvatar={innerHide}>
        <EduCreateFamilySpacePromoCard
          childName={INVITE0421_EDU_STUDENT_CHILD}
          onCreateSpace={() => onPatch({ showForm: true })}
        />
      </EduDrawerAiRow>
      <EduDrawerAiRow lead={false} hideAssistantAvatar={innerHide}>
        <div className="scrollbar-hide flex w-full min-w-0 max-w-full flex-nowrap items-center justify-start gap-[length:var(--space-150)] overflow-x-auto overflow-y-hidden pb-[length:var(--space-50)]">
          <ChatPromptButton type="button" onClick={() => onPatch({ askedWhatIs: true })}>
            什么是教育空间
          </ChatPromptButton>
        </div>
      </EduDrawerAiRow>
    </div>
  );

  const formSolidified = submitted;

  const formInner = (
    <div className={cn("flex w-full min-w-0 flex-col", INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME)}>
      <EduDrawerAiRow lead hideAssistantAvatar={innerHide}>
        <GenericCard
          title="创建教育空间"
          subtitle="请填写以下信息（演示数据，不提交真实后端）"
          className={cn("@container min-w-0", formSolidified && "opacity-[0.92]")}
        >
          <div className="flex w-full flex-col gap-[length:var(--space-400)]">
            <div className="flex flex-col gap-[length:var(--space-150)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary" htmlFor="edu0421-flow-space-name">
                空间名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edu0421-flow-space-name"
                value={spaceName}
                onChange={(e) => onPatch({ spaceName: e.target.value })}
                readOnly={formSolidified}
                disabled={formSolidified}
                className={INVITE_TASK_STYLE_FIELD_CLASS}
              />
            </div>
            <div className="flex flex-col gap-[length:var(--space-150)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary">选择使用人</Label>
              <RadioGroup
                value={roleChoice}
                onValueChange={(v) => onPatch({ roleChoice: v as "parent" | "self" })}
                disabled={formSolidified}
                className="flex flex-col gap-[length:var(--space-300)]"
              >
                <label
                  htmlFor="r-flow-parent"
                  className={cn(
                    "flex items-start gap-[length:var(--space-200)]",
                    formSolidified ? "cursor-default" : "cursor-pointer",
                  )}
                >
                  <RadioGroupItem value="parent" id="r-flow-parent" className="mt-[length:var(--space-50)]" />
                  <span className="text-[length:var(--font-size-sm)] text-text">
                    我是家长，为{INVITE0421_EDU_STUDENT_CHILD}创建空间
                  </span>
                </label>
                <label
                  htmlFor="r-flow-self"
                  className={cn(
                    "flex items-start gap-[length:var(--space-200)]",
                    formSolidified ? "cursor-default" : "cursor-pointer",
                  )}
                >
                  <RadioGroupItem value="self" id="r-flow-self" className="mt-[length:var(--space-50)]" />
                  <span className="text-[length:var(--font-size-sm)] text-text">
                    我是{INVITE0421_EDU_STUDENT_CHILD}本人，为自己创建空间
                  </span>
                </label>
              </RadioGroup>
            </div>
          </div>
          <ChatTaskFormFooter
            disabled={formSolidified}
            onReset={() => {
              if (formSolidified) return;
              onPatch({ spaceName: INVITE0421_EDU_SPACE_NAME_FIELD, roleChoice: "parent" });
            }}
            onConfirm={() => {
              if (formSolidified) return;
              onPatch({ submitted: true });
            }}
            confirmLabel="确认创建"
          />
        </GenericCard>
      </EduDrawerAiRow>
    </div>
  );

  const askedWhatIsInnerDrawer = (
    <div className={cn("flex w-full min-w-0 flex-col", INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME)}>
      <UserBubble>什么是教育空间</UserBubble>
      <EduDrawerAiRow lead hideAssistantAvatar={innerHide}>
        <AssistantChatBubble>
          微微AI为家长或学生提供的教育空间是一体化的教育协同中枢，既可与学校/机构的教育空间互联互通，也可独立管理孩子的学习计划。
        </AssistantChatBubble>
      </EduDrawerAiRow>
    </div>
  );

  const askedWhatIsAssistantOnly = (
    <div className={cn("flex w-full min-w-0 flex-col", INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME)}>
      <EduDrawerAiRow lead hideAssistantAvatar={innerHide}>
        <AssistantChatBubble>
          微微AI为家长或学生提供的教育空间是一体化的教育协同中枢，既可与学校/机构的教育空间互联互通，也可独立管理孩子的学习计划。
        </AssistantChatBubble>
      </EduDrawerAiRow>
    </div>
  );

  return (
    <div className={cn("flex w-full min-w-0 flex-col", roundStackGapClassName)}>
      {wrapMainAiRound(mainAiMergeFirstAssistantRoundWithPrevious, inviteCardInner)}

      {joined ? (
        <div className="flex w-full min-w-0 flex-col gap-[length:var(--space-600)]">
          {wrapMainAiRound(false, joinedBindingBubbleInner)}
          {wrapMainAiRound(false, joinedPromoAndWhatIsInner)}
        </div>
      ) : null}

      {showForm ? wrapMainAiRound(false, formInner) : null}

      {askedWhatIs ? (
        embedMainAi ? (
          <div className="flex w-full min-w-0 flex-col gap-[length:var(--space-200)]">
            <UserBubble>什么是教育空间</UserBubble>
            {wrapMainAiRound(false, askedWhatIsAssistantOnly)}
          </div>
        ) : (
          askedWhatIsInnerDrawer
        )
      ) : null}

      {submitted
        ? wrapMainAiRound(
            false,
            <EduSubmittedRound
              onEnterSpace={handleEnterSpace}
              spaceCreatedLabel={INVITE0421_EDU_SPACE_CREATED_LABEL}
              childName={INVITE0421_EDU_STUDENT_CHILD}
              hideAssistantAvatar={innerHide}
            />,
          )
        : null}
    </div>
  );
}
