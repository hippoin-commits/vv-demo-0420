import * as React from "react"
import { SidebarProvider, SidebarInset } from "./ui/sidebar"
import { ChatSidebar } from "./chat/ChatSidebar"
import { ChatWindow } from "./chat/ChatWindow"
import { conversations } from "./chat/data"

export function ChatView({ onClose }: { onClose?: () => void }) {
  const [selectedId, setSelectedId] = React.useState(conversations[0].id)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const selectedConversation = conversations.find(c => c.id === selectedId) || conversations[0]

  return (
    <>
      <SidebarProvider defaultOpen={false}>
        <SidebarInset className="relative overflow-hidden isolate">
          <ChatWindow 
            conversation={selectedConversation} 
            onToggleHistory={() => setHistoryOpen(prev => !prev)}
            onClose={onClose}
            historyOpen={historyOpen}
            onHistoryOpenChange={setHistoryOpen}
            conversations={conversations}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </SidebarInset>
        <ChatSidebar 
          conversations={conversations} 
          selectedId={selectedId} 
          onSelect={setSelectedId} 
          side="right"
        />
      </SidebarProvider>
    </>
  )
}