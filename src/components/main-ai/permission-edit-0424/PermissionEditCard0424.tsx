import * as React from "react";
import { toast } from "sonner";
import { GenericCard } from "../GenericCard";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Button } from "../../ui/button";
import { Switch } from "../../ui/switch";
import { Checkbox } from "../../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { cn } from "../../ui/utils";
import {
  formatPermissionDetailSubmittedAt0424,
  type PermissionEditDetailPayload0424,
} from "../../../constants/permissionEditCard0424";

const FIELD_CLASS =
  "w-full h-[var(--space-900)] px-[var(--space-300)] rounded-[var(--radius-input)] border border-border bg-bg text-[length:var(--font-size-sm)] text-text";

const DEFAULT_FORM: Omit<PermissionEditDetailPayload0424, never> = {
  flowName: "预算审批",
  bizType: "finance-budget",
  flowNumberPrefix: "YSSP",
  flowStatus: "enabled",
  company: "palogino",
  coverSubsidiaries: true,
  processGroup: "admin",
  relatedPolicy: "",
  flowDescription: "",
  dedupeMode: "once",
  revokeInProgress: true,
  revokeCompletedDays: 30,
  revokeCompletedEnabled: false,
};

function FormDesignImmersiveModal0424({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex max-h-[min(calc(100vh-var(--space-1200)),92vh)] h-[min(calc(100vh-var(--space-1200)),92vh)] w-[min(calc(100vw-var(--space-1000)),96vw)] max-w-none translate-x-[-50%] translate-y-[-50%] flex-col gap-0 p-0",
        )}
      >
        <DialogHeader className="shrink-0 border-b border-border px-[var(--space-400)] py-[var(--space-300)] !pr-[var(--space-400)]">
          <div className="flex w-full min-w-0 items-center justify-between gap-[var(--space-300)]">
            <DialogTitle className="text-left text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text">
              表单设计（演示）
            </DialogTitle>
            <Button
              type="button"
              variant="primary"
              rounded
              className="h-[var(--space-1000)] shrink-0 px-[var(--space-400)] text-[length:var(--font-size-sm)]"
              onClick={() => onOpenChange(false)}
            >
              完成
            </Button>
          </div>
          <p className="mt-[var(--space-150)] text-left text-[length:var(--font-size-xs)] text-text-tertiary">
            三栏布局：组件库｜画布｜属性设置。关闭即回到对话卡片。
          </p>
        </DialogHeader>
        <div className="grid min-h-0 flex-1 grid-cols-1 divide-y divide-border border-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <aside className="flex min-h-0 flex-col gap-[var(--space-200)] overflow-y-auto p-[var(--space-300)] lg:max-h-full">
            <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">常用组件</p>
            <div className="flex flex-col gap-[var(--space-250)] text-[length:var(--font-size-xs)] text-text-secondary">
              <div>
                <p className="mb-[var(--space-100)] text-text">机构</p>
                <ul className="space-y-[var(--space-100)]">
                  <li>组织单元</li>
                  <li>行政公司</li>
                </ul>
              </div>
              <div>
                <p className="mb-[var(--space-100)] text-text">数值</p>
                <ul className="space-y-[var(--space-100)]">
                  <li>数字</li>
                  <li>金额</li>
                </ul>
              </div>
              <div>
                <p className="mb-[var(--space-100)] text-text">文本</p>
                <ul className="space-y-[var(--space-100)]">
                  <li>输入框</li>
                  <li>多行文本</li>
                </ul>
              </div>
            </div>
          </aside>
          <section className="flex min-h-0 flex-col gap-[var(--space-300)] overflow-y-auto bg-bg-secondary p-[var(--space-400)] lg:max-h-full">
            <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">画布</p>
            <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-bg p-[var(--space-300)] text-[length:var(--font-size-sm)] text-text-secondary">
              请输入
            </div>
            <div className="rounded-[var(--radius-card)] border border-dashed border-border bg-bg p-[var(--space-300)]">
              <p className="text-[length:var(--font-size-xs)] text-text-secondary">关联流程</p>
              <Button type="button" variant="outline" size="sm" className="mt-[var(--space-200)]">
                + 添加流程
              </Button>
            </div>
            <div className="space-y-[var(--space-150)] rounded-[var(--radius-card)] border border-border bg-bg p-[var(--space-300)]">
              <Label className="text-text">预算总金额</Label>
              <div className="flex gap-[var(--space-200)]">
                <Select defaultValue="cny">
                  <SelectTrigger className={cn(FIELD_CLASS, "w-[var(--space-2000)] shrink-0")}>
                    <SelectValue placeholder="币种" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cny">CNY-人民币</SelectItem>
                  </SelectContent>
                </Select>
                <Input readOnly className={FIELD_CLASS} placeholder="0.00" />
              </div>
            </div>
            <div className="rounded-[var(--radius-md)] border-2 border-primary bg-bg p-[var(--space-300)] ring-1 ring-primary/20">
              <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">多选项（当前选中）</p>
              <p className="mt-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-tertiary">与右侧属性面板联动（演示）</p>
            </div>
          </section>
          <aside className="flex min-h-0 flex-col gap-[var(--space-300)] overflow-y-auto p-[var(--space-300)] lg:max-h-full">
            <p className="text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-text-secondary">属性设置</p>
            <div className="space-y-[var(--space-150)]">
              <Label className="text-text-secondary">选项格式</Label>
              <RadioGroup defaultValue="dropdown" className="flex flex-col gap-[var(--space-150)]">
                <label className="flex cursor-pointer items-center gap-[var(--space-200)]">
                  <RadioGroupItem value="dropdown" id="fmt-drop" />
                  <span className="text-[length:var(--font-size-sm)] text-text">下拉</span>
                </label>
                <label className="flex cursor-pointer items-center gap-[var(--space-200)]">
                  <RadioGroupItem value="flat" id="fmt-flat" />
                  <span className="text-[length:var(--font-size-sm)] text-text">平铺</span>
                </label>
              </RadioGroup>
            </div>
            <div className="space-y-[var(--space-150)]">
              <Label htmlFor="pe0424-title" className="text-text-secondary">
                标题
              </Label>
              <Input id="pe0424-title" defaultValue="多选项" className={FIELD_CLASS} />
            </div>
            <div className="space-y-[var(--space-150)]">
              <Label htmlFor="pe0424-ph" className="text-text-secondary">
                提示文字
              </Label>
              <Input id="pe0424-ph" defaultValue="请选择" className={FIELD_CLASS} />
            </div>
            <div className="flex flex-col gap-[var(--space-150)]">
              <label className="flex cursor-pointer items-center gap-[var(--space-200)]">
                <Checkbox defaultChecked id="pe0424-req" />
                <span className="text-[length:var(--font-size-sm)] text-text">必填</span>
              </label>
              <label className="flex cursor-pointer items-center gap-[var(--space-200)]">
                <Checkbox id="pe0424-print" />
                <span className="text-[length:var(--font-size-sm)] text-text">参与打印</span>
              </label>
            </div>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}

type FlowNodeId = "init" | "cc" | "c1" | "def" | "end";

function FlowDesignImmersiveModal0424({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selected, setSelected] = React.useState<FlowNodeId | null>(null);

  React.useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  const nodes: { id: FlowNodeId; title: string; body: string; selectable: boolean }[] = [
    { id: "init", title: "发起权限", body: "全体员工", selectable: true },
    { id: "cc", title: "抄送人", body: "部门主管", selectable: true },
    { id: "c1", title: "条件 1", body: "按发起事件", selectable: true },
    { id: "def", title: "默认条件", body: "其他情况进入此流程", selectable: true },
    { id: "end", title: "流程结束", body: "", selectable: false },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "flex max-h-[min(calc(100vh-var(--space-1200)),92vh)] h-[min(calc(100vh-var(--space-1200)),92vh)] w-[min(calc(100vw-var(--space-1000)),96vw)] max-w-none translate-x-[-50%] translate-y-[-50%] flex-col gap-0 overflow-hidden p-0",
        )}
      >
        <DialogHeader className="shrink-0 border-b border-border px-[var(--space-400)] py-[var(--space-300)] !pr-[var(--space-400)]">
          <div className="flex w-full min-w-0 items-center justify-between gap-[var(--space-300)]">
            <DialogTitle className="text-left text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text">
              流程设计（演示）
            </DialogTitle>
            <Button
              type="button"
              variant="primary"
              rounded
              className="h-[var(--space-1000)] shrink-0 px-[var(--space-400)] text-[length:var(--font-size-sm)]"
              onClick={() => onOpenChange(false)}
            >
              完成
            </Button>
          </div>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-row">
          <div
            className="relative min-w-0 flex-1 overflow-auto bg-bg-secondary p-[var(--space-400)]"
            style={{
              backgroundImage:
                "radial-gradient(circle, var(--color-border) var(--space-50), transparent var(--space-50))",
              backgroundSize: "var(--space-300) var(--space-300)",
            }}
          >
            <p className="mb-[var(--space-400)] text-center text-[length:var(--font-size-xs)] text-text-tertiary">
              审批流配置（点击节点在右侧打开配置）
            </p>
            <div className="mx-auto flex w-full max-w-[min(100%,36rem)] flex-col items-center gap-[var(--space-300)]">
              {nodes.map((n) => (
                <React.Fragment key={n.id}>
                  {n.selectable ? (
                    <button
                      type="button"
                      onClick={() => setSelected(n.id)}
                      className={cn(
                        "w-full max-w-[min(100%,32rem)] rounded-[var(--radius-card)] border bg-bg p-0 text-left shadow-xs transition-colors",
                        selected === n.id
                          ? "border-primary ring-2 ring-primary/25"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <div className="rounded-t-[var(--radius-card)] bg-primary px-[var(--space-300)] py-[var(--space-150)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] text-primary-foreground">
                        {n.title}
                      </div>
                      <div className="px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)] text-text">
                        {n.body}
                      </div>
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-tertiary">
                      <span className="size-[var(--space-300)] rounded-full border-2 border-border" aria-hidden />
                      {n.title}
                    </div>
                  )}
                  {n.id !== "end" ? (
                    <div className="flex h-[var(--space-400)] w-px bg-border" aria-hidden />
                  ) : null}
                </React.Fragment>
              ))}
            </div>
          </div>
          {selected && selected !== "end" ? (
            <aside className="flex w-[min(100%,calc(var(--space-800)*11))] max-w-[40%] shrink-0 flex-col border-l border-border bg-bg">
              <div className="border-b border-border px-[var(--space-300)] py-[var(--space-250)]">
                <p className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
                  {nodes.find((x) => x.id === selected)?.title ?? "节点"}
                </p>
                <p className="mt-[var(--space-100)] text-[length:var(--font-size-xs)] text-text-tertiary">
                  弹窗内侧边栏（演示）
                </p>
              </div>
              <div className="flex flex-1 flex-col gap-[var(--space-300)] overflow-y-auto p-[var(--space-300)]">
                {selected === "cc" ? (
                  <>
                    <div className="flex gap-[var(--space-200)] border-b border-border pb-[var(--space-200)] text-[length:var(--font-size-xs)]">
                      <span className="border-b-2 border-primary pb-[var(--space-100)] font-[var(--font-weight-medium)] text-text">
                        设置抄送人
                      </span>
                      <span className="text-text-tertiary">表单权限</span>
                    </div>
                    <RadioGroup defaultValue="dept-mgr" className="flex flex-col gap-[var(--space-200)]">
                      {[
                        ["指定岗位", "post"],
                        ["指定部门", "dept"],
                        ["部门主管", "dept-mgr"],
                        ["表单联系人主管", "contact"],
                        ["发起人", "starter"],
                      ].map(([label, value]) => (
                        <label key={value} className="flex cursor-pointer items-start gap-[var(--space-200)]">
                          <RadioGroupItem value={value} id={`cc-${value}`} className="mt-[var(--space-50)]" />
                          <span className="text-[length:var(--font-size-sm)] text-text">{label}</span>
                        </label>
                      ))}
                    </RadioGroup>
                    <div className="grid grid-cols-1 gap-[var(--space-200)] sm:grid-cols-2">
                      <Select defaultValue="btu">
                        <SelectTrigger className={FIELD_CLASS}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="btu">从下至上</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="direct">
                        <SelectTrigger className={FIELD_CLASS}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="direct">直属部门主管</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <p className="text-[length:var(--font-size-xs)] leading-relaxed text-text-secondary">
                      当抄送人为空或离岗时，按规则逐级上送（演示文案）。
                    </p>
                  </>
                ) : (
                  <p className="text-[length:var(--font-size-sm)] text-text-secondary">
                    此节点的字段配置为占位演示。可与真实产品字段对齐。
                  </p>
                )}
              </div>
              <DialogFooter className="!mt-0 shrink-0 border-t border-border p-[var(--space-300)] sm:flex-row sm:justify-end sm:gap-[var(--space-200)]">
                <Button type="button" variant="outline" rounded onClick={() => setSelected(null)}>
                  取消
                </Button>
                <Button type="button" variant="primary" rounded onClick={() => setSelected(null)}>
                  确定
                </Button>
              </DialogFooter>
            </aside>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PermissionEditCard0424({
  onReplaceWithDetail,
  onScrollMutatedCardToTop,
  titleBelowAccessory,
}: {
  onReplaceWithDetail: (payload: PermissionEditDetailPayload0424) => void;
  onScrollMutatedCardToTop: () => void;
  titleBelowAccessory?: React.ReactNode;
}) {
  const [form, setForm] = React.useState<PermissionEditDetailPayload0424>({ ...DEFAULT_FORM });
  const [formDesignOpen, setFormDesignOpen] = React.useState(false);
  const [flowDesignOpen, setFlowDesignOpen] = React.useState(false);

  const resetLocal = () => {
    setForm({ ...DEFAULT_FORM });
    toast.message("已重置", { description: "表单已恢复为演示默认值。" });
  };

  const saveDraft = () => {
    toast.message("存草稿", { description: "已保存草稿（演示，未提交服务端）。" });
  };

  const submit = () => {
    onScrollMutatedCardToTop();
    onReplaceWithDetail({ ...form, submittedAtMs: Date.now() });
  };

  return (
    <>
      <GenericCard
        title="权限编辑"
        subtitle="预算审批流程"
        titleBelowAccessory={titleBelowAccessory}
        className="w-full max-w-[min(100%,length:calc(var(--space-800)*15)))]"
      >
        <p className="text-[length:var(--font-size-xs)] text-text-secondary">
          演示：将原 GUI 三步向导收束为一张对话卡片；「表单设计」「流程设计」在沉浸式弹窗中操作。
        </p>

        <div className="mt-[var(--space-400)] flex w-full flex-col gap-[var(--space-400)]">
          <div className="space-y-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">业务类型</Label>
            <Select
              value={form.bizType}
              onValueChange={(v) => setForm((s) => ({ ...s, bizType: v }))}
            >
              <SelectTrigger className={FIELD_CLASS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance-budget">财务 - 预算审批</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-x-[var(--space-400)] gap-y-[var(--space-350)]">
            <div className="space-y-[var(--space-150)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
                流程名称<span className="text-destructive"> *</span>
              </Label>
              <Input
                value={form.flowName}
                onChange={(e) => setForm((s) => ({ ...s, flowName: e.target.value }))}
                className={FIELD_CLASS}
              />
            </div>
            <div className="space-y-[var(--space-150)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
                流程编号前缀<span className="text-destructive"> *</span>
              </Label>
              <Input
                value={form.flowNumberPrefix}
                onChange={(e) => setForm((s) => ({ ...s, flowNumberPrefix: e.target.value }))}
                className={FIELD_CLASS}
              />
            </div>
            <div className="space-y-[var(--space-150)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
                图标<span className="text-destructive"> *</span>
              </Label>
              <div className="flex min-h-[var(--space-900)] items-center gap-[var(--space-200)]">
                <span
                  className="flex size-[var(--space-900)] shrink-0 items-center justify-center rounded-[var(--radius-150)] bg-error/10 text-[length:var(--font-size-md)] text-error"
                  aria-hidden
                >
                  审
                </span>
                <Button
                  type="button"
                  variant="outline"
                  rounded
                  className="h-[var(--space-900)] px-[var(--space-300)] text-[length:var(--font-size-sm)]"
                >
                  选择图标
                </Button>
              </div>
            </div>
            <div className="space-y-[var(--space-150)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
                流程状态<span className="text-destructive"> *</span>
              </Label>
              <RadioGroup
                value={form.flowStatus}
                onValueChange={(v) =>
                  setForm((s) => ({ ...s, flowStatus: v as PermissionEditDetailPayload0424["flowStatus"] }))
                }
                className="flex flex-row flex-wrap gap-[var(--space-300)]"
              >
                <label className="flex cursor-pointer items-center gap-[var(--space-150)]">
                  <RadioGroupItem value="enabled" id="st-on" />
                  <span className="text-[length:var(--font-size-sm)] text-text">启用</span>
                </label>
                <label className="flex cursor-pointer items-center gap-[var(--space-150)]">
                  <RadioGroupItem value="disabled" id="st-off" />
                  <span className="text-[length:var(--font-size-sm)] text-text">停用</span>
                </label>
              </RadioGroup>
            </div>
            <div className="space-y-[var(--space-150)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
                适用公司<span className="text-destructive"> *</span>
              </Label>
              <Select value={form.company} onValueChange={(v) => setForm((s) => ({ ...s, company: v }))}>
                <SelectTrigger className={FIELD_CLASS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="palogino">PaloGino 环球科技集团</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-[var(--space-150)]">
              <Label htmlFor="pe0424-cover" className="text-[length:var(--font-size-xs)] text-text-secondary">
                是否覆盖子公司
              </Label>
              <div className="flex min-h-[var(--space-900)] items-center">
                <Switch
                  id="pe0424-cover"
                  checked={form.coverSubsidiaries}
                  onCheckedChange={(v) => setForm((s) => ({ ...s, coverSubsidiaries: v }))}
                />
              </div>
            </div>
            <div className="space-y-[var(--space-150)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary">
                流程分组<span className="text-destructive"> *</span>
              </Label>
              <Select value={form.processGroup} onValueChange={(v) => setForm((s) => ({ ...s, processGroup: v }))}>
                <SelectTrigger className={FIELD_CLASS}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">行政流程</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-[var(--space-150)]">
              <Label className="text-[length:var(--font-size-xs)] text-text-secondary">关联制度</Label>
              <Select
                value={form.relatedPolicy || "unset"}
                onValueChange={(v) => setForm((s) => ({ ...s, relatedPolicy: v === "unset" ? "" : v }))}
              >
                <SelectTrigger className={FIELD_CLASS}>
                  <SelectValue placeholder="请选择" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unset">请选择</SelectItem>
                  <SelectItem value="a1">制度 A（演示）</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-[var(--space-150)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">流程说明</Label>
            <Textarea
              value={form.flowDescription}
              onChange={(e) => setForm((s) => ({ ...s, flowDescription: e.target.value }))}
              placeholder="请输入"
              maxLength={1000}
              showCount
              className="min-h-[length:calc(var(--space-900)*3)]"
            />
          </div>

          <div className="space-y-[var(--space-200)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">审批去重</Label>
            <RadioGroup
              value={form.dedupeMode}
              onValueChange={(v) =>
                setForm((s) => ({ ...s, dedupeMode: v as PermissionEditDetailPayload0424["dedupeMode"] }))
              }
              className="flex flex-col gap-[var(--space-200)]"
            >
              <label className="flex cursor-pointer items-start gap-[var(--space-200)]">
                <RadioGroupItem value="once" id="dd-1" className="mt-[var(--space-50)]" />
                <span className="text-[length:var(--font-size-sm)] text-text leading-snug">
                  仅审批一次，后续重复的审批节点均自动同意
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-[var(--space-200)]">
                <RadioGroupItem value="consecutive" id="dd-2" className="mt-[var(--space-50)]" />
                <span className="text-[length:var(--font-size-sm)] text-text leading-snug">
                  仅针对连续审批的节点自动同意
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-[var(--space-200)]">
                <RadioGroupItem value="none" id="dd-3" className="mt-[var(--space-50)]" />
                <span className="text-[length:var(--font-size-sm)] text-text leading-snug">
                  不自动同意，每个节点都需要审批
                </span>
              </label>
            </RadioGroup>
            <button type="button" className="text-left text-[length:var(--font-size-xs)] text-primary underline-offset-2 hover:underline">
              去重规则失效说明
            </button>
          </div>

          <div className="space-y-[var(--space-200)]">
            <Label className="text-[length:var(--font-size-xs)] text-text-secondary">撤销设置</Label>
            <label className="flex cursor-pointer items-start gap-[var(--space-200)]">
              <Checkbox
                checked={form.revokeInProgress}
                onCheckedChange={(v) => setForm((s) => ({ ...s, revokeInProgress: v === true }))}
                id="rv1"
              />
              <span className="text-[length:var(--font-size-sm)] text-text">允许撤销处理中的流程</span>
            </label>
            <label className="flex flex-wrap cursor-pointer items-center gap-[var(--space-200)]">
              <Checkbox
                checked={form.revokeCompletedEnabled}
                onCheckedChange={(v) => setForm((s) => ({ ...s, revokeCompletedEnabled: v === true }))}
                id="rv2"
              />
              <span className="text-[length:var(--font-size-sm)] text-text">允许撤销</span>
              <Input
                type="number"
                min={1}
                max={365}
                disabled={!form.revokeCompletedEnabled}
                value={form.revokeCompletedDays}
                onChange={(e) =>
                  setForm((s) => ({ ...s, revokeCompletedDays: Number(e.target.value) || 30 }))
                }
                wrapperClassName="!flex-none"
                className={cn(FIELD_CLASS, "h-[var(--space-800)] w-[var(--space-1600)] px-[var(--space-200)]")}
              />
              <span className="text-[length:var(--font-size-sm)] text-text">天内已完成的流程</span>
            </label>
          </div>

          <div className="flex w-full flex-col gap-[length:var(--space-700)]">
            <Button
              type="button"
              variant="outline"
              rounded
              className="h-auto min-h-[var(--space-1200)] w-full flex-col gap-[var(--space-150)] py-[var(--space-400)] text-[length:var(--font-size-md)] font-[var(--font-weight-medium)]"
              onClick={() => setFormDesignOpen(true)}
            >
              表单设计
              <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] text-text-tertiary">
                在三栏弹窗中编辑表单（演示）
              </span>
            </Button>
            <Button
              type="button"
              variant="outline"
              rounded
              className="h-auto min-h-[var(--space-1200)] w-full flex-col gap-[var(--space-150)] py-[var(--space-400)] text-[length:var(--font-size-md)] font-[var(--font-weight-medium)]"
              onClick={() => setFlowDesignOpen(true)}
            >
              流程设计
              <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] text-text-tertiary">
                在画布弹窗中配置节点（演示）
              </span>
            </Button>
          </div>
        </div>

        <div className="mt-[var(--space-500)] flex w-full min-w-0 flex-wrap items-stretch gap-[var(--space-300)] border-t border-border-divider pt-[var(--space-400)] sm:flex-nowrap">
          <div className="flex flex-wrap items-center gap-[var(--space-300)] shrink-0">
            <Button
              type="button"
              variant="chat-reset"
              className="h-[var(--space-1000)] w-fit shrink-0 px-[var(--space-400)]"
              onClick={resetLocal}
            >
              重置
            </Button>
            <Button
              type="button"
              variant="chat-reset"
              className="h-[var(--space-1000)] w-fit shrink-0 px-[var(--space-400)]"
              onClick={saveDraft}
            >
              存草稿
            </Button>
          </div>
          <Button
            type="button"
            variant="chat-submit"
            className="h-[var(--space-1000)] min-w-0 flex-1 px-[var(--space-400)]"
            onClick={submit}
          >
            提交
          </Button>
        </div>
      </GenericCard>

      <FormDesignImmersiveModal0424 open={formDesignOpen} onOpenChange={setFormDesignOpen} />
      <FlowDesignImmersiveModal0424 open={flowDesignOpen} onOpenChange={setFlowDesignOpen} />
    </>
  );
}

const BIZ_LABEL: Record<string, string> = {
  "finance-budget": "财务 - 预算审批",
};

const COMPANY_LABEL: Record<string, string> = {
  palogino: "PaloGino 环球科技集团",
};

const GROUP_LABEL: Record<string, string> = {
  admin: "行政流程",
};

export function PermissionDetailCard0424({
  payload,
  titleBelowAccessory,
}: {
  payload: PermissionEditDetailPayload0424;
  titleBelowAccessory?: React.ReactNode;
}) {
  const rows: { k: string; v: string }[] = [
    { k: "业务类型", v: BIZ_LABEL[payload.bizType] ?? payload.bizType },
    { k: "流程名称", v: payload.flowName },
    { k: "流程编号前缀", v: payload.flowNumberPrefix },
    { k: "流程状态", v: payload.flowStatus === "enabled" ? "启用" : "停用" },
    { k: "适用公司", v: COMPANY_LABEL[payload.company] ?? payload.company },
    { k: "覆盖子公司", v: payload.coverSubsidiaries ? "是" : "否" },
    { k: "流程分组", v: GROUP_LABEL[payload.processGroup] ?? payload.processGroup },
    { k: "关联制度", v: payload.relatedPolicy || "—" },
    { k: "流程说明", v: payload.flowDescription.trim() || "—" },
    {
      k: "审批去重",
      v:
        payload.dedupeMode === "once"
          ? "仅审批一次…"
          : payload.dedupeMode === "consecutive"
            ? "仅连续节点自动同意"
            : "不自动同意",
    },
    {
      k: "撤销",
      v: [
        payload.revokeInProgress ? "可撤处理中" : "",
        payload.revokeCompletedEnabled ? `可撤完成后 ${payload.revokeCompletedDays} 天内` : "",
      ]
        .filter(Boolean)
        .join("；") || "—",
    },
  ];

  const submittedLabel =
    typeof payload.submittedAtMs === "number" && Number.isFinite(payload.submittedAtMs)
      ? formatPermissionDetailSubmittedAt0424(payload.submittedAtMs)
      : null;

  return (
    <GenericCard
      title="权限详情"
      titleSuffix={
        submittedLabel ? (
          <span className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-normal)]">
            {submittedLabel}
          </span>
        ) : undefined
      }
      titleBelowAccessory={titleBelowAccessory}
      subtitle={payload.flowName}
      className="w-full max-w-[min(100%,length:calc(var(--space-800)*15)))]"
    >
      <p className="text-[length:var(--font-size-xs)] text-text-secondary">以下为刚才在编辑卡片中确认的演示快照。</p>
      <dl className="mt-[var(--space-400)] grid w-full grid-cols-1 gap-[var(--space-300)] sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.k} className="min-w-0 rounded-[var(--radius-md)] border border-border bg-bg-secondary px-[var(--space-300)] py-[var(--space-250)]">
            <dt className="text-[length:var(--font-size-xs)] text-text-tertiary">{r.k}</dt>
            <dd className="mt-[var(--space-100)] text-[length:var(--font-size-sm)] text-text whitespace-pre-wrap break-words">
              {r.v}
            </dd>
          </div>
        ))}
      </dl>
    </GenericCard>
  );
}
