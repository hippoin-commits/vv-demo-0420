import { Pencil, Settings2, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { GenericCard } from "../GenericCard";
import type { MeetingRoomDemoRecord } from "./meetingRoomDemoStore";
import { meetingRoomStatusPill } from "./meetingRoomDemoList";
import {
  formatMeetingRoomClock,
  MeetingRoomCardTitleMetaText,
  meetingRoomDetailMetaText,
} from "./meetingRoomCardMeta";

/** 会议室详情（非删除态）：一楼对话卡与二楼抽屉共用 */
export function MeetingRoomDetailCardView(props: {
  r: MeetingRoomDemoRecord;
  onEdit: () => void;
  onOpenSettings: () => void;
  onDeleteRequest: () => void;
}) {
  const { r, onEdit, onOpenSettings, onDeleteRequest } = props;
  return (
    <GenericCard
      title="会议室详情"
      titleSuffix={<MeetingRoomCardTitleMetaText text={meetingRoomDetailMetaText(r)} />}
      className="border border-border"
    >
      <div className="flex flex-col gap-[var(--space-300)]">
        <div className="flex flex-wrap items-center justify-between gap-[var(--space-200)] border-b border-border pb-[var(--space-250)]">
          <h3 className="m-0 text-[length:var(--font-size-lg)] font-[var(--font-weight-semibold)] text-text">{r.name}</h3>
          {meetingRoomStatusPill(r.bookingOpen)}
        </div>
        <dl className="grid w-full grid-cols-[minmax(0,72px)_1fr] gap-x-[var(--space-200)] gap-y-[var(--space-150)] text-[length:var(--font-size-sm)]">
          <dt className="text-text-tertiary">地点</dt>
          <dd className="text-text">{r.locationPath}</dd>
          <dt className="text-text-tertiary">容纳人数</dt>
          <dd className="text-text">{r.capacity} 人</dd>
          <dt className="text-text-tertiary">适用范围</dt>
          <dd className="text-text">{r.scopeAll ? "全员可见" : "仅部分人员可见"}</dd>
          <dt className="text-text-tertiary">设备</dt>
          <dd className="text-text">{r.deviceLabels.length ? r.deviceLabels.join("、") : "—"}</dd>
          <dt className="text-text-tertiary">备注</dt>
          <dd className="text-text">{r.remark.trim() ? r.remark : "—"}</dd>
        </dl>
        <div className="flex justify-end gap-[var(--space-100)] border-t border-border pt-[var(--space-250)]">
          <Button type="button" variant="ghost" size="icon" aria-label="编辑" onClick={onEdit}>
            <Pencil className="size-[var(--space-400)] text-text-secondary" />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="设置" onClick={onOpenSettings}>
            <Settings2 className="size-[var(--space-400)] text-text-secondary" />
          </Button>
          <Button type="button" variant="ghost" size="icon" aria-label="删除" onClick={onDeleteRequest}>
            <Trash2 className="size-[var(--space-400)] text-text-secondary" />
          </Button>
        </div>
      </div>
    </GenericCard>
  );
}

/** 会议室详情（删除态）：与抽屉内展示一致 */
export function MeetingRoomDetailDeletedCard(props: { r: MeetingRoomDemoRecord }) {
  const { r } = props;
  return (
    <GenericCard
      title="会议室详情"
      titleSuffix={
        <MeetingRoomCardTitleMetaText text={`已删除 ${formatMeetingRoomClock(r.updatedAt)}`} />
      }
      className="border border-border"
    >
      <div className="flex flex-col gap-[var(--space-300)]">
        <div className="border-b border-border pb-[var(--space-250)]">
          <h3 className="m-0 text-[length:var(--font-size-lg)] font-[var(--font-weight-semibold)] text-text line-through">
            {r.name}
          </h3>
        </div>
        <dl className="grid w-full grid-cols-[minmax(0,72px)_1fr] gap-x-[var(--space-200)] gap-y-[var(--space-150)] text-[length:var(--font-size-sm)]">
          <dt className="text-text-tertiary line-through">地点</dt>
          <dd className="text-text line-through">{r.locationPath}</dd>
          <dt className="text-text-tertiary line-through">容纳人数</dt>
          <dd className="text-text line-through">{r.capacity} 人</dd>
          <dt className="text-text-tertiary line-through">适用范围</dt>
          <dd className="text-text line-through">{r.scopeAll ? "全员可见" : "仅部分人员可见"}</dd>
          <dt className="text-text-tertiary line-through">设备</dt>
          <dd className="text-text line-through">{r.deviceLabels.length ? r.deviceLabels.join("、") : "—"}</dd>
          <dt className="text-text-tertiary line-through">备注</dt>
          <dd className="text-text line-through">{r.remark.trim() ? r.remark : "—"}</dd>
        </dl>
      </div>
    </GenericCard>
  );
}
