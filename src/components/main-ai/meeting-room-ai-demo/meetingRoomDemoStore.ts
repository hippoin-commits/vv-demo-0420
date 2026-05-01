import { MEETING_ROOM_DEMO_SYNC_EVENT } from "../../../constants/meetingRoomAiDemo";

export type MeetingRoomRules = {
  bookingEnabled: boolean;
  visibilityAll: boolean;
  staffIds: string[];
  advanceDays: "1" | "3" | "7";
  dayStart: string;
  dayEnd: string;
  maxMinutes: number | "unlimited";
};

export type MeetingRoomDemoRecord = {
  id: string;
  name: string;
  bookingOpen: boolean;
  locationPath: string;
  capacity: number;
  scopeAll: boolean;
  deviceLabels: string[];
  remark: string;
  orgLabel: string;
  /** 创建时间（演示）；与 `updatedAt` 相等时表示尚未改过，详情标题旁展示「创建于」 */
  createdAt: number;
  updatedAt: number;
  deleted?: boolean;
  rules: MeetingRoomRules;
};

const initialRules = (): MeetingRoomRules => ({
  bookingEnabled: true,
  visibilityAll: true,
  staffIds: [],
  advanceDays: "7",
  dayStart: "09:00",
  dayEnd: "18:00",
  maxMinutes: 120,
});

const seedRooms = (): MeetingRoomDemoRecord[] => [
  {
    id: "mr-demo-a",
    name: "晨曦厅（大）",
    bookingOpen: true,
    locationPath: "中国 / 上海园区 / A 座 / 3F",
    capacity: 20,
    scopeAll: true,
    deviceLabels: ["投影仪", "视频会议"],
    remark: "靠窗，采光好",
    orgLabel: "演示行政组织",
    createdAt: Date.now() - 3600000,
    updatedAt: Date.now() - 3600000,
    rules: initialRules(),
  },
  {
    id: "mr-demo-b",
    name: "静思室（小）",
    bookingOpen: false,
    locationPath: "中国 / 上海园区 / B 座 / 2F",
    capacity: 6,
    scopeAll: false,
    deviceLabels: ["白板"],
    remark: "",
    orgLabel: "演示行政组织",
    createdAt: Date.now() - 7200000,
    updatedAt: Date.now() - 7200000,
    rules: {
      ...initialRules(),
      bookingEnabled: false,
      visibilityAll: false,
      staffIds: ["u1", "u2"],
    },
  },
];

let rooms: MeetingRoomDemoRecord[] = seedRooms();
let tenantRules: MeetingRoomRules = initialRules();

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(MEETING_ROOM_DEMO_SYNC_EVENT));
  }
}

export function subscribeMeetingRoomDemoStore(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getMeetingRoomDemoRooms(): MeetingRoomDemoRecord[] {
  return rooms;
}

export function getMeetingRoomDemoTenantRules(): MeetingRoomRules {
  return tenantRules;
}

export function resetMeetingRoomDemoStore() {
  rooms = seedRooms();
  tenantRules = initialRules();
  emit();
}

export function setMeetingRoomDemoTenantRules(next: MeetingRoomRules) {
  tenantRules = next;
  emit();
}

export function upsertMeetingRoomDemoRecord(rec: MeetingRoomDemoRecord) {
  const i = rooms.findIndex((r) => r.id === rec.id);
  const prev = i >= 0 ? rooms[i] : undefined;
  const merged: MeetingRoomDemoRecord = {
    ...rec,
    createdAt: rec.createdAt ?? prev?.createdAt ?? rec.updatedAt,
  };
  if (i >= 0) {
    rooms = [...rooms.slice(0, i), merged, ...rooms.slice(i + 1)];
  } else {
    rooms = [...rooms, merged];
  }
  emit();
}

export function removeMeetingRoomDemoRecord(id: string) {
  const now = Date.now();
  rooms = rooms.map((r) =>
    r.id === id ? { ...r, deleted: true, bookingOpen: false, updatedAt: now } : r,
  );
  emit();
}

export function patchMeetingRoomDemoRules(roomId: string, rules: MeetingRoomRules) {
  const now = Date.now();
  rooms = rooms.map((r) =>
    r.id === roomId
      ? { ...r, rules, bookingOpen: rules.bookingEnabled, updatedAt: now }
      : r,
  );
  emit();
}

export const MEETING_ROOM_DEMO_DEVICE_OPTIONS = ["投影仪", "视频会议", "白板", "电视"] as const;

export const MEETING_ROOM_DEMO_LOCATION_LEAVES: { id: string; label: string }[] = [
  { id: "loc-a", label: "中国 / 上海园区 / A 座 / 3F" },
  { id: "loc-b", label: "中国 / 上海园区 / B 座 / 2F" },
];
