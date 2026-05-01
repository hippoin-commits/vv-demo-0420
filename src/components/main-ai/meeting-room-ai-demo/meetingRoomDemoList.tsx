import * as React from "react";
import { Pencil, Settings2, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { cn } from "../../ui/utils";
import type { MeetingRoomDemoRecord } from "./meetingRoomDemoStore";

export function meetingRoomStatusPill(open: boolean) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-[var(--space-200)] py-[var(--space-50)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)]",
        open ? "bg-bg-secondary text-primary" : "bg-bg-secondary text-text-tertiary",
      )}
    >
      {open ? "已开放" : "未开放"}
    </span>
  );
}

export function MeetingRoomDemoListSection(props: {
  rooms: MeetingRoomDemoRecord[];
  onEdit: (rec: MeetingRoomDemoRecord) => void;
  onRoomSettings: (rec: MeetingRoomDemoRecord) => void;
  onDeleteRequest: (id: string) => void;
}) {
  const { rooms, onEdit, onRoomSettings, onDeleteRequest } = props;
  const visible = rooms.filter((r) => !r.deleted);

  if (visible.length === 0) {
    return (
      <p className="py-[var(--space-400)] text-center text-[length:var(--font-size-sm)] text-text-secondary">暂无数据</p>
    );
  }

  return (
    <div className="flex w-full flex-col gap-[var(--space-300)]">
      {visible.map((rec) => (
        <div
          key={rec.id}
          className="flex w-full flex-col gap-[var(--space-200)] rounded-[var(--radius-card)] border border-border bg-bg p-[var(--space-300)] pt-[var(--space-350)]"
        >
          <div className="flex items-start justify-between gap-[var(--space-200)]">
            <p className="min-w-0 flex-1 truncate text-[length:var(--font-size-sm)] font-[var(--font-weight-semibold)] text-text">
              {rec.name}
            </p>
            {meetingRoomStatusPill(rec.bookingOpen)}
          </div>
          <dl className="grid w-full grid-cols-[minmax(0,72px)_1fr] gap-x-[var(--space-200)] gap-y-[var(--space-100)] text-[length:var(--font-size-xs)]">
            <dt className="text-text-tertiary">地点</dt>
            <dd className="text-text">{rec.locationPath}</dd>
            <dt className="text-text-tertiary">容纳</dt>
            <dd className="text-text">{rec.capacity} 人</dd>
            <dt className="text-text-tertiary">范围</dt>
            <dd className="text-text">{rec.scopeAll ? "全员可见" : "仅部分人员可见"}</dd>
            <dt className="text-text-tertiary">设备</dt>
            <dd className="text-text">{rec.deviceLabels.length ? rec.deviceLabels.join("、") : "—"}</dd>
            <dt className="text-text-tertiary">备注</dt>
            <dd className="text-text">{rec.remark.trim() ? rec.remark : "—"}</dd>
          </dl>
          <div className="flex justify-end gap-[var(--space-100)] border-t border-border pt-[var(--space-200)]">
            <Button type="button" variant="ghost" size="icon" className="shrink-0" aria-label="编辑" onClick={() => onEdit(rec)}>
              <Pencil className="size-[var(--space-400)] text-text-secondary" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              aria-label="设置"
              onClick={() => onRoomSettings(rec)}
            >
              <Settings2 className="size-[var(--space-400)] text-text-secondary" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="shrink-0" aria-label="删除" onClick={() => onDeleteRequest(rec.id)}>
              <Trash2 className="size-[var(--space-400)] text-text-secondary" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
