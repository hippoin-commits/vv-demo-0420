import * as React from "react";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { GenericCard } from "../GenericCard";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "../../ui/sheet";
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

type PendingKind = "add" | "edit" | "delete";

type OrgDepartment0425 = {
  id: string;
  parentId: string | null;
  name: string;
  companyPath: string;
  status: "active";
  departmentCount: string;
  positionCount: string;
  manager: string;
  groupName: string;
  pending?: PendingKind;
};

type DrawerMode = "add" | "edit";

type DrawerState = {
  mode: DrawerMode;
  targetId: string;
} | null;

const FIELD_CLASS =
  "w-full h-[var(--space-900)] px-[var(--space-300)] rounded-[var(--radius-input)] border border-border bg-bg text-[length:var(--font-size-sm)] text-text";

const DRAWER_CLASSNAME =
  "h-full w-[70vw] max-w-[70vw] sm:max-w-[70vw] p-0 border-none rounded-l-[length:var(--radius-400)] overflow-hidden flex flex-col gap-0 shadow-2xl [&>button]:hidden";

const INITIAL_DEPARTMENTS_0425: OrgDepartment0425[] = [
  {
    id: "pg",
    parentId: null,
    name: "PG科技",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "9 / 11",
    positionCount: "22 / 10",
    manager: "--",
    groupName: "--",
  },
  {
    id: "president",
    parentId: "pg",
    name: "总裁办公室",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "0 / 0",
    positionCount: "11 / 7",
    manager: "殷朗(群主)",
    groupName: "--",
  },
  {
    id: "rd",
    parentId: "pg",
    name: "研发中心",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "2 / 2",
    positionCount: "5 / 2",
    manager: "殷朗(CTO)",
    groupName: "--",
  },
  {
    id: "operation",
    parentId: "rd",
    name: "运营中心",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "0 / 0",
    positionCount: "1 / 0",
    manager: "-- (运营总裁)",
    groupName: "--",
  },
  {
    id: "hr",
    parentId: "rd",
    name: "人力资源部",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "0 / 0",
    positionCount: "1 / 0",
    manager: "-- (人力总裁)",
    groupName: "--",
  },
  {
    id: "strategy",
    parentId: "pg",
    name: "战略投资部",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "0 / 0",
    positionCount: "1 / 0",
    manager: "-- (投资总裁)",
    groupName: "--",
  },
  {
    id: "strategy-system",
    parentId: "strategy",
    name: "战略制定",
    companyPath: "PaloGino环球科技集团/战略投资部",
    status: "active",
    departmentCount: "0 / 0",
    positionCount: "0 / 0",
    manager: "--",
    groupName: "--",
  },
  {
    id: "legal",
    parentId: "pg",
    name: "法务部",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "0 / 0",
    positionCount: "1 / 0",
    manager: "-- (法务总裁)",
    groupName: "--",
  },
  {
    id: "finance",
    parentId: "pg",
    name: "财务部",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "0 / 0",
    positionCount: "0 / 0",
    manager: "--",
    groupName: "--",
  },
  {
    id: "esg",
    parentId: "pg",
    name: "ESG办公室",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "0 / 0",
    positionCount: "1 / 0",
    manager: "-- (ESG总监)",
    groupName: "--",
  },
  {
    id: "admin",
    parentId: "pg",
    name: "综合行政部",
    companyPath: "PaloGino环球科技集团",
    status: "active",
    departmentCount: "0 / 0",
    positionCount: "1 / 0",
    manager: "-- (行政总监)",
    groupName: "--",
  },
];

function cloneInitialDepartments0425() {
  return INITIAL_DEPARTMENTS_0425.map((item) => ({ ...item }));
}

function pendingLabel(kind?: PendingKind) {
  if (kind === "add") return "待提交 新增";
  if (kind === "edit") return "待提交 修改";
  if (kind === "delete") return "待提交 删除";
  return null;
}

function pendingToneClass(kind?: PendingKind) {
  if (kind === "delete") return "bg-destructive/10 text-destructive";
  if (kind === "add") return "bg-primary/10 text-primary";
  return "bg-warning/15 text-warning";
}

function ChangeTypeTag({ kind }: { kind: PendingKind }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-[var(--radius-100)] px-[var(--space-150)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)]",
        pendingToneClass(kind),
      )}
    >
      {pendingLabel(kind)}
    </span>
  );
}

function StatusTag() {
  return (
    <span className="inline-flex items-center rounded-[var(--radius-100)] bg-success/10 px-[var(--space-150)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-success">
      已生效
    </span>
  );
}

function flattenDepartments(
  departments: OrgDepartment0425[],
  expanded: Record<string, boolean>,
  parentId: string | null = null,
  level = 0,
): Array<OrgDepartment0425 & { level: number; hasChildren: boolean }> {
  return departments
    .filter((item) => item.parentId === parentId)
    .flatMap((item) => {
      const children = departments.filter((child) => child.parentId === item.id);
      const current = { ...item, level, hasChildren: children.length > 0 };
      if (!expanded[item.id]) return [current];
      return [current, ...flattenDepartments(departments, expanded, item.id, level + 1)];
    });
}

function OrganizationDepartmentForm0425({
  mode,
  target,
  parent,
  onCancel,
  onSubmit,
}: {
  mode: DrawerMode;
  target: OrgDepartment0425;
  parent: OrgDepartment0425 | null;
  onCancel: () => void;
  onSubmit: (values: { name: string; companyPath: string; manager: string }) => void;
}) {
  const [name, setName] = React.useState(mode === "edit" ? target.name : "");
  const [companyPath, setCompanyPath] = React.useState(
    mode === "edit" ? target.companyPath : parent?.companyPath ?? "PaloGino环球科技集团",
  );
  const [manager, setManager] = React.useState(mode === "edit" ? target.manager : "--");

  return (
    <GenericCard title={mode === "add" ? "新增子部门" : "编辑部门"} subtitle="组织管理">
      <div className="flex flex-col gap-[var(--space-350)]">
        <div className="space-y-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
            {mode === "add" ? "上级部门" : "当前部门"}
          </Label>
          <Input value={mode === "add" ? target.name : parent?.name ?? "--"} readOnly className={FIELD_CLASS} />
        </div>
        <div className="space-y-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
            部门名称<span className="text-destructive"> *</span>
          </Label>
          <Input value={name} onChange={(event) => setName(event.target.value)} className={FIELD_CLASS} />
        </div>
        <div className="space-y-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">适用公司</Label>
          <Select value={companyPath} onValueChange={setCompanyPath}>
            <SelectTrigger className={FIELD_CLASS}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PaloGino环球科技集团">PaloGino环球科技集团</SelectItem>
              <SelectItem value="PaloGino环球科技集团/战略投资部">
                PaloGino环球科技集团/战略投资部
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">主管</Label>
          <Input value={manager} onChange={(event) => setManager(event.target.value)} className={FIELD_CLASS} />
        </div>
        <div className="flex flex-wrap justify-end gap-[var(--space-200)] border-t border-border-divider pt-[var(--space-300)]">
          <Button type="button" variant="outline" rounded onClick={onCancel}>
            取消
          </Button>
          <Button
            type="button"
            variant="primary"
            rounded
            onClick={() => {
              const trimmed = name.trim();
              if (!trimmed) {
                toast.error("请输入部门名称");
                return;
              }
              onSubmit({ name: trimmed, companyPath, manager: manager.trim() || "--" });
            }}
          >
            提交
          </Button>
        </div>
      </div>
    </GenericCard>
  );
}

function ApprovalProgress0425({ submitted }: { submitted: boolean }) {
  const nodes = submitted
    ? [
        { title: "发起人", name: "殷朗", status: "已提交", meta: "2026-04-25 13:41" },
        { title: "审批人", name: "殷朗", status: "审批中", meta: "" },
      ]
    : [
        { title: "发起人", name: "殷朗", status: "", meta: "" },
        { title: "审批人", name: "殷朗", status: "", meta: "" },
      ];

  return (
    <div className="flex flex-col gap-[var(--space-300)]">
      <div className="flex items-center justify-between gap-[var(--space-300)]">
        <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">流程</p>
        <button type="button" className="text-[length:var(--font-size-xs)] text-primary hover:underline">
          节点说明
        </button>
      </div>
      <div className="flex flex-col">
        {nodes.map((node, index) => (
          <div key={node.title} className="flex gap-[var(--space-250)]">
            <div className="flex w-[var(--space-900)] shrink-0 flex-col items-center">
              <span className="flex size-[var(--space-600)] items-center justify-center rounded-full bg-bg-tertiary text-[length:var(--font-size-xs)] text-text-secondary">
                殷
              </span>
              <span className="my-[var(--space-150)] flex size-[var(--space-500)] items-center justify-center rounded-full border border-border bg-bg text-text-tertiary">
                +
              </span>
              {index < nodes.length - 1 ? <span className="h-[var(--space-800)] w-px bg-border" aria-hidden /> : null}
            </div>
            <div className="min-w-0 pb-[var(--space-300)]">
              <div className="flex flex-wrap items-center gap-[var(--space-150)]">
                <span className="text-[length:var(--font-size-sm)] text-text">{node.title}</span>
                {node.status ? (
                  <span
                    className={cn(
                      "rounded-[var(--radius-100)] px-[var(--space-150)] py-[var(--space-50)] text-[length:var(--font-size-xxs)]",
                      node.status === "审批中" ? "bg-warning/15 text-warning" : "bg-success/10 text-success",
                    )}
                  >
                    {node.status}
                  </span>
                ) : null}
              </div>
              <p className="mt-[var(--space-50)] text-[length:var(--font-size-xs)] text-text-secondary">{node.name}</p>
              {node.meta ? (
                <p className="mt-[var(--space-50)] text-[length:var(--font-size-xs)] text-text-tertiary">{node.meta}</p>
              ) : null}
            </div>
          </div>
        ))}
        <div className="ml-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-tertiary">流程结束</div>
      </div>
    </div>
  );
}

function OrganizationChangeGraph0425({ changes }: { changes: OrgDepartment0425[] }) {
  const firstDelete = changes.find((item) => item.pending === "delete") ?? changes[0];
  return (
    <div className="rounded-[var(--radius-md)] bg-bg-secondary px-[var(--space-300)] py-[var(--space-500)]">
      <div className="mx-auto flex w-full max-w-[length:calc(var(--space-800)*8)] flex-col items-center">
        <div className="rounded-[var(--radius-md)] bg-bg px-[var(--space-300)] py-[var(--space-200)] text-center text-[length:var(--font-size-xs)] text-text shadow-xs">
          PaloGino环球科技集团
        </div>
        <span className="h-[var(--space-800)] w-px border-l border-dashed border-border" aria-hidden />
        <div className="rounded-[var(--radius-md)] bg-bg px-[var(--space-300)] py-[var(--space-200)] text-center text-[length:var(--font-size-xs)] text-text shadow-xs">
          总裁办公室
        </div>
        <span className="h-[var(--space-800)] w-px border-l border-dashed border-border" aria-hidden />
        <div className="rounded-[var(--radius-md)] bg-bg px-[var(--space-300)] py-[var(--space-200)] text-center text-[length:var(--font-size-xs)] text-text shadow-xs">
          <p>{firstDelete?.name ?? "秘书办"}</p>
          <span className="mt-[var(--space-100)] inline-flex rounded-[var(--radius-100)] bg-destructive/10 px-[var(--space-150)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-destructive">
            删除
          </span>
        </div>
      </div>
    </div>
  );
}

function OrganizationPermissionApplicationCard0425({ changes }: { changes: OrgDepartment0425[] }) {
  const [submitted, setSubmitted] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const visibleChanges = changes.length > 0 ? changes : [];

  return (
    <GenericCard
      title="组织机构变更申请"
      titleSuffix={
        submitted ? (
          <span className="rounded-[var(--radius-100)] bg-warning/15 px-[var(--space-150)] py-[var(--space-50)] text-[length:var(--font-size-xxs)] text-warning">
            审批中
          </span>
        ) : undefined
      }
      subtitle={submitted ? "流程编号：ZZJGBGSQ-04251341417530001" : "提交前请确认组织变更内容"}
      className="mt-[var(--space-400)] w-full max-w-none"
    >
      <div className="flex flex-col gap-[var(--space-400)]">
        {!submitted ? (
          <>
            <section className="flex flex-col gap-[var(--space-250)]">
              <p className="border-l-2 border-primary pl-[var(--space-150)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                变更内容
              </p>
              <div className="overflow-hidden rounded-[var(--radius-md)] border border-border">
                <div className="grid grid-cols-[1.6fr_1fr_1fr] bg-bg-tertiary px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-xs)] text-text-secondary">
                  <span>组织名称</span>
                  <span>变更类型</span>
                  <span>操作</span>
                </div>
                <div className="divide-y divide-border">
                  {visibleChanges.map((item) => (
                    <div
                      key={item.id}
                      className="grid grid-cols-[1.6fr_1fr_1fr] px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)]"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-text">{item.name}</p>
                        <p className="mt-[var(--space-50)] truncate text-[length:var(--font-size-xs)] text-text-secondary">
                          {item.companyPath}
                        </p>
                      </div>
                      <div className="flex items-start">
                        <ChangeTypeTag kind={item.pending!} />
                      </div>
                      <span className="text-text-secondary">查看</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-[var(--space-250)]">
              <p className="border-l-2 border-primary pl-[var(--space-150)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                组织机构变更图
              </p>
              <OrganizationChangeGraph0425 changes={visibleChanges} />
            </section>

            <section className="flex flex-col gap-[var(--space-250)]">
              <p className="border-l-2 border-primary pl-[var(--space-150)] text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                变更说明
              </p>
              <div className="space-y-[var(--space-150)]">
                <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
                  变更理由<span className="text-destructive"> *</span>
                </Label>
                <Textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder="请输入"
                  maxLength={200}
                  showCount
                  className="min-h-[var(--space-1600)]"
                />
              </div>
            </section>
          </>
        ) : null}

        <ApprovalProgress0425 submitted={submitted} />

        {!submitted ? (
          <div className="flex justify-end gap-[var(--space-200)] border-t border-border-divider pt-[var(--space-300)]">
            <Button type="button" variant="outline" rounded>
              取消
            </Button>
            <Button
              type="button"
              variant="primary"
              rounded
              onClick={() => {
                if (!reason.trim()) {
                  toast.error("请输入变更理由");
                  return;
                }
                setSubmitted(true);
                toast.success("操作成功", { description: "组织管理变更申请已提交。" });
              }}
            >
              提交
            </Button>
          </div>
        ) : null}
      </div>
    </GenericCard>
  );
}

export function OrganizationManagementCard0425(props?: {
  organizationHeadline?: string;
  /** 标题行下方、副标题上方（如规范演示：卡片内组织切换） */
  titleBelowAccessory?: React.ReactNode;
}) {
  const organizationHeadline = props?.organizationHeadline;
  const titleBelowAccessory = props?.titleBelowAccessory;
  const [departments, setDepartments] = React.useState<OrgDepartment0425[]>(() => cloneInitialDepartments0425());
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({
    pg: true,
    rd: true,
    strategy: true,
  });
  const [drawer, setDrawer] = React.useState<DrawerState>(null);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const [applicationVisible, setApplicationVisible] = React.useState(false);

  const rows = React.useMemo(() => flattenDepartments(departments, expanded), [departments, expanded]);
  const pendingChanges = React.useMemo(() => departments.filter((item) => item.pending), [departments]);
  const drawerTarget = drawer ? departments.find((item) => item.id === drawer.targetId) ?? null : null;
  const drawerParent = drawerTarget ? departments.find((item) => item.id === drawerTarget.parentId) ?? null : null;
  const deleteTarget = deleteTargetId ? departments.find((item) => item.id === deleteTargetId) ?? null : null;

  const resetChanges = () => {
    setDepartments(cloneInitialDepartments0425());
    setApplicationVisible(false);
    toast.message("已恢复", { description: "待提交变更已清空。" });
  };

  const submitDrawer = (values: { name: string; companyPath: string; manager: string }) => {
    if (!drawer || !drawerTarget) return;
    if (drawer.mode === "add") {
      const now = Date.now();
      const next: OrgDepartment0425 = {
        id: `org0425-${now}`,
        parentId: drawerTarget.id,
        name: values.name,
        companyPath: values.companyPath,
        status: "active",
        departmentCount: "0 / 0",
        positionCount: "0 / 0",
        manager: values.manager,
        groupName: "--",
        pending: "add",
      };
      setDepartments((prev) => [...prev, next]);
      setExpanded((prev) => ({ ...prev, [drawerTarget.id]: true }));
    } else {
      setDepartments((prev) =>
        prev.map((item) =>
          item.id === drawerTarget.id
            ? {
                ...item,
                name: values.name,
                companyPath: values.companyPath,
                manager: values.manager,
                pending: item.pending === "add" ? "add" : "edit",
              }
            : item,
        ),
      );
    }
    setApplicationVisible(false);
    setDrawer(null);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    setDepartments((prev) =>
      prev.map((item) =>
        item.id === deleteTarget.id
          ? {
              ...item,
              pending: "delete",
            }
          : item,
      ),
    );
    setApplicationVisible(false);
    setDeleteTargetId(null);
  };

  return (
    <>
      <GenericCard
        title="组织管理"
        titleBelowAccessory={titleBelowAccessory}
        subtitle={
          organizationHeadline
            ? `部门与权限申请 · ${organizationHeadline}`
            : "部门与权限申请"
        }
        className="w-full max-w-none"
      >
        <div className="overflow-hidden rounded-[var(--radius-md)] border border-border bg-bg">
          <div className="grid grid-cols-[1.7fr_0.8fr_1fr_1fr_1.2fr_1.2fr_1fr] items-center bg-bg-tertiary px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-xs)] text-text-secondary">
            <span>组织机构</span>
            <span>状态</span>
            <span>部门(直属/下属)</span>
            <span>岗位(岗位/在职员工)</span>
            <span>主管</span>
            <span>部门群名称</span>
            <span className="text-right">操作</span>
          </div>
          <div className="divide-y divide-border">
            {rows.map((row) => {
              const label = pendingLabel(row.pending);
              return (
                <div
                  key={row.id}
                  className={cn(
                    "grid grid-cols-[1.7fr_0.8fr_1fr_1fr_1.2fr_1.2fr_1fr] items-center px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)] text-text",
                    row.pending && "border-l-2 border-warning bg-warning/10",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-[var(--space-150)]">
                    <span
                      className="shrink-0"
                      style={{ width: `calc(var(--space-500) * ${row.level})` }}
                      aria-hidden
                    />
                    {row.hasChildren ? (
                      <button
                        type="button"
                        className="flex size-[var(--space-500)] shrink-0 items-center justify-center rounded-[var(--radius-100)] text-text-tertiary hover:bg-[var(--black-alpha-11)] hover:text-text"
                        onClick={() => setExpanded((prev) => ({ ...prev, [row.id]: !prev[row.id] }))}
                        aria-label={expanded[row.id] ? "收起部门" : "展开部门"}
                      >
                        {expanded[row.id] ? <ChevronDown className="size-[var(--icon-xs)]" /> : <ChevronRight className="size-[var(--icon-xs)]" />}
                      </button>
                    ) : (
                      <span className="size-[var(--space-500)] shrink-0" aria-hidden />
                    )}
                    <span className="min-w-0 truncate">{row.name}</span>
                  </div>
                  <div className="flex min-w-0 flex-wrap items-center gap-[var(--space-100)]">
                    <StatusTag />
                    {label ? <ChangeTypeTag kind={row.pending!} /> : null}
                  </div>
                  <span className="truncate text-text-secondary">{row.departmentCount}</span>
                  <span className="truncate text-text-secondary">{row.positionCount}</span>
                  <span className="truncate text-text-secondary">{row.manager}</span>
                  <span className="truncate text-text-secondary">{row.groupName}</span>
                  <div className="flex justify-end gap-[var(--space-150)]">
                    <Button
                      type="button"
                      variant="text"
                      size="icon-xs"
                      aria-label="新增子部门"
                      onClick={() => setDrawer({ mode: "add", targetId: row.id })}
                    >
                      <Plus className="size-[var(--icon-xs)]" />
                    </Button>
                    <Button
                      type="button"
                      variant="text"
                      size="icon-xs"
                      aria-label="编辑部门"
                      onClick={() => setDrawer({ mode: "edit", targetId: row.id })}
                    >
                      <Pencil className="size-[var(--icon-xs)]" />
                    </Button>
                    <Button
                      type="button"
                      variant="text"
                      size="icon-xs"
                      aria-label="删除部门"
                      onClick={() => setDeleteTargetId(row.id)}
                    >
                      <Trash2 className="size-[var(--icon-xs)]" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {pendingChanges.length > 0 ? (
          <div className="mt-[var(--space-400)] rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-300)] py-[var(--space-300)]">
            <button
              type="button"
              className="mb-[var(--space-250)] flex items-center gap-[var(--space-150)] text-left text-[length:var(--font-size-sm)] text-text"
            >
              <span>本次共变更 {pendingChanges.length} 条</span>
              <ChevronDown className="size-[var(--icon-xs)] text-text-tertiary" aria-hidden />
            </button>
            <div className="divide-y divide-border rounded-[var(--radius-md)] border border-border">
              {pendingChanges.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-[var(--space-1000)_1.4fr_2fr_1fr] items-center px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)]"
                >
                  <span className="text-text-secondary">{index + 1}</span>
                  <span className="text-text">{item.name}</span>
                  <span className="truncate text-text-secondary">{item.companyPath}</span>
                  <ChangeTypeTag kind={item.pending!} />
                </div>
              ))}
            </div>
            <div className="mt-[var(--space-300)] flex justify-end gap-[var(--space-200)]">
              <Button type="button" variant="outline" rounded onClick={resetChanges}>
                恢复
              </Button>
              <Button
                type="button"
                variant="primary"
                rounded
                onClick={() => {
                  setApplicationVisible(true);
                  toast.message("已生成提交申请", { description: "申请表单已在当前卡片下方展开。" });
                }}
              >
                提交
              </Button>
            </div>
          </div>
        ) : null}
      </GenericCard>

      {applicationVisible ? <OrganizationPermissionApplicationCard0425 changes={pendingChanges} /> : null}

      <Sheet open={drawer !== null && drawerTarget !== null} onOpenChange={(open) => !open && setDrawer(null)}>
        <SheetContent side="right" className={DRAWER_CLASSNAME}>
          <SheetHeader className="border-b border-border px-[var(--space-400)] py-[var(--space-300)]">
            <SheetTitle className="text-[length:var(--font-size-md)] text-text">
              {drawer?.mode === "add" ? "新增子部门" : "编辑部门"}
            </SheetTitle>
            <SheetDescription className="text-[length:var(--font-size-xs)] text-text-tertiary">
              提交后仅标记为待提交状态，不直接生效。
            </SheetDescription>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto bg-bg-secondary px-[max(20px,var(--cui-padding-max))] py-[var(--space-500)]">
            {drawer && drawerTarget ? (
              <OrganizationDepartmentForm0425
                mode={drawer.mode}
                target={drawerTarget}
                parent={drawerParent}
                onCancel={() => setDrawer(null)}
                onSubmit={submitDrawer}
              />
            ) : null}
          </div>
          <SheetFooter className="hidden" />
        </SheetContent>
      </Sheet>

      <AlertDialog open={deleteTarget != null} onOpenChange={(open) => !open && setDeleteTargetId(null)}>
        <AlertDialogContent className="z-[210]">
          <AlertDialogHeader>
            <AlertDialogTitle>删除部门？</AlertDialogTitle>
            <AlertDialogDescription>
              确认后不会直接删除数据，仅将「{deleteTarget?.name ?? "当前部门"}」标记为待提交删除状态。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={confirmDelete}>
              确认删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

