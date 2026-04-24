import * as React from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { cn } from "../../ui/utils";
import type { TaskDetailData } from "../taskAppData";

export type TaskFormSnapshot = {
  name: string;
  assignee: string;
  owner: string;
  hours: string;
  dateStart: string;
  dateEnd: string;
  desc: string;
  priority: string;
  type: string;
  difficulty: string;
  phase: string;
  approval: string;
};

export const emptyTaskFormSnapshot = (): TaskFormSnapshot => ({
  name: "",
  assignee: "",
  owner: "",
  hours: "8",
  dateStart: "",
  dateEnd: "",
  desc: "",
  priority: "低",
  type: "需求",
  difficulty: "普通",
  phase: "规划",
  approval: "无需审批",
});

export function snapshotFromDetail(d: TaskDetailData): TaskFormSnapshot {
  const duePlain =
    d.due && !d.due.includes(" ") && /^\d{4}-\d{2}-\d{2}$/.test(d.due) ? d.due : "";
  return {
    name: d.name,
    assignee: d.assignee,
    owner: d.owner,
    hours: String(d.estimatedHours ?? 8),
    dateStart: d.cycleStart ?? "",
    dateEnd: d.cycleEnd ?? duePlain,
    desc: d.description,
    priority: d.priority,
    type: d.type,
    difficulty: "普通",
    phase: d.phase,
    approval: "无需审批",
  };
}

export function snapshotForNewSubtask(parent: TaskDetailData): TaskFormSnapshot {
  return {
    ...emptyTaskFormSnapshot(),
    assignee: parent.assignee,
    owner: parent.owner,
    dateStart: parent.cycleStart ?? "",
    dateEnd: parent.cycleEnd ?? "",
  };
}

const fieldClass =
  "w-full h-[var(--space-900)] px-[var(--space-300)] rounded-[var(--radius-input)] border border-border bg-bg text-[length:var(--font-size-sm)] text-text";

export type TaskFormFieldsHandle = { getSnapshot: () => TaskFormSnapshot };

export const TaskFormFields = React.forwardRef<
  TaskFormFieldsHandle,
  {
    resetKey: string | number;
    initial: TaskFormSnapshot;
    parentTaskName?: string;
    hint?: string;
    /** 为 true 时：输入、选择、辅助按钮等全部禁用（纯文案标签不受影响） */
    readOnly?: boolean;
  }
>(function TaskFormFields({ resetKey, initial, parentTaskName, hint, readOnly = false }, ref) {
  const [name, setName] = React.useState(initial.name);
  const [assignee, setAssignee] = React.useState(initial.assignee);
  const [owner, setOwner] = React.useState(initial.owner);
  const [hours, setHours] = React.useState(initial.hours);
  const [dateStart, setDateStart] = React.useState(initial.dateStart);
  const [dateEnd, setDateEnd] = React.useState(initial.dateEnd);
  const [desc, setDesc] = React.useState(initial.desc);
  const [priority, setPriority] = React.useState(initial.priority);
  const [type, setType] = React.useState(initial.type);
  const [difficulty, setDifficulty] = React.useState(initial.difficulty);
  const [phase, setPhase] = React.useState(initial.phase);
  const [approval, setApproval] = React.useState(initial.approval);

  React.useEffect(() => {
    setName(initial.name);
    setAssignee(initial.assignee);
    setOwner(initial.owner);
    setHours(initial.hours);
    setDateStart(initial.dateStart);
    setDateEnd(initial.dateEnd);
    setDesc(initial.desc);
    setPriority(initial.priority);
    setType(initial.type);
    setDifficulty(initial.difficulty);
    setPhase(initial.phase);
    setApproval(initial.approval);
  }, [resetKey, initial]);

  React.useImperativeHandle(
    ref,
    () => ({
      getSnapshot: (): TaskFormSnapshot => ({
        name,
        assignee,
        owner,
        hours,
        dateStart,
        dateEnd,
        desc,
        priority,
        type,
        difficulty,
        phase,
        approval,
      }),
    }),
    [
      name,
      assignee,
      owner,
      hours,
      dateStart,
      dateEnd,
      desc,
      priority,
      type,
      difficulty,
      phase,
      approval,
    ]
  );

  return (
    <div className="w-full">
      {hint ? (
        <p className="text-[length:var(--font-size-xs)] text-text-secondary mb-[var(--space-400)]">{hint}</p>
      ) : null}
      {parentTaskName ? (
        <div className="mb-[var(--space-400)] rounded-[var(--radius-md)] border border-primary/25 bg-primary/5 px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-xs)] text-text">
          <span className="text-text-secondary">父任务 · </span>
          <span className="font-[var(--font-weight-medium)]">{parentTaskName}</span>
          <span className="text-text-tertiary">（保存后将作为当前任务的子任务）</span>
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-400)] w-full">
        <div className="flex flex-col gap-[var(--space-150)] md:col-span-2">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">任务名称（必填）</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="任务名称"
            maxLength={100}
            readOnly={readOnly}
            disabled={readOnly}
            className={fieldClass}
          />
          <span className="text-[length:var(--font-size-xxs)] text-text-tertiary text-right">{name.length}/100</span>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">优先级</Label>
          <Select value={priority} onValueChange={setPriority} disabled={readOnly}>
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="低">低</SelectItem>
              <SelectItem value="中">中</SelectItem>
              <SelectItem value="高">高</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">布尔项</Label>
          <Select defaultValue="否" disabled={readOnly}>
            <SelectTrigger className={fieldClass}>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="否">否</SelectItem>
              <SelectItem value="是">是</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">执行人（必填）</Label>
          <div className="flex gap-[var(--space-200)]">
            <Input
              value={assignee}
              onChange={(e) => setAssignee(e.target.value)}
              placeholder="选择成员"
              readOnly={readOnly}
              disabled={readOnly}
              className={cn(fieldClass, "flex-1")}
            />
            <Button type="button" variant="secondary" size="sm" className="shrink-0" disabled={readOnly}>
              + 选择
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">负责人</Label>
          <div className="flex gap-[var(--space-200)]">
            <Input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="选择负责人"
              readOnly={readOnly}
              disabled={readOnly}
              className={cn(fieldClass, "flex-1")}
            />
            <Button type="button" variant="secondary" size="sm" className="shrink-0" disabled={readOnly}>
              + 选择
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">预计工时</Label>
          <div className="flex gap-[var(--space-200)] items-center">
            <Input
              type="number"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              readOnly={readOnly}
              disabled={readOnly}
              className={cn(fieldClass, "flex-1")}
            />
            <span className="text-[length:var(--font-size-sm)] text-text-secondary shrink-0">小时</span>
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-150)] md:col-span-2">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">日期范围</Label>
          <div className="flex flex-wrap gap-[var(--space-200)] items-center">
            <Input
              type="date"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
              readOnly={readOnly}
              disabled={readOnly}
              className={cn(fieldClass, "flex-1 min-w-[140px]")}
            />
            <span className="text-text-tertiary">→</span>
            <Input
              type="date"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
              readOnly={readOnly}
              disabled={readOnly}
              className={cn(fieldClass, "flex-1 min-w-[140px]")}
            />
          </div>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">任务类型</Label>
          <Select value={type} onValueChange={setType} disabled={readOnly}>
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="需求">需求</SelectItem>
              <SelectItem value="缺陷">缺陷</SelectItem>
              <SelectItem value="运营">运营</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">任务难度</Label>
          <Select value={difficulty} onValueChange={setDifficulty} disabled={readOnly}>
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="普通">普通</SelectItem>
              <SelectItem value="困难">困难</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-150)]">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">阶段</Label>
          <Select value={phase} onValueChange={setPhase} disabled={readOnly}>
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="规划">规划</SelectItem>
              <SelectItem value="执行">执行</SelectItem>
              <SelectItem value="验收">验收</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-[var(--space-150)] md:col-span-2">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">任务描述</Label>
          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="任务描述"
            maxLength={5000}
            readOnly={readOnly}
            disabled={readOnly}
            className="min-h-[120px] rounded-[var(--radius-md)] border border-border bg-bg px-[var(--space-300)] py-[var(--space-250)] text-[length:var(--font-size-sm)]"
          />
          <span className="text-[length:var(--font-size-xxs)] text-text-tertiary text-right">{desc.length}/5000</span>
        </div>

        <div className="flex flex-col gap-[var(--space-150)] md:col-span-2">
          <button
            type="button"
            disabled={readOnly}
            className="text-left text-[length:var(--font-size-sm)] text-primary hover:underline w-fit disabled:pointer-events-none disabled:opacity-40"
          >
            上传附件
          </button>
          <button
            type="button"
            disabled={readOnly}
            className="text-left text-[length:var(--font-size-sm)] text-primary hover:underline w-fit disabled:pointer-events-none disabled:opacity-40"
          >
            + 添加关联
          </button>
        </div>

        <div className="flex flex-col gap-[var(--space-150)] md:col-span-2">
          <Label className="text-[length:var(--font-size-xs)] text-text-secondary">审批</Label>
          <Select value={approval} onValueChange={setApproval} disabled={readOnly}>
            <SelectTrigger className={fieldClass}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="无需审批">无需审批</SelectItem>
              <SelectItem value="直属上级">直属上级</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
});

TaskFormFields.displayName = "TaskFormFields";
