import * as React from "react";
import { GenericCard } from "../GenericCard";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import type { MeetingRoomRules } from "./meetingRoomDemoStore";

export function RulesFormFields(props: {
  value: MeetingRoomRules;
  onChange: (next: MeetingRoomRules) => void;
}) {
  const { value: rulesDraft, onChange: setRulesDraft } = props;
  return (
    <div className="flex w-full flex-col gap-[var(--space-300)]">
      <label className="flex items-center gap-[var(--space-150)] text-[length:var(--font-size-sm)] text-text">
        <Checkbox
          checked={rulesDraft.bookingEnabled}
          onCheckedChange={(v) => setRulesDraft({ ...rulesDraft, bookingEnabled: v === true })}
        />
        开放预定
      </label>
      <div className="flex flex-col gap-[var(--space-150)]">
        <Label>谁可以预定</Label>
        <Select
          value={rulesDraft.visibilityAll ? "all" : "partial"}
          onValueChange={(v) =>
            setRulesDraft({
              ...rulesDraft,
              visibilityAll: v === "all",
              staffIds: v === "all" ? [] : rulesDraft.staffIds,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全员</SelectItem>
            <SelectItem value="partial">指定部分人（演示）</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-[var(--space-150)]">
        <Label>最早可提前</Label>
        <Select
          value={rulesDraft.advanceDays}
          onValueChange={(v) =>
            setRulesDraft({ ...rulesDraft, advanceDays: v as MeetingRoomRules["advanceDays"] })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 天</SelectItem>
            <SelectItem value="3">3 天</SelectItem>
            <SelectItem value="7">1 周</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-2 gap-[var(--space-200)]">
        <div className="flex flex-col gap-[var(--space-100)]">
          <Label>每日开始</Label>
          <Input
            type="time"
            value={rulesDraft.dayStart}
            onChange={(e) => setRulesDraft({ ...rulesDraft, dayStart: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-[var(--space-100)]">
          <Label>每日结束</Label>
          <Input
            type="time"
            value={rulesDraft.dayEnd}
            onChange={(e) => setRulesDraft({ ...rulesDraft, dayEnd: e.target.value })}
          />
        </div>
      </div>
      <div className="flex flex-col gap-[var(--space-150)]">
        <Label>单次最长</Label>
        <Select
          value={rulesDraft.maxMinutes === "unlimited" ? "unlimited" : String(rulesDraft.maxMinutes)}
          onValueChange={(v) =>
            setRulesDraft({
              ...rulesDraft,
              maxMinutes: v === "unlimited" ? "unlimited" : parseInt(v, 10),
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unlimited">不限制</SelectItem>
            <SelectItem value="30">30 分钟</SelectItem>
            <SelectItem value="60">1 小时</SelectItem>
            <SelectItem value="120">2 小时</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function RulesReadonlySummary({
  rules,
  title,
  titleSuffix,
}: {
  rules: MeetingRoomRules;
  title: string;
  titleSuffix?: React.ReactNode;
}) {
  return (
    <GenericCard title={title} titleSuffix={titleSuffix} className="border border-border">
      <dl className="grid w-full grid-cols-[minmax(0,100px)_1fr] gap-x-[var(--space-200)] gap-y-[var(--space-150)] text-[length:var(--font-size-sm)]">
        <dt className="text-text-tertiary">开放预定</dt>
        <dd className="text-text">{rules.bookingEnabled ? "是" : "否"}</dd>
        <dt className="text-text-tertiary">可见范围</dt>
        <dd className="text-text">{rules.visibilityAll ? "全员" : "指定部分人"}</dd>
        <dt className="text-text-tertiary">最早可提前</dt>
        <dd className="text-text">{rules.advanceDays} 天档</dd>
        <dt className="text-text-tertiary">每日时段</dt>
        <dd className="text-text">
          {rules.dayStart} — {rules.dayEnd}
        </dd>
        <dt className="text-text-tertiary">单次最长</dt>
        <dd className="text-text">{rules.maxMinutes === "unlimited" ? "不限制" : `${rules.maxMinutes} 分钟`}</dd>
      </dl>
    </GenericCard>
  );
}
