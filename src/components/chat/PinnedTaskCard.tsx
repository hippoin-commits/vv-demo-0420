import * as React from "react"

interface TaskChipProps {
  iconSrc: string;
  alt: string;
  title: string;
  time?: string;
  count?: number;
  onClick?: () => void;
}

export function TaskChip({ iconSrc, alt, title, time, count, onClick }: TaskChipProps) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-200)] rounded-[var(--radius-md)] cursor-pointer hover:bg-[var(--blue-11)] border border-[var(--blue-11)] transition-colors text-[length:var(--font-size-base)] bg-[var(--blue-12)] w-full md:w-auto"
    >
      <span className="flex items-center justify-center shrink-0 w-[18px] h-[18px]">
        <img src={iconSrc} alt={alt} className="w-full h-full object-contain" />
      </span>
      <span className="text-text truncate flex-1 min-w-0">{title}</span>
      {time && (
        <span className="text-text-secondary text-[length:var(--font-size-xs)] shrink-0 ml-auto">{time}</span>
      )}
      {count !== undefined && (
        <div className="bg-bg ml-[var(--space-100)] flex gap-[var(--space-50)] items-center justify-center pl-[var(--space-150)] pr-[var(--space-100)] py-[var(--space-50)] rounded-[var(--radius-full)] shrink-0">
          <span className="leading-[12px] shrink-0 text-text-secondary text-[11px] text-center whitespace-nowrap font-[var(--font-weight-regular)]">{count}</span>
          <div className="shrink-0 w-[10px] h-[10px] flex items-center justify-center text-text-secondary">
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </div>
        </div>
      )}
    </div>
  )
}

interface PinnedTaskCardProps {
  greeting?: string;
  chips?: TaskChipProps[];
  onChipClick?: (chip: TaskChipProps) => void;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export function PinnedTaskCard({ 
  greeting = "下午好，今天你有 2 件要处理的事情 👇",
  chips = [],
  onChipClick,
  expanded,
  onExpandedChange,
}: PinnedTaskCardProps) {
  const [internalExpanded, setInternalExpanded] = React.useState(true);
  
  // Use controlled state if provided, otherwise use internal state
  const isExpanded = expanded !== undefined ? expanded : internalExpanded;

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    
    // Update parent state if in controlled mode
    if (onExpandedChange) {
      onExpandedChange(newExpanded);
    }
    
    // Only update internal state if in uncontrolled mode
    if (expanded === undefined) {
      setInternalExpanded(newExpanded);
    }
  };

  return (
    <div className="w-full">
      {/* Single unified container with smooth transitions */}
      <div
        className="bg-[var(--white-alpha-2)] backdrop-blur-[var(--blur-200)] rounded-lg border border-border shadow-xs transition-[box-shadow,border-color,backdrop-filter] duration-300 ease-in-out overflow-hidden"
      >
        {/* Header - always visible */}
        <div 
          onClick={isExpanded ? undefined : handleToggle}
          className={`flex items-center justify-between gap-[var(--space-200)] px-[var(--space-350)] transition-all duration-300 ${
            isExpanded 
              ? 'py-[var(--space-250)]' 
              : 'py-[var(--space-250)] cursor-pointer hover:bg-[var(--white-alpha-4)]'
          }`}
        >
          <p className={`text-text transition-all duration-300 ${
            isExpanded 
              ? 'text-[length:var(--font-size-base)] leading-[var(--line-height-md)]' 
              : 'text-[length:var(--font-size-base)] leading-[var(--line-height-md)] font-[var(--font-weight-regular)]'
          }`}>
            {isExpanded ? greeting : greeting.replace(' 👇', '')}
          </p>
          
          {/* Arrow button - only visible when collapsed */}
          {!isExpanded && (
            <button
              className="flex items-center justify-center w-[24px] h-[24px] bg-bg border-[0.5px] border-border rounded-full shadow-xs transition-transform duration-300 rotate-180 shrink-0"
            >
              <svg width="10" height="10" viewBox="0 0 8.75 4.75" fill="none">
                <path d="M4.64016 0.109835C4.56984 0.0395088 4.47446 0 4.375 0C4.27554 0 4.18016 0.0395088 4.10984 0.109835L0.109835 4.10983C-0.0366117 4.25628 -0.0366117 4.49372 0.109835 4.64016C0.256282 4.78661 0.493718 4.78661 0.640165 4.64016L4.375 0.90533L8.10984 4.64016C8.25628 4.78661 8.49372 4.78661 8.64017 4.64016C8.78661 4.49372 8.78661 4.25628 8.64017 4.10983L4.64016 0.109835Z" fill="var(--color-text-secondary)"/>
              </svg>
            </button>
          )}
        </div>

        {/* Expandable content - chips */}
        <div 
          className="grid transition-all duration-300 ease-in-out"
          style={{
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
          }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="px-[var(--space-350)] pb-[var(--space-350)]">
              <div className="flex flex-col md:flex-row md:flex-wrap gap-[var(--space-200)]">
                {chips.map((chip, index) => (
                  <TaskChip 
                    key={index} 
                    {...chip} 
                    onClick={() => onChipClick?.(chip)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部中央：展开态下的收起按钮 */}
      <div 
        className="grid transition-all duration-300 ease-in-out"
        style={{
          gridTemplateRows: isExpanded ? '1fr' : '0fr',
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div className="min-h-0">
          <div className="pt-[var(--space-100)] flex items-center justify-center">
            <button
              type="button"
              onClick={handleToggle}
              aria-label="收起待办卡片"
              className="flex items-center justify-center w-[24px] h-[24px] bg-bg border border-border rounded-full shadow-xs hover:shadow-sm transition-all duration-300"
            >
              <svg width="10" height="10" viewBox="0 0 8.75 4.75" fill="none">
                <path d="M4.64016 0.109835C4.56984 0.0395088 4.47446 0 4.375 0C4.27554 0 4.18016 0.0395088 4.10984 0.109835L0.109835 4.10983C-0.0366117 4.25628 -0.0366117 4.49372 0.109835 4.64016C0.256282 4.78661 0.493718 4.78661 0.640165 4.64016L4.375 0.90533L8.10984 4.64016C8.25628 4.78661 8.49372 4.78661 8.64017 4.64016C8.78661 4.49372 8.78661 4.25628 8.64017 4.10983L4.64016 0.109835Z" fill="var(--color-text-secondary)"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}