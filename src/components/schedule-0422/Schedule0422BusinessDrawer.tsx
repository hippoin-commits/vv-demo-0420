import * as React from "react"
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "../ui/sheet"
import { ScrollArea } from "../ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ChatNavBar } from "../chat/ChatNavBar"
import { ChatSender } from "../chat/ChatSender"
import { AssistantChatBubble } from "../chat/ChatWelcome"
import {
  Invite0421DrawerAssistantRow,
  INVITE0421_DRAWER_ASSISTANT_GROUP_STACK_CLASSNAME,
} from "../invite-0421/Invite0421DrawerAssistantRow"
import {
  CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME,
  CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME,
} from "../chat/chatMessageLayout"
import { vvAssistantChatAvatar } from "../vv-app-shell/vv-ai-frame-assets"
import { cn } from "../ui/utils"
import type { Schedule0422Item } from "./schedule0422Model"
import { Schedule0422DetailCard } from "./Schedule0422DetailCard"
import { CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME } from "../../constants/chatBusinessEntryDrawer";

export function Schedule0422BusinessDrawer(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: Schedule0422Item | null
  onItemUpdated: (item: Schedule0422Item) => void
}) {
  const { open, onOpenChange, item, onItemUpdated } = props
  const [drawerInputValue, setDrawerInputValue] = React.useState("")

  if (!item) return null

  const navTitle =
    item.title.length > 22 ? `${item.title.slice(0, 20)}…` : item.title || "日程详情"

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME}>
        <div className="sr-only">
          <SheetTitle>日程详情</SheetTitle>
          <SheetDescription>业务入口 CUI 抽屉</SheetDescription>
        </div>
        <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-cui-bg">
          <ChatNavBar
            title={navTitle}
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
              <Invite0421DrawerAssistantRow
                showAvatar
                avatar={
                  <Avatar className={CHAT_MESSAGE_ASSISTANT_AVATAR_CLASSNAME}>
                    <AvatarImage
                      src={vvAssistantChatAvatar}
                      alt=""
                      className={CHAT_MESSAGE_ASSISTANT_AVATAR_IMAGE_CLASSNAME}
                    />
                    <AvatarFallback className="text-[length:var(--font-size-xs)]">AI</AvatarFallback>
                  </Avatar>
                }
              >
                <AssistantChatBubble>
                  已打开日程详情。可在卡片内编辑或删除；修改会同步到左侧列表。
                </AssistantChatBubble>
              </Invite0421DrawerAssistantRow>
              <Invite0421DrawerAssistantRow showAvatar={false}>
                <Schedule0422DetailCard
                  variant="drawerCui"
                  item={item}
                  onItemUpdated={onItemUpdated}
                  onRequestClose={() => onOpenChange(false)}
                />
              </Invite0421DrawerAssistantRow>
            </div>
          </ScrollArea>
          <div className="relative z-20 w-full flex-none px-[max(20px,var(--cui-padding-max))] pb-[var(--space-400)] pt-0">
            <ChatSender
              inputValue={drawerInputValue}
              setInputValue={setDrawerInputValue}
              handleSendMessage={() => setDrawerInputValue("")}
              handleKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                }
              }}
              placeholder="我可以帮你做什么？"
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
