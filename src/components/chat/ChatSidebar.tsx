import * as React from "react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  useSidebar
} from "../ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Conversation } from "./data"
import { AddIcon, SidebarIcon } from "./SidebarIcons"

interface ChatSidebarProps extends React.ComponentProps<typeof Sidebar> {
  conversations: Conversation[]
  selectedId: string
  onSelect: (id: string) => void
}

export function ChatSidebar({ conversations, selectedId, onSelect, ...props }: ChatSidebarProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <Sidebar {...props}>
      <SidebarHeader className="h-[52px] flex items-center justify-between px-[16px] flex-row border-b border-[rgba(245,246,247,1)] bg-[rgba(250,251,252,1)]">
        <span className="text-[16px] font-semibold leading-[22px] text-[#333]">历史对话</span>
        <button 
          onClick={toggleSidebar}
          className="p-0 h-auto w-auto bg-transparent border-none cursor-pointer hover:bg-transparent focus:outline-none"
          title="关闭侧边栏"
        >
          <SidebarIcon />
        </button>
      </SidebarHeader>
      <SidebarContent className="bg-[rgba(250,251,252,1)]">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {conversations.map((conversation) => (
                <SidebarMenuItem key={conversation.id}>
                  <SidebarMenuButton
                    isActive={selectedId === conversation.id}
                    onClick={() => onSelect(conversation.id)}
                    className="h-auto py-[12px] px-[16px] hover:bg-[rgba(242,244,247,1)] data-[active=true]:bg-[rgba(238,244,254,1)]"
                  >
                    <div className="flex items-start gap-[10px] w-full">
                       <Avatar className="h-[32px] w-[32px] mt-[2px]">
                        <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
                        <AvatarFallback>{conversation.user.name.substring(0,2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start gap-[2px] flex-1 overflow-hidden">
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[14px] font-medium leading-[20px] text-[#333] truncate">
                              {conversation.user.name}
                          </span>
                          <span className="text-[12px] leading-[18px] text-[#999] whitespace-nowrap">
                            {conversation.messages[conversation.messages.length - 1]?.timestamp}
                          </span>
                        </div>
                        <span className="text-[12px] leading-[18px] text-[#666] truncate w-full text-left">
                           {conversation.messages[conversation.messages.length - 1]?.content}
                        </span>
                      </div>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}