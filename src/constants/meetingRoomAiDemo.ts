/** 交互规范：会议室 AI 演示 — 消息标记与同步事件名 */

export const MEETING_ROOM_AI_DEMO_USER_TRIGGER = "打开会议室管理演示";

export const MEETING_ROOM_AI_DEMO_MAIN_MARKER = "<<<MEETING_ROOM_AI_DEMO_MAIN>>>" as const;

/** 底栏「查看会议室」→ 一楼对话卡片 */
export const MEETING_ROOM_AI_DEMO_VIEW_LIST_MARKER = "<<<MEETING_ROOM_AI_DEMO_VIEW_LIST>>>" as const;

/** 底栏「新建会议室」→ 一楼对话卡片 */
export const MEETING_ROOM_AI_DEMO_CREATE_INLINE_MARKER = "<<<MEETING_ROOM_AI_DEMO_CREATE_INLINE>>>" as const;

/** 列表 / 详情 / 规则保存 / 删除 后广播，订阅方刷新 */
export const MEETING_ROOM_DEMO_SYNC_EVENT = "meeting-room-demo-sync-v1" as const;
