import * as React from "react";
import { Building2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../ui/button";
import { GenericCard } from "../GenericCard";
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
  removeMeetingRoomDemoRecord,
  resetMeetingRoomDemoStore,
  subscribeMeetingRoomDemoStore,
  type MeetingRoomDemoRecord,
} from "./meetingRoomDemoStore";
import { MeetingRoomDemoListSection } from "./meetingRoomDemoList";

export function MeetingRoomAiDemoMainCard({
  messageId: _messageId,
  scrollInPlaceMutatedCardToTop,
  noTenant,
  onDrawerEditRequest,
  onDrawerRoomSettingsRequest,
}: {
  messageId: string;
  scrollInPlaceMutatedCardToTop: () => void;
  noTenant: boolean;
  onDrawerEditRequest: (rec: MeetingRoomDemoRecord) => void;
  onDrawerRoomSettingsRequest: (rec: MeetingRoomDemoRecord) => void;
}) {
  void _messageId;
  const rooms = React.useSyncExternalStore(
    subscribeMeetingRoomDemoStore,
    getMeetingRoomDemoRooms,
    getMeetingRoomDemoRooms,
  );
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const bumpScroll = () => {
    scrollInPlaceMutatedCardToTop();
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    removeMeetingRoomDemoRecord(deleteId);
    toast.success("已删除（演示）");
    setDeleteId(null);
    bumpScroll();
  };

  if (noTenant) {
    return (
      <div className="w-full min-w-0 p-[var(--space-50)]">
        <GenericCard title="全部会议室" className="border border-border">
          <div className="flex flex-col items-center gap-[var(--space-300)] py-[var(--space-600)] text-center">
            <Building2 className="size-[var(--space-800)] text-text-tertiary" aria-hidden />
            <p className="max-w-[320px] text-[length:var(--font-size-sm)] text-text-secondary">
              无法获取当前企业信息，请从应用内打开或重新登录后再试（演示文案）。
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                resetMeetingRoomDemoStore();
                toast("已重置演示数据");
              }}
            >
              重置演示数据
            </Button>
          </div>
        </GenericCard>
      </div>
    );
  }

  return (
    <div className="relative w-full min-w-0 p-[var(--space-50)]">
      <GenericCard title="全部会议室" className="border border-border">
        <MeetingRoomDemoListSection
          rooms={rooms}
          onEdit={(rec) => onDrawerEditRequest(rec)}
          onRoomSettings={(rec) => onDrawerRoomSettingsRequest(rec)}
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
            <AlertDialogDescription>此为演示数据，删除后主界面列表与抽屉内列表将同步更新。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
