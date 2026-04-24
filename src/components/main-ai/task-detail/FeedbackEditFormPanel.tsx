import * as React from "react";
import {
  Pencil,
  ClipboardList,
  Layers,
  UserPlus,
  User,
  LayoutGrid,
  AlertCircle,
  Flag,
  LayoutTemplate,
  Hexagon,
  Globe,
  ListTodo,
  CheckSquare,
  Paperclip,
  X,
  ChevronDown,
} from "lucide-react";
import { cn } from "../../ui/utils";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import type { FeedbackListItem } from "./feedbackTypes";

function FieldRow({
  icon: Icon,
  children,
  className,
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex gap-[var(--space-300)] items-start w-full", className)}>
      <div className="w-5 shrink-0 pt-[10px] text-text-tertiary flex justify-center">
        <Icon className="size-[18px]" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-[var(--space-150)]">{children}</div>
    </div>
  );
}

function ChipRemovable({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 max-w-full rounded-[var(--radius-md)] border border-border bg-bg-secondary px-[var(--space-200)] py-[var(--space-100)] text-[length:var(--font-size-xs)] text-text">
      <span className="truncate">{children}</span>
      <button
        type="button"
        onClick={onRemove}
        className="shrink-0 rounded p-0.5 text-text-tertiary hover:text-text hover:bg-[var(--black-alpha-11)]"
        aria-label="移除"
      >
        <X className="size-3.5" />
      </button>
    </span>
  );
}

/** 抽屉内「编辑反馈」表单，布局对齐设计稿（图标左列 + 控件右列） */
export function FeedbackEditFormPanel({
  item,
  taskName,
  onCancel,
  onConfirm,
  /** 为 true 时不渲染底部按钮（由抽屉吸底栏承载；与弹窗/卡片「主按钮在右」区分） */
  hideFooter = false,
}: {
  item: FeedbackListItem;
  taskName: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  hideFooter?: boolean;
}) {
  const [title, setTitle] = React.useState(item.title);
  const [body, setBody] = React.useState(
    item.body || "（演示）可在此补充说明与截图说明。"
  );
  const [taskTag] = React.useState(`【财务管理】-S5- ${taskName.slice(0, 12)}…`);
  const [assigneeName] = React.useState("卫永辉");
  const [assigneeSeed] = React.useState("wei");
  const [showPcTag, setShowPcTag] = React.useState(true);
  const [issueCategory] = React.useState("业务代码逻辑错误");
  const [feedbackType, setFeedbackType] = React.useState(item.feedbackType || "Bug");
  const [severity, setSeverity] = React.useState("一般");
  const [priority, setPriority] = React.useState("优先级中");
  const [env, setEnv] = React.useState("测试环境");
  const [stage, setStage] = React.useState("UI/UE/产品验收");
  const [repro, setRepro] = React.useState("必现");

  const fieldBox = "rounded-[var(--radius-md)] border border-border bg-bg text-[length:var(--font-size-sm)]";

  return (
    <div className="flex flex-col gap-[var(--space-500)] px-[var(--space-400)] py-[var(--space-400)] pb-[var(--space-400)]">
      {/* 标题 */}
      <FieldRow icon={Pencil}>
        <Label className="text-[length:var(--font-size-xs)] text-text-tertiary sr-only">
          标题
        </Label>
        <div className="relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, 100))}
            placeholder="此处默认要显示灰色提示，和报错的内容一致"
            className={cn(fieldBox, "h-10 pr-16")}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[length:var(--font-size-xxs)] text-text-tertiary tabular-nums pointer-events-none">
            {title.length} / 100
          </span>
        </div>
      </FieldRow>

      {/* 富文本区 */}
      <FieldRow icon={ClipboardList}>
        <div className={cn("flex flex-col border border-border rounded-[var(--radius-md)] overflow-hidden bg-bg")}>
          <div className="flex flex-wrap gap-x-3 gap-y-1 px-[var(--space-250)] py-[var(--space-200)] border-b border-border bg-bg-secondary text-[length:var(--font-size-xxs)] text-text-secondary">
            <span>字号</span>
            <span className="font-[var(--font-weight-semi-bold)]">A</span>
            <span className="font-[var(--font-weight-semi-bold)]">B</span>
            <span className="italic">I</span>
            <span className="underline">U</span>
            <span className="line-through">S</span>
            <span>• 列表</span>
            <span>1. 列表</span>
            <span>「」</span>
            <span className="text-primary">链接</span>
            <span>—</span>
          </div>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value.slice(0, 5000))}
            placeholder="请输入反馈详情"
            className="min-h-[200px] border-0 rounded-none resize-y text-[length:var(--font-size-sm)] focus-visible:ring-0"
          />
          <div className="flex items-center justify-between px-[var(--space-250)] py-[var(--space-200)] border-t border-border bg-bg">
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[length:var(--font-size-xs)] text-primary hover:underline"
            >
              <Paperclip className="size-3.5" />
              上传附件
            </button>
            <span className="text-[length:var(--font-size-xxs)] text-text-tertiary tabular-nums">
              {body.length} / 5000
            </span>
          </div>
        </div>
      </FieldRow>

      {/* 任务 */}
      <FieldRow icon={Layers}>
        <div className="flex flex-col gap-[var(--space-150)]">
          <div className="flex items-center gap-2 text-[length:var(--font-size-xs)] text-text-secondary">
            <span>任务</span>
            <ChevronDown className="size-3.5 opacity-70" strokeWidth={2} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ChipRemovable>{taskTag}</ChipRemovable>
            <Button type="button" variant="secondary" size="sm" className="h-8 rounded-[var(--radius-md)] text-[length:var(--font-size-xs)]">
              + 选择
            </Button>
          </div>
        </div>
      </FieldRow>

      {/* 经办人 */}
      <FieldRow icon={UserPlus}>
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-md)] border border-border bg-bg-secondary pl-1 pr-1 py-0.5 text-[length:var(--font-size-xs)]">
            <Avatar className="size-5">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${assigneeSeed}`} />
              <AvatarFallback>{assigneeName[0]}</AvatarFallback>
            </Avatar>
            <span>{assigneeName}</span>
            <button type="button" className="p-0.5 rounded text-text-tertiary hover:text-text" aria-label="移除">
              <X className="size-3" />
            </button>
          </span>
          <Button type="button" variant="secondary" size="sm" className="h-8 rounded-[var(--radius-md)] text-[length:var(--font-size-xs)]">
            + 选择
          </Button>
        </div>
      </FieldRow>

      {/* 参与人 */}
      <FieldRow icon={User}>
        <div className="flex flex-wrap items-center gap-2">
          <Input readOnly placeholder="参与人" className={cn(fieldBox, "h-10 flex-1 min-w-[120px]")} />
          <Button type="button" variant="secondary" size="sm" className="h-8 rounded-[var(--radius-md)] text-[length:var(--font-size-xs)] shrink-0">
            + 选择
          </Button>
        </div>
      </FieldRow>

      {/* 反馈类型 */}
      <FieldRow icon={LayoutGrid}>
        <Label className="text-[length:var(--font-size-xs)] text-text-tertiary sr-only">反馈类型</Label>
        <Select value={feedbackType} onValueChange={setFeedbackType}>
          <SelectTrigger className={cn(fieldBox, "h-10")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Bug">Bug</SelectItem>
            <SelectItem value="建议">建议</SelectItem>
            <SelectItem value="优化/建议">优化/建议</SelectItem>
            <SelectItem value="问题">问题</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>

      {/* 严重度 | 优先级 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)] gap-y-[var(--space-500)]">
        <FieldRow icon={AlertCircle}>
          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className={cn(fieldBox, "h-10")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="一般">一般</SelectItem>
              <SelectItem value="严重">严重</SelectItem>
              <SelectItem value="轻微">轻微</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow icon={Flag}>
          <Select value={priority} onValueChange={setPriority}>
            <SelectTrigger className={cn(fieldBox, "h-10")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="优先级中">优先级中</SelectItem>
              <SelectItem value="优先级高">优先级高</SelectItem>
              <SelectItem value="优先级低">优先级低</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
      </div>

      {/* 平台 | 问题分类 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)] gap-y-[var(--space-500)]">
        <FieldRow icon={LayoutTemplate}>
          <div className="flex flex-wrap items-center gap-2">
            {showPcTag ? (
              <span className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-border bg-bg-secondary px-2 py-1 text-[length:var(--font-size-xs)]">
                PC
                <button
                  type="button"
                  onClick={() => setShowPcTag(false)}
                  className="text-text-tertiary hover:text-text"
                  aria-label="移除"
                >
                  <X className="size-3" />
                </button>
              </span>
            ) : (
              <span className="text-[length:var(--font-size-xs)] text-text-tertiary">未选择</span>
            )}
          </div>
        </FieldRow>
        <FieldRow icon={Hexagon}>
          <div className="flex items-center gap-2">
            <Input
              readOnly
              value={issueCategory}
              className={cn(fieldBox, "h-10 flex-1")}
            />
            <button type="button" className="shrink-0 p-1 text-text-tertiary hover:text-text rounded" aria-label="清除">
              <X className="size-4" />
            </button>
          </div>
        </FieldRow>
      </div>

      {/* 环境 | 阶段 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)] gap-y-[var(--space-500)]">
        <FieldRow icon={Globe}>
          <Select value={env} onValueChange={setEnv}>
            <SelectTrigger className={cn(fieldBox, "h-10")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="测试环境">测试环境</SelectItem>
              <SelectItem value="预生产环境">预生产环境</SelectItem>
              <SelectItem value="生产环境">生产环境</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
        <FieldRow icon={ListTodo}>
          <Select value={stage} onValueChange={setStage}>
            <SelectTrigger className={cn(fieldBox, "h-10")}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UI/UE/产品验收">UI/UE/产品验收</SelectItem>
              <SelectItem value="功能测试">功能测试</SelectItem>
              <SelectItem value="走查阶段">走查阶段</SelectItem>
            </SelectContent>
          </Select>
        </FieldRow>
      </div>

      {/* 必现 */}
      <FieldRow icon={CheckSquare}>
        <Select value={repro} onValueChange={setRepro}>
          <SelectTrigger className={cn(fieldBox, "h-10")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="必现">必现</SelectItem>
            <SelectItem value="偶现">偶现</SelectItem>
            <SelectItem value="仅一次">仅一次</SelectItem>
          </SelectContent>
        </Select>
      </FieldRow>

      {/* 责任人 */}
      <FieldRow icon={User}>
        <div className="flex flex-wrap items-center gap-2">
          <Input readOnly placeholder="责任人" className={cn(fieldBox, "h-10 flex-1 min-w-[120px]")} />
          <Button type="button" variant="secondary" size="sm" className="h-8 rounded-[var(--radius-md)] text-[length:var(--font-size-xs)] shrink-0">
            + 选择
          </Button>
        </div>
      </FieldRow>

      {/* 底部按钮（非抽屉场景：左取消 chat-reset，右确定 chat-submit 占满右侧，同卡片表单底栏规范） */}
      {!hideFooter ? (
        <div className="flex w-full min-w-0 flex-wrap items-stretch gap-[var(--space-300)] border-t border-border-divider pt-[var(--space-400)] sm:flex-nowrap">
          <Button type="button" variant="chat-reset" className="h-10 w-fit shrink-0 px-4" onClick={onCancel}>
            取消
          </Button>
          <Button
            type="button"
            variant="chat-submit"
            className="h-10 min-w-0 flex-1 px-4 sm:min-w-[88px]"
            onClick={onConfirm}
          >
            确定
          </Button>
        </div>
      ) : null}
    </div>
  );
}
