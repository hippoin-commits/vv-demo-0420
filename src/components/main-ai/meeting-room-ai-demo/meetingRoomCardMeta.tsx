import * as React from "react";
import type { MeetingRoomDemoRecord } from "./meetingRoomDemoStore";

/** 卡片标题旁元信息：与 GenericCard titleSuffix 搭配，浅灰小字 */
export function MeetingRoomCardTitleMetaText({ text }: { text: string }) {
  return (
    <span className="whitespace-nowrap text-[length:var(--font-size-sm)] font-[var(--font-weight-normal)] leading-[22px] text-text-tertiary">
      {text}
    </span>
  );
}

export function formatMeetingRoomClock(ts: number) {
  return new Date(ts).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
}

/** 非删除态会议室详情：创建后「创建于」；编辑/设置保存后「修改于」 */
export function meetingRoomDetailMetaText(r: MeetingRoomDemoRecord): string {
  const created = r.createdAt ?? r.updatedAt;
  if (r.updatedAt === created) {
    return `创建于 ${formatMeetingRoomClock(created)}`;
  }
  return `修改于 ${formatMeetingRoomClock(r.updatedAt)}`;
}
