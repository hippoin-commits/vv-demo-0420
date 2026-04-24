import * as React from "react"
import { ScrollArea } from "../ui/scroll-area"
import { cn } from "../ui/utils"
import svgPaths from "../../imports/AiSidebar-3/svg-ukza2m8d43"

// Secondary app session types
export interface SecondaryAppSession {
  id: string
  appName: string
  appIconKey: string
  timestamp: Date
  hasUncompletedAction?: boolean // 是否有未完成的操作（显示橙色点）
}

interface SecondaryAppHistorySidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessions: SecondaryAppSession[]
  selectedId?: string
  onSelect: (id: string) => void
  onNewConversation: () => void
  mode?: 'overlay' | 'push'
}

/** 应用图标 SVG（命名导出用于 `NoEduSpaceCombinedSidebar` 等复用场景） */
export function AppIconSvg({ iconKey }: { iconKey: string }) {
  const iconSize = { width: 16, height: 16 }
  
  switch (iconKey) {
    case 'education':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#5590F6" />
          <path d={svgPaths.p809d300} fill="white" transform="translate(3, 4)" />
        </svg>
      )
    case 'calendar':
    case 'schedule':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#52C55A" />
          <path d={svgPaths.p292b1b00} fill="white" transform="translate(3.5, 3.5)" />
        </svg>
      )
    case 'meeting':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#8B7AEE" />
          <path d={svgPaths.p1219bb00} fill="white" transform="translate(4, 4.5)" />
        </svg>
      )
    case 'todo':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#5590F6" />
          <path d={svgPaths.pf699780} fill="white" transform="translate(3.5, 4)" />
        </svg>
      )
    case 'disk':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#FFA940" />
          <path d={svgPaths.p9207300} fill="white" transform="translate(3, 5.5)" />
          <path d={svgPaths.pfec6900} fill="white" transform="translate(3.2, 7.5)" />
          <path d={svgPaths.pc99a400} fill="white" transform="translate(3.2, 7.5)" />
        </svg>
      )
    case 'mail':
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="#FF6868" />
          <path d={svgPaths.pe0e7c30} fill="white" transform="translate(4, 4.2)" />
        </svg>
      )
    default:
      return (
        <svg width={iconSize.width} height={iconSize.height} viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="var(--gray-6)" />
        </svg>
      )
  }
}

// Group sessions by time period
function groupSessionsByTime(sessions: SecondaryAppSession[]) {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  
  const groups = {
    today: [] as SecondaryAppSession[],
    within7Days: [] as SecondaryAppSession[],
    earlier: [] as SecondaryAppSession[]
  }
  
  sessions.forEach(session => {
    const sessionDate = new Date(session.timestamp)
    const sessionDay = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate())
    
    if (sessionDay.getTime() >= today.getTime()) {
      groups.today.push(session)
    } else if (sessionDay.getTime() >= sevenDaysAgo.getTime()) {
      groups.within7Days.push(session)
    } else {
      groups.earlier.push(session)
    }
  })
  
  return groups
}

export function SecondaryAppHistorySidebar({ 
  open, 
  onOpenChange, 
  sessions, 
  selectedId = "",
  onSelect,
  onNewConversation,
  mode = 'overlay'
}: SecondaryAppHistorySidebarProps) {
  const groupedSessions = groupSessionsByTime(sessions)
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
      {/* Backdrop */}
      {open && mode === 'overlay' && (
        <div 
          className="absolute inset-0 z-40 bg-[var(--black-alpha-4)] backdrop-blur-[2px] transition-opacity"
          onClick={() => onOpenChange(false)}
        />
      )}
      
      {/* Sidebar Panel */}
      <div 
        className={cn(
          "absolute top-0 left-0 bottom-0 w-[200px] bg-cui-bg z-50 flex flex-col border-r border-border overflow-hidden",
          mode === 'push' ? "md:static md:h-full md:rounded-none md:border-r md:z-0 shrink-0" : "",
          shouldAnimate && "transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]",
          open 
            ? cn("translate-x-0 shadow-none", mode === 'push' && "md:shadow-none")
            : cn("-translate-x-full shadow-none", mode === 'push' && "md:-ml-[200px] md:translate-x-0")
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between pl-[var(--space-400)] pr-[var(--space-300)] py-[var(--space-300)] shrink-0">
          <h2 className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] leading-normal text-text m-0">
            最近使用
          </h2>
          
        </div>

        {/* New Conversation Button */}
        
        
        {/* Sessions List */}
        <ScrollArea className="flex-1 min-h-0">
          <div className="flex flex-col pb-[var(--space-500)] w-full overflow-hidden px-[var(--space-300)] gap-[var(--space-200)]">
            
            {/* Today Section */}
            {groupedSessions.today.length > 0 && (
              <div className="flex flex-col gap-[var(--space-150)] w-full">
                <div className="px-[var(--space-200)] pt-[var(--space-200)] pb-[0px]">
                  <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal font-[var(--font-weight-regular)]">
                    今日
                  </span>
                </div>
                {groupedSessions.today.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelect(session.id)
                      if (mode === 'overlay') {
                        onOpenChange(false)
                      }
                    }}
                    className={cn(
                      "flex items-center gap-[var(--space-200)] w-full text-left px-[var(--space-200)] py-[var(--space-200)] transition-colors border-none cursor-pointer rounded-[var(--radius-md)] relative",
                      "hover:bg-[var(--black-alpha-11)]",
                      selectedId === session.id 
                        ? "bg-[var(--blue-alpha-12)]" 
                        : "bg-transparent"
                    )}
                  >
                    <AppIconSvg iconKey={session.appIconKey} />
                    <span className={cn(
                      "text-[length:var(--font-size-base)] leading-normal truncate block flex-1 font-[var(--font-weight-regular)]",
                      selectedId === session.id ? "text-primary" : "text-text"
                    )}>
                      {session.appName}
                    </span>
                    {session.hasUncompletedAction && (
                      <div className="w-[var(--space-150)] h-[var(--space-150)] rounded-full bg-[var(--orange-6)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Within 7 Days Section */}
            {groupedSessions.within7Days.length > 0 && (
              <div className="flex flex-col gap-[var(--space-150)] w-full">
                <div className="px-[var(--space-200)] pt-[var(--space-300)] pb-[0px]">
                  <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal font-[var(--font-weight-regular)]">
                    7 天内
                  </span>
                </div>
                {groupedSessions.within7Days.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelect(session.id)
                      if (mode === 'overlay') {
                        onOpenChange(false)
                      }
                    }}
                    className={cn(
                      "flex items-center gap-[var(--space-200)] w-full text-left px-[var(--space-200)] py-[var(--space-200)] transition-colors border-none cursor-pointer rounded-[var(--radius-md)] relative",
                      "hover:bg-[var(--black-alpha-11)]",
                      selectedId === session.id 
                        ? "bg-[var(--blue-alpha-12)]" 
                        : "bg-transparent"
                    )}
                  >
                    <AppIconSvg iconKey={session.appIconKey} />
                    <span className={cn(
                      "text-[length:var(--font-size-base)] leading-normal truncate block flex-1 font-[var(--font-weight-regular)]",
                      selectedId === session.id ? "text-primary" : "text-text"
                    )}>
                      {session.appName}
                    </span>
                    {session.hasUncompletedAction && (
                      <div className="w-[var(--space-150)] h-[var(--space-150)] rounded-full bg-[var(--orange-6)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Earlier Section */}
            {groupedSessions.earlier.length > 0 && (
              <div className="flex flex-col gap-[var(--space-150)] w-full">
                <div className="pt-[var(--space-300)] pb-[var(--space-100)] px-[var(--space-200)]">
                  <span className="text-[length:var(--font-size-xs)] text-text-secondary leading-normal font-[var(--font-weight-regular)]">
                    更早
                  </span>
                </div>
                {groupedSessions.earlier.map((session) => (
                  <button
                    key={session.id}
                    onClick={() => {
                      onSelect(session.id)
                      if (mode === 'overlay') {
                        onOpenChange(false)
                      }
                    }}
                    className={cn(
                      "flex items-center gap-[var(--space-200)] w-full text-left px-[var(--space-200)] py-[var(--space-200)] transition-colors border-none cursor-pointer rounded-[var(--radius-md)] relative",
                      "hover:bg-[var(--black-alpha-11)]",
                      selectedId === session.id 
                        ? "bg-[var(--blue-alpha-12)]" 
                        : "bg-transparent"
                    )}
                  >
                    <AppIconSvg iconKey={session.appIconKey} />
                    <span className={cn(
                      "text-[length:var(--font-size-base)] leading-normal truncate block flex-1 font-[var(--font-weight-regular)]",
                      selectedId === session.id ? "text-primary" : "text-text"
                    )}>
                      {session.appName}
                    </span>
                    {session.hasUncompletedAction && (
                      <div className="w-[var(--space-150)] h-[var(--space-150)] rounded-full bg-[var(--orange-6)] shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </>
  )
}