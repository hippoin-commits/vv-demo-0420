import * as React from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Conversation } from "./data"
import { SidebarIcon } from "./SidebarIcons"
import { NewMessageIcon } from "./ChatComponents"
import { SquarePen } from "lucide-react"
import { cn } from "../ui/utils"

interface HistorySidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  conversations: Conversation[]
  selectedId: string
  onSelect: (id: string) => void
  mode?: 'overlay' | 'push'
  onNewConversation?: () => void
}

export function HistorySidebar({ 
  open, 
  onOpenChange, 
  conversations, 
  selectedId, 
  onSelect,
  mode = 'overlay',
  onNewConversation
}: HistorySidebarProps) {
  const hasInteractedRef = React.useRef(false)
  const prevOpen = React.useRef(open)
  const prevMode = React.useRef(mode)
  
  if (prevMode.current !== mode) {
    hasInteractedRef.current = false
    prevMode.current = mode
  }
  
  if (prevOpen.current !== open) {
    hasInteractedRef.current = true
    prevOpen.current = open
  }
  
  const shouldAnimate = hasInteractedRef.current

  return (
    <>
      {/* Backdrop (optional, for clicking outside to close) */}
      {open && mode === 'overlay' && (
        <div 
          className="absolute inset-0 z-40 bg-[var(--black-alpha-7)] backdrop-blur-[2px] transition-opacity"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Sidebar Panel */}
      <div 
        className={cn(
          "absolute top-0 left-0 bottom-0 w-[280px] bg-cui-bg z-50 flex flex-col rounded-tr-[var(--radius-xl)] rounded-br-[var(--radius-xl)] border-r border-border overflow-hidden",
          mode === 'push' ? "md:static md:h-full md:rounded-none md:border-r md:z-0 shrink-0" : "",
          shouldAnimate && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          open 
            ? cn("translate-x-0 shadow-elevation-sm", mode === 'push' && "md:shadow-none")
            : cn("-translate-x-full shadow-none", mode === 'push' && "md:-ml-[280px] md:translate-x-0")
        )}
      >
        <div className="flex items-center justify-between pl-[var(--space-500)] pr-[var(--space-300)] py-[var(--space-300)] flex-row shrink-0 m-0 space-y-0">
          <h2 className="text-[length:var(--font-size-md)] font-[var(--font-weight-semi-bold)] leading-normal text-text m-0">
            历史会话
          </h2>
          <div className="flex items-center gap-[var(--space-100)]">
            
            <button 
              onClick={() => onOpenChange(false)}
              className="w-[var(--space-800)] h-[var(--space-800)] flex items-center justify-center text-text-secondary hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors p-0 bg-transparent border-none cursor-pointer"
              title="关闭"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {/* New Conversation Button */}
        <div className="px-[var(--space-300)] pb-[var(--space-200)] shrink-0">
          <button 
            onClick={() => {
              if (onNewConversation) onNewConversation();
              if (mode === 'overlay') {
                onOpenChange(false);
              }
            }}
            className="flex w-full items-center justify-center gap-[var(--space-150)] bg-bg hover:shadow-xs border border-border rounded-[var(--radius-md)] text-text transition-colors cursor-pointer py-[var(--space-200)] px-[var(--space-300)] group"
          >
            <SquarePen size={16} className="text-text-secondary group-hover:text-text transition-colors" />
            <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-regular)] leading-normal">
              新对话
            </span>
          </button>
        </div>
        
        <ScrollArea className="flex-1 h-[calc(100vh-100px)]">
          <div className="flex flex-col pb-[var(--space-500)] w-full overflow-hidden px-[var(--space-300)] gap-[var(--space-200)]">
            <div className="flex flex-col gap-[var(--space-150)] w-full">
              <div className="px-[var(--space-200)] pt-[var(--space-200)] pb-[0px]">
                <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal">今日</span>
              </div>
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => {
                    onSelect(conversation.id)
                    onOpenChange(false)
                  }}
                  className={cn(
                    "grid grid-cols-1 w-full text-left p-[var(--space-200)] transition-colors border-none cursor-pointer rounded-[var(--radius-md)]",
                    "hover:bg-[var(--black-alpha-11)]",
                    selectedId === conversation.id 
                      ? "bg-[var(--blue-alpha-12)] text-primary" 
                      : "bg-transparent text-text"
                  )}
                >
                  <span className="text-[length:var(--font-size-base)] leading-normal truncate block w-full">
                    {conversation.sessionTitle?.trim() ||
                      conversation.messages[conversation.messages.length - 1]?.content ||
                      "新对话"}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex flex-col gap-[var(--space-150)] w-full">
              <div className="px-[var(--space-200)] pt-[var(--space-300)] pb-[0px]">
                <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal">7 天内</span>
              </div>
              <button className="grid grid-cols-1 w-full text-left p-[var(--space-200)] hover:bg-[var(--black-alpha-11)] transition-colors text-text border-none cursor-pointer bg-transparent rounded-[var(--radius-md)]">
                <span className="text-[length:var(--font-size-base)] leading-normal truncate block w-full">历史会话标题内容长文本测试长文本测试长文本测试长文本测试长文本测试长文本测试</span>
              </button>
              <button className="grid grid-cols-1 w-full text-left p-[var(--space-200)] hover:bg-[var(--black-alpha-11)] transition-colors text-text border-none cursor-pointer bg-transparent rounded-[var(--radius-md)]">
                <span className="text-[length:var(--font-size-base)] leading-normal truncate block w-full">历史会话标题内容</span>
              </button>
              <button className="grid grid-cols-1 w-full text-left p-[var(--space-200)] hover:bg-[var(--black-alpha-11)] transition-colors text-text border-none cursor-pointer bg-transparent rounded-[var(--radius-md)]">
                <span className="text-[length:var(--font-size-base)] leading-normal truncate block w-full">历史会话标题内容</span>
              </button>
            </div>

            <div className="flex flex-col gap-[var(--space-150)] w-full">
              <div className="pt-[var(--space-300)] pb-[var(--space-100)] px-[var(--space-200)]">
                <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal">更早</span>
              </div>
              <button className="grid grid-cols-1 w-full text-left p-[var(--space-200)] hover:bg-[var(--black-alpha-11)] transition-colors text-text border-none cursor-pointer bg-transparent rounded-[var(--radius-md)]">
                <span className="text-[length:var(--font-size-base)] leading-normal truncate block w-full">历史会话标题内容</span>
              </button>
            </div>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}