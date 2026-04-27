import * as React from "react";
import { Check, Clock3, Ellipsis, Minus, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GenericCard } from "../GenericCard";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../../ui/sheet";
import { ScrollArea } from "../../ui/scroll-area";
import { ChatNavBar } from "../../chat/ChatNavBar";
import { ChatSender } from "../../chat/ChatSender";
import { AssistantChatBubble } from "../../chat/ChatWelcome";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Invite0421DrawerAssistantRow,
  INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME,
} from "../../invite-0421/Invite0421DrawerAssistantRow";
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
} from "../../chat/chatMessageLayout";
import { vvAssistantChatAvatar } from "../../vv-app-shell/vv-ai-frame-assets";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../ui/tabs";
import { Input } from "../../ui/input";
import { cn } from "../../ui/utils";
import { CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME } from "../../../constants/chatBusinessEntryDrawer";

type PermissionFeatureId = "income" | "expense" | "budget";
type PermissionStatus = "none" | "pending";

type PermissionFeature = {
  id: PermissionFeatureId;
  title: string;
  description: string;
};

const FEATURE_DEFS: PermissionFeature[] = [
  { id: "income", title: "收入管理", description: "收入确认、对账、核销等流程" },
  { id: "expense", title: "支出管理", description: "支出申请、审批与归档流程" },
  { id: "budget", title: "预算管理", description: "预算详情、预算列表等管理能力" },
];

const ORG_FLOW_PERMISSION_FEATURE_ID: PermissionFeatureId = "budget";

const ORG_FLOW_ROWS_0425 = [
  {
    id: "org-structure-change",
    title: "组织机构变更申请",
    iconText: "组",
    iconClassName: "bg-destructive/15 text-destructive",
  },
  {
    id: "position-system-change",
    title: "职级体系变更申请",
    iconText: "级",
    iconClassName: "bg-warning/15 text-warning",
  },
  {
    id: "supervisor-change",
    title: "主管变更申请",
    iconText: "主",
    iconClassName: "bg-destructive/15 text-destructive",
  },
  {
    id: "post-change",
    title: "岗位变更申请",
    iconText: "岗",
    iconClassName: "bg-destructive/15 text-destructive",
  },
  {
    id: "position-change",
    title: "职位变更申请",
    iconText: "职",
    iconClassName: "bg-warning/15 text-warning",
  },
  {
    id: "salary-change",
    title: "薪酬分位变更申请",
    iconText: "薪",
    iconClassName: "bg-destructive/15 text-destructive",
  },
];

const EMPLOYEE_MENU_ROWS = [
  { menu: "会计科目", level: "职能", client: "PC" },
  { menu: "关联业务", level: "职能", client: "PC" },
  { menu: "财务流程设置", level: "职能", client: "PC" },
  { menu: "财务日志", level: "职能", client: "PC" },
  { menu: "发票管理", level: "职能", client: "PC" },
];

type ApprovalFlowNodeStatus = "done" | "pending" | "todo";

type ApprovalFlowNode = {
  id: string;
  role: string;
  name: string;
  status: ApprovalFlowNodeStatus;
  statusText?: string;
  timeText?: string;
};

/** 演示占位人名：与仓库 `.cursor/rules/demo-person-names.mdc` 约定一致（张三 / 李四 / 王五）。 */
const DEMO_APPLY_EMPLOYEE_NAME = "张三";
const DEMO_APPROVER_PRIMARY_NAME = "李四";

const INITIAL_APPROVAL_FLOW_NODES: ApprovalFlowNode[] = [
  {
    id: "starter",
    role: "发起人",
    name: DEMO_APPLY_EMPLOYEE_NAME,
    status: "done",
    timeText: "2026-04-25 17:32",
  },
  {
    id: "approver-1",
    role: "审批人",
    name: DEMO_APPROVER_PRIMARY_NAME,
    status: "pending",
    statusText: "审批中",
  },
];

function StatusBadge({ status }: { status: PermissionStatus }) {
  const iconClassName = "size-[10px] stroke-[2.5]";

  if (status === "pending") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex size-[var(--space-400)] items-center justify-center rounded-full bg-text-tertiary text-bg shadow-sm">
            <Clock3 className={iconClassName} />
          </span>
        </TooltipTrigger>
        <TooltipContent sideOffset={6} className="max-w-[260px] rounded-[var(--radius-200)] border border-border bg-bg px-[var(--space-250)] py-[var(--space-200)] text-[length:var(--font-size-sm)] text-text shadow-sm">
          此功能正在审批，点击查看审批
        </TooltipContent>
      </Tooltip>
    );
  }
  return (
    <span className="inline-flex size-[var(--space-400)] items-center justify-center rounded-full bg-text-tertiary text-bg shadow-sm">
      <Minus className={iconClassName} />
    </span>
  );
}

function PermissionStatusCornerBadge({ status }: { status: PermissionStatus }) {
  return (
    <span className="pointer-events-none absolute right-[calc(var(--space-150)*-1)] top-[calc(var(--space-150)*-1)] z-10">
      <StatusBadge status={status} />
    </span>
  );
}

function PermissionApplyFormCard({
  reason,
  onReasonChange,
  onReset,
  onSubmit,
}: {
  reason: string;
  onReasonChange: (v: string) => void;
  onReset: () => void;
  onSubmit: () => void;
}) {
  return (
    <GenericCard title="员工权限变更申请" subtitle="提交前请确认申请内容" className="w-full max-w-none">
      <div className="flex flex-col gap-[var(--space-600)]">
        <section className="flex flex-col gap-[var(--space-200)]">
          <button type="button" className="inline-flex w-fit items-center gap-[var(--space-100)] text-[length:var(--font-size-sm)] text-text-secondary">
            申请说明
          </button>
          <label className="text-[length:var(--font-size-sm)] text-text-secondary">
            申请原因<span className="text-destructive"> *</span>
          </label>
          <Textarea
            value={reason}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="请输入"
            maxLength={4000}
            showCount
            className="min-h-[var(--space-1800)]"
          />
        </section>

        <section className="space-y-[var(--space-200)]">
          <p className="text-[length:var(--font-size-sm)] text-text-secondary">员工姓名</p>
          <p className="text-[length:var(--font-size-base)] font-[var(--font-weight-regular)] text-text">
            {DEMO_APPLY_EMPLOYEE_NAME}
          </p>
        </section>

        <section className="space-y-[var(--space-200)]">
          <p className="border-l-2 border-primary pl-[var(--space-150)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
            模板权限
          </p>
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
            <div className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.7fr] bg-bg-tertiary px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-xs)] text-text-secondary">
              <span>模板名称</span>
              <span>组织权限</span>
              <span>行政权限</span>
              <span>操作权限</span>
            </div>
            <div className="grid grid-cols-[1.6fr_0.7fr_0.7fr_0.7fr] px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)]">
              <div className="min-w-0">
                <p className="text-text">基础模板</p>
                <p className="mt-[var(--space-50)] text-[length:var(--font-size-xs)] text-text-secondary">
                  基础模板含所有员工所需的通用功能，默认提供给所有员工使用。
                </p>
              </div>
              <span className="text-text">本人</span>
              <span className="text-text">仅本公司</span>
              <span className="text-text">--</span>
            </div>
          </div>
        </section>

        <section className="space-y-[var(--space-200)]">
          <p className="border-l-2 border-primary pl-[var(--space-150)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
            岗位权限
          </p>
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
            <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] bg-bg-tertiary px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-xs)] text-text-secondary">
              <span>岗位名称</span>
              <span>部门</span>
              <span>任职类型</span>
              <span>模板</span>
              <span>组织权限</span>
              <span>行政权限</span>
            </div>
            <div className="grid grid-cols-[1fr_0.8fr_0.8fr_0.8fr_0.8fr_0.8fr] px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)]">
              <span className="text-text">中级交互专家</span>
              <span className="text-text">交互设计</span>
              <span className="text-text">主岗</span>
              <span className="text-text">基础模板</span>
              <span className="text-text">本人</span>
              <span className="text-text">仅本公司</span>
            </div>
          </div>
        </section>

        <section className="space-y-[var(--space-200)]">
          <p className="border-l-2 border-primary pl-[var(--space-150)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
            员工权限
          </p>
          <Tabs defaultValue="menu">
            <TabsList className="h-auto bg-transparent p-0">
              <TabsTrigger value="menu" className="px-0 py-[var(--space-100)] mr-[var(--space-400)]">菜单配置(0/18)</TabsTrigger>
              <TabsTrigger value="perm" className="px-0 py-[var(--space-100)]">权限配置</TabsTrigger>
            </TabsList>
            <TabsContent value="menu" className="mt-[var(--space-200)]">
              <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
                <div className="grid grid-cols-[1.3fr_0.25fr_0.25fr] bg-bg-tertiary px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-xs)] text-text-secondary">
                  <span>菜单名称</span>
                  <span>功能等级</span>
                  <span>客户端</span>
                </div>
                <div className="divide-y divide-border">
                  {EMPLOYEE_MENU_ROWS.map((row) => (
                    <div key={row.menu} className="grid grid-cols-[1.3fr_0.25fr_0.25fr] items-center px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)]">
                      <span className="text-text">{row.menu}</span>
                      <span className="inline-flex w-fit rounded-[var(--radius-100)] bg-primary/10 px-[var(--space-100)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-primary">{row.level}</span>
                      <span className="inline-flex w-fit rounded-[var(--radius-100)] bg-primary/10 px-[var(--space-100)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-primary">{row.client}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="perm" className="mt-[var(--space-200)] text-[length:var(--font-size-sm)] text-text-secondary">
              当前示例按菜单权限配置申请，审批后自动同步权限配置。
            </TabsContent>
          </Tabs>
        </section>

        <div className="flex w-full items-center gap-[var(--space-200)] border-t border-border-divider pt-[var(--space-300)]">
          <Button
            type="button"
            variant="chat-reset"
            className="h-[var(--space-800)] min-w-[var(--space-1800)] shrink-0"
            onClick={onReset}
          >
            重置
          </Button>
          <Button
            type="button"
            variant="chat-submit"
            className="h-[var(--space-800)] flex-1 min-w-0"
            onClick={onSubmit}
          >
            提交
          </Button>
        </div>
      </div>
    </GenericCard>
  );
}

function PermissionApplyDetailCard({
  flowNodes,
  onInsertFlowNode,
  onAppendFlowNode,
}: {
  flowNodes: ApprovalFlowNode[];
  onInsertFlowNode: (insertAfterIndex: number, approverName: string) => void;
  onAppendFlowNode: (approverName: string) => void;
}) {
  const [insertAfterIndex, setInsertAfterIndex] = React.useState<number | null>(null);
  const [draftApproverName, setDraftApproverName] = React.useState("");

  const submitInsert = React.useCallback(() => {
    const trimmedName = draftApproverName.trim();
    if (!trimmedName || insertAfterIndex === null) return;
    onInsertFlowNode(insertAfterIndex, trimmedName);
    setDraftApproverName("");
    setInsertAfterIndex(null);
  }, [draftApproverName, insertAfterIndex, onInsertFlowNode]);

  const submitAppend = React.useCallback(() => {
    const trimmedName = draftApproverName.trim();
    if (!trimmedName) return;
    onAppendFlowNode(trimmedName);
    setDraftApproverName("");
    setInsertAfterIndex(null);
  }, [draftApproverName, onAppendFlowNode]);

  const lastNodeIndex = flowNodes.length - 1;

  return (
    <GenericCard title="员工权限变更申请" subtitle="流程编号：YGQXBGSQ-04251732129310001" className="w-full max-w-none">
      <div className="flex flex-col gap-[var(--space-600)]">
        <div className="flex flex-wrap items-center gap-[var(--space-200)] text-[length:var(--font-size-sm)] text-text-secondary">
          <span>发起人：{DEMO_APPLY_EMPLOYEE_NAME}</span>
          <span>组织：马来西亚教育租户</span>
          <span className="inline-flex items-center rounded-[var(--radius-100)] bg-warning/15 px-[var(--space-150)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-warning">处理中</span>
        </div>

        <section className="space-y-[var(--space-150)]">
          <p className="text-[length:var(--font-size-sm)] text-text-secondary">申请原因</p>
          <p className="text-[length:var(--font-size-sm)] text-text">申请开通收入管理与支出管理权限，用于本周对账与付款流程处理。</p>
        </section>

        <section className="space-y-[var(--space-200)]">
          <p className="border-l-2 border-primary pl-[var(--space-150)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">员工权限</p>
          <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
            <div className="grid grid-cols-[1.3fr_0.25fr_0.25fr] bg-bg-tertiary px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-xs)] text-text-secondary">
              <span>菜单名称</span>
              <span>功能等级</span>
              <span>客户端</span>
            </div>
            <div className="divide-y divide-border">
              {EMPLOYEE_MENU_ROWS.map((row) => (
                <div key={row.menu} className="grid grid-cols-[1.3fr_0.25fr_0.25fr] items-center px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)]">
                  <span className="text-text">{row.menu}</span>
                  <span className="inline-flex w-fit rounded-[var(--radius-100)] bg-primary/10 px-[var(--space-100)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-primary">{row.level}</span>
                  <span className="inline-flex w-fit rounded-[var(--radius-100)] bg-primary/10 px-[var(--space-100)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-primary">{row.client}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="space-y-[var(--space-200)]">
          <div className="flex items-center gap-[var(--space-150)]">
            <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">流程</p>
            <button
              type="button"
              className="text-[length:var(--font-size-xs)] text-primary hover:text-primary-hover"
              onClick={() => {
                setInsertAfterIndex(lastNodeIndex);
                setDraftApproverName("");
              }}
            >
              增加记录
            </button>
          </div>

          <div className="flex flex-col text-[length:var(--font-size-sm)]">
            {flowNodes.map((node, index) => {
              const isDone = node.status === "done";
              const isPending = node.status === "pending";

              return (
                <React.Fragment key={node.id}>
                  <div className="flex items-start gap-[var(--space-200)]">
                    <div className="relative flex w-[var(--space-700)] shrink-0 justify-center">
                      <Avatar className="size-[var(--space-600)] border border-border bg-bg">
                        <AvatarImage src="" alt="" />
                        <AvatarFallback className="text-[length:var(--font-size-xxs)] text-text-secondary">
                          {node.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      {index < lastNodeIndex ? (
                        <span className="pointer-events-none absolute left-1/2 top-[calc(var(--space-600)+var(--space-50))] h-[var(--space-500)] w-px -translate-x-1/2 bg-border-divider" />
                      ) : (
                        <span className="pointer-events-none absolute left-1/2 top-[calc(var(--space-600)+var(--space-50))] h-[var(--space-300)] w-px -translate-x-1/2 bg-border-divider" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 pb-[var(--space-200)]">
                      <div className="flex flex-wrap items-center gap-[var(--space-100)]">
                        <span className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text">{node.role}</span>
                        {isDone ? (
                          <span className="inline-flex items-center gap-[var(--space-50)] rounded-[var(--radius-100)] bg-success/15 px-[var(--space-100)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-success">
                            <Check className="size-[10px]" />
                            已完成
                          </span>
                        ) : null}
                        {isPending ? (
                          <span className="inline-flex items-center rounded-[var(--radius-100)] bg-warning/15 px-[var(--space-100)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-warning">
                            {node.statusText ?? "审批中"}
                          </span>
                        ) : null}
                        {node.status === "todo" ? (
                          <span className="inline-flex items-center rounded-[var(--radius-100)] bg-bg-tertiary px-[var(--space-100)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-text-tertiary">
                            待审批
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-[var(--space-50)] text-[length:var(--font-size-sm)] text-text">{node.name}</p>
                      {node.timeText ? (
                        <p className="mt-[var(--space-50)] text-[length:var(--font-size-xs)] text-text-secondary">{node.timeText}</p>
                      ) : null}
                    </div>
                  </div>

                  {index < lastNodeIndex ? (
                    <>
                      <div className="mb-[var(--space-100)] ml-[calc(var(--space-350)-var(--space-50))] flex items-center gap-[var(--space-100)]">
                        <span className="h-[var(--space-200)] w-px bg-border-divider" />
                        <button
                          type="button"
                          className="inline-flex size-[var(--space-400)] items-center justify-center rounded-full border border-border bg-bg text-text-tertiary transition-colors hover:border-primary hover:text-primary"
                          onClick={() => {
                            setInsertAfterIndex(index);
                            setDraftApproverName("");
                          }}
                        >
                          <Plus className="size-[10px]" />
                        </button>
                        <span className="h-[var(--space-200)] w-px bg-border-divider" />
                      </div>

                      {insertAfterIndex === index ? (
                        <div className="mb-[var(--space-250)] ml-[var(--space-900)] flex items-center gap-[var(--space-150)]">
                          <Input
                            value={draftApproverName}
                            onChange={(event) => setDraftApproverName(event.target.value)}
                            placeholder="输入审批人姓名"
                            className="h-[var(--space-700)]"
                          />
                          <Button
                            type="button"
                            variant="chat-submit"
                            className="h-[var(--space-700)] min-w-[var(--space-1000)]"
                            onClick={submitInsert}
                          >
                            插入
                          </Button>
                          <Button
                            type="button"
                            variant="chat-reset"
                            className="h-[var(--space-700)] min-w-[var(--space-1000)]"
                            onClick={() => {
                              setInsertAfterIndex(null);
                              setDraftApproverName("");
                            }}
                          >
                            取消
                          </Button>
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </React.Fragment>
              );
            })}

            {insertAfterIndex === lastNodeIndex ? (
              <div className="mb-[var(--space-250)] ml-[var(--space-900)] flex items-center gap-[var(--space-150)]">
                <Input
                  value={draftApproverName}
                  onChange={(event) => setDraftApproverName(event.target.value)}
                  placeholder="输入审批人姓名"
                  className="h-[var(--space-700)]"
                />
                <Button
                  type="button"
                  variant="chat-submit"
                  className="h-[var(--space-700)] min-w-[var(--space-1000)]"
                  onClick={submitAppend}
                >
                  新增
                </Button>
                <Button
                  type="button"
                  variant="chat-reset"
                  className="h-[var(--space-700)] min-w-[var(--space-1000)]"
                  onClick={() => {
                    setInsertAfterIndex(null);
                    setDraftApproverName("");
                  }}
                >
                  取消
                </Button>
              </div>
            ) : null}
          </div>
        </section>

        <div className="grid w-full grid-cols-4 gap-[var(--space-200)] border-t border-border-divider pt-[var(--space-300)]">
          <Button type="button" variant="chat-reset" className="h-[var(--space-800)] w-full min-w-0">
            撤销
          </Button>
          <Button type="button" variant="chat-reset" className="h-[var(--space-800)] w-full min-w-0">
            再次提交
          </Button>
          <Button type="button" variant="chat-submit" className="h-[var(--space-800)] w-full min-w-0">
            催办
          </Button>
          <Button type="button" variant="chat-reset" className="h-[var(--space-800)] w-full min-w-0">
            沟通
          </Button>
        </div>
      </div>
    </GenericCard>
  );
}

export function OrganizationPermissionApplySection0425(props?: {
  mode?: "guideOnly" | "orgSettingsOnly" | "all";
  /** 主 AI：权限引导卡、组织设置卡标题下注入（抽屉内勿传） */
  mainAiGuideAndSettingsTitleBelow?: React.ReactNode;
}) {
  const mode = props?.mode ?? "all";
  const mainAiGuideAndSettingsTitleBelow = props?.mainAiGuideAndSettingsTitleBelow;
  const [statusByFeature, setStatusByFeature] = React.useState<Record<PermissionFeatureId, PermissionStatus>>({
    income: "none",
    expense: "none",
    budget: "none",
  });
  const [dialogFeatureId, setDialogFeatureId] = React.useState<PermissionFeatureId | null>(null);
  const [activeFeatureId, setActiveFeatureId] = React.useState<PermissionFeatureId>("income");
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [drawerComposerValue, setDrawerComposerValue] = React.useState("");
  const [drawerView, setDrawerView] = React.useState<"form" | "detail">("form");
  const [applyReason, setApplyReason] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [approvalFlowNodes, setApprovalFlowNodes] = React.useState<ApprovalFlowNode[]>(INITIAL_APPROVAL_FLOW_NODES);

  const openApplyDrawer = React.useCallback((featureId: PermissionFeatureId, view: "form" | "detail") => {
    setActiveFeatureId(featureId);
    setDrawerView(view);
    setDrawerOpen(true);
  }, []);

  const activeFeature = FEATURE_DEFS.find((f) => f.id === activeFeatureId) ?? FEATURE_DEFS[0];

  const guideButtonLabel = submitted ? "查看权限申请单" : "申请权限";
  const orgFlowPermissionStatus = statusByFeature[ORG_FLOW_PERMISSION_FEATURE_ID];

  const handleOrgFlowRestrictedAction = React.useCallback(() => {
    if (orgFlowPermissionStatus === "pending") {
      openApplyDrawer(ORG_FLOW_PERMISSION_FEATURE_ID, "detail");
      return;
    }
    setDialogFeatureId(ORG_FLOW_PERMISSION_FEATURE_ID);
  }, [openApplyDrawer, orgFlowPermissionStatus]);

  const createTodoApprovalNode = React.useCallback((approverName: string): ApprovalFlowNode => {
    return {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      role: "审批人",
      name: approverName,
      status: "todo",
      statusText: "待审批",
    };
  }, []);

  const insertApprovalNode = React.useCallback(
    (insertAfterIndex: number, approverName: string) => {
      setApprovalFlowNodes((prev) => {
        const next = [...prev];
        next.splice(insertAfterIndex + 1, 0, createTodoApprovalNode(approverName));
        return next;
      });
    },
    [createTodoApprovalNode],
  );

  const appendApprovalNode = React.useCallback(
    (approverName: string) => {
      setApprovalFlowNodes((prev) => [...prev, createTodoApprovalNode(approverName)]);
    },
    [createTodoApprovalNode],
  );

  return (
    <>
      {(mode === "all" || mode === "guideOnly") && (
        <GenericCard
          title="权限申请引导"
          titleBelowAccessory={mainAiGuideAndSettingsTitleBelow}
          className="w-full max-w-none"
        >
          <div className="flex flex-col gap-[var(--space-300)]">
            <p className="text-center text-[length:var(--font-size-base)] text-text">
              {submitted
                ? "申请已提交，可查看权限申请单并继续催办或沟通。"
                : "当前暂无员工应用相关权限，请先申请权限后再操作。"}
            </p>
            <div className="flex justify-center">
              <Button
                type="button"
                variant="primary"
                className="h-[var(--space-900)] min-w-[var(--space-2400)]"
                onClick={() => openApplyDrawer(activeFeatureId, submitted ? "detail" : "form")}
              >
                {guideButtonLabel}
              </Button>
            </div>
          </div>
        </GenericCard>
      )}

      {(mode === "all" || mode === "orgSettingsOnly") && (
        <GenericCard
          title="组织设置"
          titleBelowAccessory={mainAiGuideAndSettingsTitleBelow}
          className={cn("w-full max-w-none", mode === "all" ? "mt-[var(--space-400)]" : "")}
        >
          <div className="flex flex-col gap-[var(--space-300)]">
            <div className="flex items-center justify-between gap-[var(--space-300)]">
              <Input
                readOnly
                value=""
                placeholder="搜索流程名称"
                className="h-[var(--space-800)] max-w-[calc(var(--space-4000)*2)] bg-bg"
              />
              <button
                type="button"
                className="relative inline-flex h-[var(--space-800)] shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-primary px-[var(--space-300)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-primary-foreground transition-colors hover:bg-primary-hover"
                onClick={handleOrgFlowRestrictedAction}
              >
                新增流程
                <PermissionStatusCornerBadge status={orgFlowPermissionStatus} />
              </button>
            </div>

            <div className="flex items-center justify-between text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
              <span>组织流程（6）</span>
            </div>

            <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg">
              <div className="divide-y divide-border-divider">
                {ORG_FLOW_ROWS_0425.map((row) => (
                  <div
                    key={row.id}
                    className="grid grid-cols-[minmax(0,1.3fr)_minmax(0,1.2fr)_minmax(0,0.8fr)_auto] items-center gap-[var(--space-300)] px-[var(--space-300)] py-[var(--space-250)]"
                  >
                    <div className="flex min-w-0 items-center gap-[var(--space-250)]">
                      <span
                        className={cn(
                          "flex size-[var(--space-600)] shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)]",
                          row.iconClassName,
                        )}
                      >
                        {row.iconText}
                      </span>
                      <span className="truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                        {row.title}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[length:var(--font-size-sm)] text-text">适用公司</p>
                      <p className="mt-[var(--space-50)] truncate text-[length:var(--font-size-xs)] text-text-secondary">
                        PG北京科技有限公司及其附属公司
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-[length:var(--font-size-sm)] text-text">流程状态</p>
                      <p className="mt-[var(--space-50)] text-[length:var(--font-size-xs)] text-success">启用</p>
                    </div>

                    <div className="flex items-center justify-end gap-[var(--space-250)]">
                      {[
                        { label: "编辑流程", Icon: Pencil },
                        { label: "删除流程", Icon: Trash2 },
                        { label: "更多操作", Icon: Ellipsis },
                      ].map(({ label, Icon }) => (
                        <Tooltip key={label}>
                          <TooltipTrigger asChild>
                            <button
                              type="button"
                              aria-label={label}
                              className="relative inline-flex size-[var(--space-700)] items-center justify-center rounded-[var(--radius-100)] text-text-tertiary transition-colors hover:bg-bg-secondary hover:text-text"
                              onClick={handleOrgFlowRestrictedAction}
                            >
                              <Icon className="size-[var(--space-300)]" />
                              <PermissionStatusCornerBadge status={orgFlowPermissionStatus} />
                            </button>
                          </TooltipTrigger>
                          {orgFlowPermissionStatus === "pending" ? (
                            <TooltipContent sideOffset={6} className="max-w-[260px] rounded-[var(--radius-200)] border border-border bg-bg px-[var(--space-250)] py-[var(--space-200)] text-[length:var(--font-size-sm)] text-text shadow-sm">
                              此功能正在审批，点击查看审批
                            </TooltipContent>
                          ) : null}
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GenericCard>
      )}

      <AlertDialog open={dialogFeatureId !== null} onOpenChange={(open) => !open && setDialogFeatureId(null)}>
        <AlertDialogContent className="z-[210]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-left text-[length:var(--font-size-lg)] text-text">
              你暂无「{FEATURE_DEFS.find((f) => f.id === dialogFeatureId)?.title ?? "该功能"}」权限，如需使用请发起申请
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-[var(--space-200)]">
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!dialogFeatureId) return;
                openApplyDrawer(dialogFeatureId, "form");
                setDialogFeatureId(null);
              }}
            >
              申请
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet
        open={drawerOpen}
        onOpenChange={(open) => {
          setDrawerOpen(open);
          if (!open) {
            setDrawerComposerValue("");
          }
        }}
      >
        <SheetContent side="right" className={CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME}>
          <div className="sr-only">
            <SheetTitle>员工权限申请</SheetTitle>
            <SheetDescription>业务入口 CUI 抽屉</SheetDescription>
          </div>
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-cui-bg">
            <ChatNavBar
              title={drawerView === "form" ? "员工权限申请" : "员工权限申请单详情"}
              titleOnlyChrome
              showClose
              onClose={() => {
                setDrawerOpen(false);
                setDrawerComposerValue("");
              }}
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
                      <AvatarImage src={vvAssistantChatAvatar} alt="" className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME} />
                      <AvatarFallback className="text-[length:var(--font-size-xs)]">AI</AvatarFallback>
                    </Avatar>
                  }
                >
                  <AssistantChatBubble>
                    {drawerView === "form"
                      ? `已为你打开「${activeFeature.title}」权限申请。提交后将进入审批流并可在此抽屉查看进度。`
                      : `当前为「${activeFeature.title}」权限申请单详情，可继续催办或沟通。`}
                  </AssistantChatBubble>
                </Invite0421DrawerAssistantRow>
                <Invite0421DrawerAssistantRow showAvatar={false}>
                  {drawerView === "form" ? (
                    <PermissionApplyFormCard
                      reason={applyReason}
                      onReasonChange={setApplyReason}
                      onReset={() => {
                        setApplyReason("");
                      }}
                      onSubmit={() => {
                        if (!applyReason.trim()) {
                          toast.error("请输入申请原因");
                          return;
                        }
                        toast.custom(
                          () => (
                            <div className="rounded-[var(--radius-200)] border border-border bg-bg px-[var(--space-300)] py-[var(--space-200)] text-[length:var(--font-size-sm)] text-text shadow-sm">
                              申请已提交，请等待审批
                            </div>
                          ),
                          { duration: 3000 },
                        );
                        setStatusByFeature((prev) => ({ ...prev, [activeFeatureId]: "pending" }));
                        setSubmitted(true);
                        setDrawerView("detail");
                      }}
                    />
                  ) : (
                    <PermissionApplyDetailCard
                      flowNodes={approvalFlowNodes}
                      onInsertFlowNode={insertApprovalNode}
                      onAppendFlowNode={appendApprovalNode}
                    />
                  )}
                </Invite0421DrawerAssistantRow>
              </div>
            </ScrollArea>
            <div className="relative z-20 w-full flex-none px-[max(20px,var(--cui-padding-max))] pb-[var(--space-400)] pt-0">
              <ChatSender
                inputValue={drawerComposerValue}
                setInputValue={setDrawerComposerValue}
                handleSendMessage={() => setDrawerComposerValue("")}
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
    </>
  );
}

