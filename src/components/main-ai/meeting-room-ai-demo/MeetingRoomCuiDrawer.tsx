import * as React from "react";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../../ui/sheet";
import { ScrollArea } from "../../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ChatNavBar } from "../../chat/ChatNavBar";
import { ChatSender } from "../../chat/ChatSender";
import { AssistantChatBubble } from "../../chat/ChatWelcome";
import {
  Invite0421DrawerAssistantRow,
  INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME,
} from "../../invite-0421/Invite0421DrawerAssistantRow";
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
} from "../../chat/chatMessageLayout";
import { vvAssistantChatAvatar } from "../../vv-app-shell/vv-ai-frame-assets";
import { cn } from "../../ui/utils";
import { CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME } from "../../../constants/chatBusinessEntryDrawer";
import { GenericCard } from "../GenericCard";
import { Button } from "../../ui/button";
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
import { toast } from "sonner";
import {
  getMeetingRoomDemoRooms,
  getMeetingRoomDemoTenantRules,
  MEETING_ROOM_DEMO_DEVICE_OPTIONS,
  MEETING_ROOM_DEMO_LOCATION_LEAVES,
  patchMeetingRoomDemoRules,
  removeMeetingRoomDemoRecord,
  subscribeMeetingRoomDemoStore,
  upsertMeetingRoomDemoRecord,
  type MeetingRoomRules,
} from "./meetingRoomDemoStore";
import { MeetingRoomDemoListSection } from "./meetingRoomDemoList";
import { RulesFormFields, RulesReadonlySummary } from "./meetingRoomRulesUi";
import {
  formatMeetingRoomClock,
  MeetingRoomCardTitleMetaText,
} from "./meetingRoomCardMeta";
import { MeetingRoomDetailCardView, MeetingRoomDetailDeletedCard } from "./meetingRoomDetailCard";

type DrawerSettingsAppendixRound = {
  id: string;
  roomId: string;
  phase: "form" | "summary";
  rulesDraft: MeetingRoomRules;
};

export type MeetingRoomDrawerScene =
  | { type: "view_meetings" }
  | { type: "create"; phase: "form" }
  | { type: "room"; roomId: string; phase: "edit" | "detail" | "settings_form" | "settings_summary" };

function drawerNavTitle(
  scene: MeetingRoomDrawerScene,
  settingsAppendixLen: number,
): string {
  if (
    settingsAppendixLen > 0 &&
    scene.type === "room" &&
    scene.phase === "detail"
  ) {
    return "会议室设置";
  }
  switch (scene.type) {
    case "view_meetings":
      return "查看会议室";
    case "create":
      return "新建会议室";
    case "room":
      if (scene.phase === "edit") return "编辑会议室";
      if (scene.phase === "detail") return "会议室详情";
      return "会议室设置";
    default:
      return "会议室";
  }
}

function narrativeFor(scene: MeetingRoomDrawerScene): string {
  switch (scene.type) {
    case "view_meetings":
      return "以下为当前会议室列表，与主界面数据同源。可在列表行底部进行编辑、设置或删除。";
    case "create":
      return "请填写新建会议室信息；保存后将进入会议室详情浏览态。";
    case "room":
      if (scene.phase === "edit") return "已载入该会议室信息，可直接修改后保存。";
      if (scene.phase === "detail")
        return "以下为会议室详情。从本卡片进入「设置」时，将在下方开启新一轮对话并展示设置表单（演示）。";
      if (scene.phase === "settings_form") return "请调整该会议室的预定规则；保存后展示设置摘要。";
      return "以下为该会议室的预定规则摘要。";
    default:
      return "";
  }
}

export function MeetingRoomCuiDrawer(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scene: MeetingRoomDrawerScene;
  onSceneChange: (next: MeetingRoomDrawerScene) => void;
  /** 新建会议室时「行政组织」默认值（与主界面当前组织一致） */
  defaultOrgLabel: string;
}) {
  const { open, onOpenChange, scene, onSceneChange, defaultOrgLabel } = props;
  const [drawerInputValue, setDrawerInputValue] = React.useState("");
  const rooms = React.useSyncExternalStore(
    subscribeMeetingRoomDemoStore,
    getMeetingRoomDemoRooms,
    getMeetingRoomDemoRooms,
  );
  const [roomRulesDraft, setRoomRulesDraft] = React.useState<MeetingRoomRules>(() =>
    getMeetingRoomDemoTenantRules(),
  );
  const [formName, setFormName] = React.useState("");
  const [formOrg, setFormOrg] = React.useState("");
  const [formLoc, setFormLoc] = React.useState("");
  const [formCap, setFormCap] = React.useState("");
  const [formDevices, setFormDevices] = React.useState<string[]>([]);
  const [formRemark, setFormRemark] = React.useState("");
  const [formUploading, setFormUploading] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);
  /** 仅从「会议室详情」点设置时追加，模拟新一轮对话 */
  const [drawerSettingsRounds, setDrawerSettingsRounds] = React.useState<DrawerSettingsAppendixRound[]>([]);

  const roomRec =
    scene.type === "room" ? rooms.find((r) => r.id === scene.roomId) : undefined;

  const createFormInitRef = React.useRef(false);
  const roomEditFormInitRef = React.useRef("");
  const roomSettingsFormInitRef = React.useRef("");

  React.useEffect(() => {
    if (!open) {
      createFormInitRef.current = false;
      roomEditFormInitRef.current = "";
      roomSettingsFormInitRef.current = "";
      setDrawerSettingsRounds([]);
    }
  }, [open]);

  const roomPhase = scene.type === "room" ? scene.phase : null;
  React.useEffect(() => {
    if (!open) return;
    if (scene.type !== "room" || scene.phase !== "detail") {
      setDrawerSettingsRounds([]);
    }
  }, [open, scene.type, roomPhase]);

  React.useEffect(() => {
    if (!open || scene.type !== "create" || scene.phase !== "form") {
      createFormInitRef.current = false;
      return;
    }
    if (createFormInitRef.current) return;
    createFormInitRef.current = true;
    setFormName("");
    setFormOrg(defaultOrgLabel);
    setFormLoc(MEETING_ROOM_DEMO_LOCATION_LEAVES[0]?.id ?? "");
    setFormCap("10");
    setFormDevices([]);
    setFormRemark("");
  }, [open, scene, defaultOrgLabel]);

  React.useEffect(() => {
    if (!open || scene.type !== "room" || scene.phase !== "edit") {
      roomEditFormInitRef.current = "";
      return;
    }
    if (!roomRec) return;
    const k = `${scene.roomId}-edit`;
    if (roomEditFormInitRef.current === k) return;
    roomEditFormInitRef.current = k;
    setFormName(roomRec.name);
    setFormOrg(roomRec.orgLabel);
    setFormLoc(
      MEETING_ROOM_DEMO_LOCATION_LEAVES.find((l) => l.label === roomRec.locationPath)?.id ??
        MEETING_ROOM_DEMO_LOCATION_LEAVES[0]?.id ??
        "",
    );
    setFormCap(String(roomRec.capacity));
    setFormDevices([...roomRec.deviceLabels]);
    setFormRemark(roomRec.remark);
  }, [open, scene, roomRec]);

  React.useEffect(() => {
    if (!open || scene.type !== "room" || scene.phase !== "settings_form") {
      roomSettingsFormInitRef.current = "";
      return;
    }
    if (!roomRec) return;
    const k = `${scene.roomId}-settings`;
    if (roomSettingsFormInitRef.current === k) return;
    roomSettingsFormInitRef.current = k;
    setRoomRulesDraft(roomRec.rules);
  }, [open, scene, roomRec]);

  const submitRoomForm = (mode: "create" | "edit", roomId: string | null) => {
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
    const id = mode === "create" ? `mr-demo-${now}` : roomId ?? `mr-demo-${now}`;
    const prev = rooms.find((r) => r.id === id);
    upsertMeetingRoomDemoRecord({
      id,
      name: formName.trim(),
      bookingOpen: prev?.bookingOpen ?? true,
      locationPath: locLabel,
      capacity: cap,
      scopeAll: prev?.scopeAll ?? true,
      deviceLabels: [...formDevices],
      remark: formRemark.trim(),
      orgLabel: formOrg.trim() || "—",
      createdAt: mode === "create" ? now : prev?.createdAt ?? now,
      updatedAt: now,
      deleted: false,
      rules: prev?.rules ?? { ...getMeetingRoomDemoTenantRules() },
    });
    toast.success(mode === "create" ? "会议室已创建（演示）" : "已保存（演示）");
    onSceneChange({ type: "room", roomId: id, phase: "detail" });
  };

  const centerCard = (() => {
    if (scene.type === "view_meetings") {
      return (
        <GenericCard title="查看会议室" className="border border-border">
          <MeetingRoomDemoListSection
            rooms={rooms}
            onEdit={(rec) => onSceneChange({ type: "room", roomId: rec.id, phase: "edit" })}
            onRoomSettings={(rec) => onSceneChange({ type: "room", roomId: rec.id, phase: "settings_form" })}
            onDeleteRequest={setDeleteId}
          />
          <p className="mt-[var(--space-300)] text-center text-[length:var(--font-size-xs)] text-text-tertiary">
            已全部加载完
          </p>
        </GenericCard>
      );
    }
    if (scene.type === "create") {
      return (
        <GenericCard title="新建会议室" className="border border-border">
          <div className="flex flex-col gap-[var(--space-300)]">
            <div className="flex flex-col gap-[var(--space-150)]">
              <Label htmlFor="dr-mr-name">会议室名称</Label>
              <Input id="dr-mr-name" value={formName} onChange={(e) => setFormName(e.target.value)} maxLength={80} />
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
              <Label htmlFor="dr-mr-cap">容纳人数</Label>
              <Input id="dr-mr-cap" inputMode="numeric" value={formCap} onChange={(e) => setFormCap(e.target.value)} />
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
              <div className="flex flex-wrap items-center gap-[var(--space-200)]">
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
                {formUploading ? (
                  <span className="text-[length:var(--font-size-xs)] text-text-tertiary">上传中…</span>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-[var(--space-150)]">
              <Label htmlFor="dr-mr-rm">备注</Label>
              <Textarea id="dr-mr-rm" value={formRemark} onChange={(e) => setFormRemark(e.target.value)} maxLength={200} rows={3} />
            </div>
            <div className="flex justify-end border-t border-border pt-[var(--space-250)]">
              <Button type="button" variant="chat-submit" onClick={() => submitRoomForm("create", null)}>
                保存
              </Button>
            </div>
          </div>
        </GenericCard>
      );
    }
    if (scene.type === "room" && roomRec) {
      if (scene.phase === "settings_summary") {
        const metaRoom = rooms.find((x) => x.id === scene.roomId) ?? roomRec;
        return (
          <RulesReadonlySummary
            rules={metaRoom.rules}
            title="会议室设置"
            titleSuffix={
              <MeetingRoomCardTitleMetaText
                text={`修改于 ${formatMeetingRoomClock(metaRoom.updatedAt)}`}
              />
            }
          />
        );
      }
      if (scene.phase === "settings_form") {
        return (
          <GenericCard title="会议室设置" className="border border-border">
            <RulesFormFields value={roomRulesDraft} onChange={setRoomRulesDraft} />
            <div className="mt-[var(--space-300)] flex justify-end gap-[var(--space-150)] border-t border-border pt-[var(--space-250)]">
              <Button
                type="button"
                variant="chat-submit"
                onClick={() => {
                  patchMeetingRoomDemoRules(scene.roomId, roomRulesDraft);
                  toast.success("预定规则已保存（演示）");
                  onSceneChange({ type: "room", roomId: scene.roomId, phase: "settings_summary" });
                }}
              >
                保存
              </Button>
            </div>
          </GenericCard>
        );
      }
      if (scene.phase === "edit") {
        return (
          <GenericCard title="编辑会议室" className="border border-border">
            <div className="flex flex-col gap-[var(--space-300)]">
              <div className="flex flex-col gap-[var(--space-150)]">
                <Label htmlFor="ed-mr-name">会议室名称</Label>
                <Input id="ed-mr-name" value={formName} onChange={(e) => setFormName(e.target.value)} maxLength={80} />
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
                <Label htmlFor="ed-mr-cap">容纳人数</Label>
                <Input id="ed-mr-cap" inputMode="numeric" value={formCap} onChange={(e) => setFormCap(e.target.value)} />
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
                <Label htmlFor="ed-mr-rm">备注</Label>
                <Textarea id="ed-mr-rm" value={formRemark} onChange={(e) => setFormRemark(e.target.value)} maxLength={200} rows={3} />
              </div>
              <div className="flex justify-end border-t border-border pt-[var(--space-250)]">
                <Button type="button" variant="chat-submit" onClick={() => submitRoomForm("edit", scene.roomId)}>
                  保存
                </Button>
              </div>
            </div>
          </GenericCard>
        );
      }
      // detail
      const r = rooms.find((x) => x.id === scene.roomId);
      if (!r) {
        return (
          <GenericCard title="会议室详情" className="border border-border">
            <p className="text-[length:var(--font-size-sm)] text-text-secondary">该会议室不存在。</p>
          </GenericCard>
        );
      }
      if (r.deleted) {
        return <MeetingRoomDetailDeletedCard r={r} />;
      }
      return (
        <MeetingRoomDetailCardView
          r={r}
          onEdit={() => onSceneChange({ type: "room", roomId: r.id, phase: "edit" })}
          onOpenSettings={() => {
            const latest = getMeetingRoomDemoRooms().find((x) => x.id === r.id);
            if (!latest || latest.deleted) return;
            setDrawerSettingsRounds((prev) => [
              ...prev,
              {
                id: `mr-drawer-settings-${Date.now()}`,
                roomId: r.id,
                phase: "form",
                rulesDraft: { ...latest.rules },
              },
            ]);
          }}
          onDeleteRequest={() => setDeleteId(r.id)}
        />
      );
    }
    return null;
  })();

  const drawerTitle = drawerNavTitle(scene, drawerSettingsRounds.length);
  const assistantAvatarBlock = (
    <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
      <AvatarImage
        src={vvAssistantChatAvatar}
        alt=""
        className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME}
      />
      <AvatarFallback className="text-[length:var(--font-size-xs)]">AI</AvatarFallback>
    </Avatar>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME}>
        <div className="sr-only">
          <SheetTitle>{drawerTitle}</SheetTitle>
          <SheetDescription>会议室业务 CUI 对话抽屉</SheetDescription>
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-cui-bg">
          <ChatNavBar
            title={drawerTitle}
            titleOnlyChrome
            showClose
            onClose={() => onOpenChange(false)}
          />
          <ScrollArea className="relative z-10 min-h-0 flex-1">
            <div
              className={cn(
                "mx-auto flex min-h-full w-full max-w-[1920px] flex-col px-[max(20px,var(--cui-padding-max))] py-[var(--space-500)]",
                INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME,
              )}
            >
              <Invite0421DrawerAssistantRow showAvatar avatar={assistantAvatarBlock}>
                <AssistantChatBubble>{narrativeFor(scene)}</AssistantChatBubble>
              </Invite0421DrawerAssistantRow>
              <Invite0421DrawerAssistantRow showAvatar={false}>{centerCard}</Invite0421DrawerAssistantRow>
              {drawerSettingsRounds.map((round) => (
                <React.Fragment key={round.id}>
                  <Invite0421DrawerAssistantRow showAvatar avatar={assistantAvatarBlock}>
                    <AssistantChatBubble>
                      已为本轮对话打开「会议室设置」表单，请在下方调整该会议室的预定规则；保存后将展示规则摘要。
                    </AssistantChatBubble>
                  </Invite0421DrawerAssistantRow>
                  <Invite0421DrawerAssistantRow showAvatar={false}>
                    {round.phase === "form" ? (
                      <GenericCard title="会议室设置" className="border border-border">
                        <RulesFormFields
                          value={round.rulesDraft}
                          onChange={(next) =>
                            setDrawerSettingsRounds((p) =>
                              p.map((x) => (x.id === round.id ? { ...x, rulesDraft: next } : x)),
                            )
                          }
                        />
                        <div className="mt-[var(--space-300)] flex justify-end gap-[var(--space-150)] border-t border-border pt-[var(--space-250)]">
                          <Button
                            type="button"
                            variant="chat-submit"
                            onClick={() => {
                              patchMeetingRoomDemoRules(round.roomId, round.rulesDraft);
                              toast.success("预定规则已保存（演示）");
                              setDrawerSettingsRounds((p) =>
                                p.map((x) => (x.id === round.id ? { ...x, phase: "summary" } : x)),
                              );
                            }}
                          >
                            保存
                          </Button>
                        </div>
                      </GenericCard>
                    ) : (
                      (() => {
                        const rr = rooms.find((x) => x.id === round.roomId);
                        const u = rr?.updatedAt ?? Date.now();
                        return (
                          <RulesReadonlySummary
                            rules={rr?.rules ?? round.rulesDraft}
                            title="会议室设置"
                            titleSuffix={
                              <MeetingRoomCardTitleMetaText
                                text={`修改于 ${formatMeetingRoomClock(u)}`}
                              />
                            }
                          />
                        );
                      })()
                    )}
                  </Invite0421DrawerAssistantRow>
                </React.Fragment>
              ))}
            </div>
          </ScrollArea>
          <div className="relative z-20 w-full flex-none px-[max(20px,var(--cui-padding-max))] pb-[var(--space-400)] pt-0">
            <ChatSender
              inputValue={drawerInputValue}
              setInputValue={setDrawerInputValue}
              handleSendMessage={() => setDrawerInputValue("")}
              handleKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                }
              }}
              placeholder="我可以帮你做什么？"
            />
          </div>
        </div>
      </SheetContent>

      <AlertDialog open={deleteId != null} onOpenChange={(o) => !o && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除会议室？</AlertDialogTitle>
            <AlertDialogDescription>此为演示数据。删除后主界面列表将同步更新。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const id = deleteId;
                if (!id) return;
                const deletedFromDetail =
                  scene.type === "room" && scene.phase === "detail" && scene.roomId === id;
                removeMeetingRoomDemoRecord(id);
                toast.success("已删除（演示）");
                setDeleteId(null);
                if (deletedFromDetail) {
                  setDrawerSettingsRounds([]);
                  return;
                }
                if (scene.type === "room" && scene.roomId === id) {
                  onSceneChange({ type: "view_meetings" });
                }
              }}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
}
