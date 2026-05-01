import * as React from "react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { GenericCard } from "../GenericCard";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
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
import {
  getMeetingRoomDemoRooms,
  getMeetingRoomDemoTenantRules,
  MEETING_ROOM_DEMO_DEVICE_OPTIONS,
  MEETING_ROOM_DEMO_LOCATION_LEAVES,
  removeMeetingRoomDemoRecord,
  subscribeMeetingRoomDemoStore,
  upsertMeetingRoomDemoRecord,
  type MeetingRoomDemoRecord,
} from "./meetingRoomDemoStore";
import { MeetingRoomDemoListSection } from "./meetingRoomDemoList";
import { MeetingRoomDetailCardView, MeetingRoomDetailDeletedCard } from "./meetingRoomDetailCard";

/** 底栏「查看会议室」：一楼对话卡片 */
export function MeetingRoomViewListOneFCard(props: {
  messageId: string;
  scrollInPlaceMutatedCardToTop: () => void;
  onDrawerEditRequest: (rec: MeetingRoomDemoRecord) => void;
  onDrawerRoomSettingsRequest: (rec: MeetingRoomDemoRecord) => void;
}) {
  void props.messageId;
  const rooms = React.useSyncExternalStore(
    subscribeMeetingRoomDemoStore,
    getMeetingRoomDemoRooms,
    getMeetingRoomDemoRooms,
  );
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const bump = () => props.scrollInPlaceMutatedCardToTop();

  return (
    <div className="relative w-full min-w-0 p-[var(--space-50)]">
      <GenericCard title="查看会议室" className="border border-border">
        <MeetingRoomDemoListSection
          rooms={rooms}
          onEdit={(rec) => props.onDrawerEditRequest(rec)}
          onRoomSettings={(rec) => props.onDrawerRoomSettingsRequest(rec)}
          onDeleteRequest={setDeleteId}
        />
        <p className="mt-[var(--space-300)] text-center text-[length:var(--font-size-xs)] text-text-tertiary">
          已全部加载完
        </p>
      </GenericCard>
      <AlertDialog open={deleteId != null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除会议室？</AlertDialogTitle>
            <AlertDialogDescription>此为演示数据；删除后主界面「全部会议室」列表将同步更新。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!deleteId) return;
                removeMeetingRoomDemoRecord(deleteId);
                toast.success("已删除（演示）");
                setDeleteId(null);
                bump();
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** 底栏「新建会议室」：一楼对话卡片（保存后在本卡内展示详情） */
export function MeetingRoomCreateOneFCard(props: {
  defaultOrgLabel: string;
  scrollInPlaceMutatedCardToTop: () => void;
  onDrawerEditRequest: (rec: MeetingRoomDemoRecord) => void;
  onDrawerRoomSettingsRequest: (rec: MeetingRoomDemoRecord) => void;
}) {
  const { defaultOrgLabel, scrollInPlaceMutatedCardToTop, onDrawerEditRequest, onDrawerRoomSettingsRequest } =
    props;
  const rooms = React.useSyncExternalStore(
    subscribeMeetingRoomDemoStore,
    getMeetingRoomDemoRooms,
    getMeetingRoomDemoRooms,
  );
  const [phase, setPhase] = React.useState<"form" | "detail">("form");
  const [detailId, setDetailId] = React.useState<string | null>(null);

  const [formName, setFormName] = React.useState("");
  const [formOrg, setFormOrg] = React.useState(defaultOrgLabel);
  const [formLoc, setFormLoc] = React.useState(MEETING_ROOM_DEMO_LOCATION_LEAVES[0]?.id ?? "");
  const [formCap, setFormCap] = React.useState("10");
  const [formDevices, setFormDevices] = React.useState<string[]>([]);
  const [formRemark, setFormRemark] = React.useState("");
  const [formUploading, setFormUploading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (phase === "form") {
      setFormName("");
      setFormOrg(defaultOrgLabel);
      setFormLoc(MEETING_ROOM_DEMO_LOCATION_LEAVES[0]?.id ?? "");
      setFormCap("10");
      setFormDevices([]);
      setFormRemark("");
    }
  }, [phase, defaultOrgLabel]);

  const submit = () => {
    if (formUploading) {
      toast("请等待上传完成（演示）");
      return;
    }
    if (!formName.trim()) {
      toast("请填写会议室名称");
      return;
    }
    if (!formLoc) {
      toast("请选择所在位置");
      return;
    }
    const cap = parseInt(formCap, 10);
    if (!Number.isFinite(cap) || cap <= 0) {
      toast("请填写有效容纳人数");
      return;
    }
    const locLabel = MEETING_ROOM_DEMO_LOCATION_LEAVES.find((l) => l.id === formLoc)?.label ?? "";
    const now = Date.now();
    const id = `mr-demo-${now}`;
    const tenant = getMeetingRoomDemoTenantRules();
    upsertMeetingRoomDemoRecord({
      id,
      name: formName.trim(),
      bookingOpen: tenant.bookingEnabled,
      locationPath: locLabel,
      capacity: cap,
      scopeAll: true,
      deviceLabels: [...formDevices],
      remark: formRemark.trim(),
      orgLabel: formOrg.trim() || "—",
      createdAt: now,
      updatedAt: now,
      deleted: false,
      rules: { ...tenant },
    });
    toast.success("会议室已创建（演示）");
    setDetailId(id);
    setPhase("detail");
    scrollInPlaceMutatedCardToTop();
  };

  const r = detailId ? rooms.find((x) => x.id === detailId) : undefined;
  const bump = () => scrollInPlaceMutatedCardToTop();

  if (phase === "detail" && r) {
    return (
      <div className="relative w-full min-w-0 p-[var(--space-50)]">
        {r.deleted ? (
          <MeetingRoomDetailDeletedCard r={r} />
        ) : (
          <MeetingRoomDetailCardView
            r={r}
            onEdit={() => onDrawerEditRequest(r)}
            onOpenSettings={() => onDrawerRoomSettingsRequest(r)}
            onDeleteRequest={() => setDeleteId(r.id)}
          />
        )}
        <AlertDialog open={deleteId != null} onOpenChange={(o) => !o && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>删除会议室？</AlertDialogTitle>
              <AlertDialogDescription>此为演示数据；删除后主界面「全部会议室」列表将同步更新。</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>取消</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (!deleteId) return;
                  removeMeetingRoomDemoRecord(deleteId);
                  toast.success("已删除（演示）");
                  setDeleteId(null);
                  bump();
                }}
              >
                删除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <GenericCard title="新建会议室" className="border border-border">
      <div className="flex flex-col gap-[var(--space-300)]">
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label htmlFor="onef-mr-name">会议室名称</Label>
          <Input id="onef-mr-name" value={formName} onChange={(e) => setFormName(e.target.value)} maxLength={80} />
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label>会议室归属（行政组织）</Label>
          <Input value={formOrg} onChange={(e) => setFormOrg(e.target.value)} />
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label>所在位置</Label>
          <Select value={formLoc} onValueChange={setFormLoc}>
            <SelectTrigger>
              <SelectValue placeholder="请选择" />
            </SelectTrigger>
            <SelectContent>
              {MEETING_ROOM_DEMO_LOCATION_LEAVES.map((l) => (
                <SelectItem key={l.id} value={l.id}>
                  {l.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label htmlFor="onef-mr-cap">容纳人数</Label>
          <Input id="onef-mr-cap" inputMode="numeric" value={formCap} onChange={(e) => setFormCap(e.target.value)} />
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label>设备</Label>
          <div className="flex flex-wrap gap-[var(--space-200)]">
            {MEETING_ROOM_DEMO_DEVICE_OPTIONS.map((d) => (
              <label key={d} className="inline-flex items-center gap-[var(--space-100)]">
                <Checkbox
                  checked={formDevices.includes(d)}
                  onCheckedChange={() =>
                    setFormDevices((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]))
                  }
                />
                <span className="text-[length:var(--font-size-sm)] text-text">{d}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label>图片 / 封面（演示）</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setFormUploading(true);
              window.setTimeout(() => {
                setFormUploading(false);
                toast.success("上传完成（演示）");
              }, 900);
            }}
          >
            模拟上传
          </Button>
        </div>
        <div className="flex flex-col gap-[var(--space-150)]">
          <Label htmlFor="onef-mr-rm">备注</Label>
          <Textarea id="onef-mr-rm" value={formRemark} onChange={(e) => setFormRemark(e.target.value)} maxLength={200} rows={3} />
        </div>
        <div className="flex justify-end border-t border-border pt-[var(--space-250)]">
          <Button type="button" variant="chat-submit" onClick={submit}>
            保存
          </Button>
        </div>
      </div>
    </GenericCard>
  );
}
