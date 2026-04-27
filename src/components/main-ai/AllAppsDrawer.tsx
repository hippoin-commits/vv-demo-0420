import React, { useState } from "react";
import { Plus } from "lucide-react";
import { type AppItem } from "./MainAIChatWindow";
import { AppDockEntryIcon } from "./AppIcon";
import { cn } from "../ui/utils";

interface AllAppsDrawerProps {
  apps: AppItem[];
  isOpen: boolean;
  onClose: () => void;
  onReorder: (reorderedApps: AppItem[]) => void;
  onAppClick?: (appId: string) => void;
  /** 仅展示、不参与长按拖拽（如方案入口插入的「邮箱」，避免写入排序存储） */
  excludeFromDragIds?: string[];
  /** 0421 新用户：无组织时拆成「已添加 / 未添加」两组，未添加项右上角展示「添加」角标 */
  invite0421Split?: boolean;
  addedApps?: AppItem[];
  unaddedApps?: AppItem[];
}

function Invite0421GridBadge() {
  return (
    <span
      className="pointer-events-none absolute -right-0.5 -top-0.5 z-[1] flex size-[14px] items-center justify-center rounded-full border border-border bg-bg shadow-xs ring-2 ring-bg"
      aria-hidden
    >
      <Plus className="size-[9px] text-primary" strokeWidth={2.75} aria-hidden />
    </span>
  );
}

export function AllAppsDrawer({
  apps,
  isOpen,
  onClose,
  onReorder,
  onAppClick,
  excludeFromDragIds = [],
  invite0421Split = false,
  addedApps = [],
  unaddedApps = [],
}: AllAppsDrawerProps) {
  const splitMode = invite0421Split && addedApps.length + unaddedApps.length > 0;
  const gridApps = splitMode ? [] : apps;
  const excludeDrag = (id: string) => excludeFromDragIds.includes(id);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [longPressIndex, setLongPressIndex] = useState<number | null>(null);
  const longPressTimerRef = React.useRef<any>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (excludeDrag(apps[index]?.id ?? "")) {
      e.preventDefault();
      return;
    }
    if (longPressIndex !== index) {
      e.preventDefault();
      return;
    }
    // Firefox requires dataTransfer data to be set for drag to work
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', index.toString());
    }
    setDraggedIndex(index);
  };

  const handleDragEnter = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newApps = [...apps];
    const draggedApp = newApps[draggedIndex];
    newApps.splice(draggedIndex, 1);
    newApps.splice(index, 0, draggedApp);
    
    const reorderedApps = newApps.map((app, i) => ({
      ...app,
      order: i + 1,
    }));
    
    onReorder(reorderedApps);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setLongPressIndex(null);
  };

  const startLongPress = (index: number) => {
    longPressTimerRef.current = setTimeout(() => {
      setLongPressIndex(index);
    }, 500);
  };

  const endLongPress = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
  };

  return (
    <>
      {/* 全屏透明背景，用于点击外部收起 */}
      <div
        role="presentation"
        className={cn(
          "fixed inset-0 z-[100] bg-[var(--color-overlay)] transition-opacity",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={onClose}
      />
      
      {/* Drawer 容器 - 相对于父元素（输入区容器）定位，并与其 padding 对齐 */}
      <div
        className={cn(
          'absolute bottom-full left-[max(20px,var(--cui-padding-max))] right-[max(20px,var(--cui-padding-max))] mb-[var(--space-0)] z-[101] transition-all duration-[350ms] ease-out origin-bottom',
          isOpen ? 'translate-y-0 opacity-100 scale-100 visible' : 'translate-y-4 opacity-0 scale-95 invisible pointer-events-none'
        )}
      >
        <div 
          className="w-full bg-[var(--white-alpha-2)] backdrop-blur-[var(--blur-200)] rounded-[var(--radius-card)] shadow-[var(--shadow-md)] flex flex-col border border-border px-[8px] pt-[14px] pb-[14px]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-[var(--space-400)] px-[var(--space-200)]">
            <div className="flex items-center gap-[var(--space-400)]">
              <span className="text-text font-[var(--font-weight-medium)] text-[length:var(--font-size-base)] leading-normal">
                全部应用
              </span>
              <span className="text-text-muted text-[length:var(--font-size-xs)] leading-normal">
                长按拖拽可调整顺序
              </span>
            </div>
            <button
              type="button"
              title="关闭"
              onClick={onClose}
              className="text-text-tertiary hover:text-text transition-colors hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] w-[var(--space-500)] h-[var(--space-500)] flex items-center justify-center shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="关闭"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          {/* Apps Grid */}
          <div className="flex flex-wrap gap-x-[var(--space-300)] gap-y-[var(--space-300)] px-[var(--space-200)] max-h-[50vh] scrollbar-hide content-start">
            {splitMode ? (
              <>
                <div className="w-full px-[var(--space-100)] pb-1 text-[10px] font-[var(--font-weight-medium)] uppercase tracking-wide text-text-tertiary">
                  已添加
                </div>
                {addedApps.map((app) => (
                  <div
                    key={app.id}
                    className="flex w-[60px] flex-col items-center justify-start gap-[var(--space-100)] rounded-[var(--radius-300)] select-none"
                  >
                    <button
                      type="button"
                      onClick={() => onAppClick?.(app.id)}
                      className="flex w-full flex-col items-center gap-[var(--space-100)] rounded-[var(--radius-300)] p-1 hover:bg-[var(--black-alpha-08)]"
                    >
                      <div className="relative h-[var(--space-900)] w-[var(--space-900)] shrink-0">
                        <AppDockEntryIcon icon={app.icon} className="h-full w-full" />
                      </div>
                      <p className="h-[var(--space-700)] w-full break-words text-center text-[length:var(--font-size-xs)] leading-normal text-text-secondary">
                        {app.name}
                      </p>
                    </button>
                  </div>
                ))}
                <div className="mt-1 w-full border-t border-border pt-2">
                  <p className="px-[var(--space-100)] pb-1 text-[10px] font-[var(--font-weight-medium)] uppercase tracking-wide text-text-tertiary">
                    未添加
                  </p>
                  <div className="flex flex-wrap gap-x-[var(--space-300)] gap-y-[var(--space-300)]">
                    {unaddedApps.map((app) => (
                      <button
                        key={app.id}
                        type="button"
                        onClick={() => onAppClick?.(app.id)}
                        className="flex w-[60px] flex-col items-center justify-start gap-[var(--space-100)] rounded-[var(--radius-300)] p-1 select-none hover:bg-[var(--black-alpha-08)]"
                      >
                        <div className="relative h-[var(--space-900)] w-[var(--space-900)] shrink-0">
                          <Invite0421GridBadge />
                          <AppDockEntryIcon icon={app.icon} className="h-full w-full" />
                        </div>
                        <p className="h-[var(--space-700)] w-full break-words text-center text-[length:var(--font-size-xs)] leading-normal text-text-secondary">
                          {app.name}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              gridApps.map((app, index) => (
                <div
                  key={app.id}
                  draggable={!excludeDrag(app.id) && longPressIndex === index}
                  onClick={() => onAppClick?.(app.id)}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnter={() => handleDragEnter(index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                  }}
                  onMouseDown={() => {
                    if (!excludeDrag(app.id)) startLongPress(index);
                  }}
                  onMouseUp={endLongPress}
                  onMouseLeave={endLongPress}
                  onTouchStart={() => {
                    if (!excludeDrag(app.id)) startLongPress(index);
                  }}
                  onTouchEnd={endLongPress}
                  className={cn(
                    "flex w-[60px] flex-col items-center justify-start gap-[var(--space-100)] rounded-[var(--radius-300)] select-none transition-all duration-300 ease-out",
                    longPressIndex === index
                      ? "cursor-grab scale-110 bg-[var(--black-alpha-11)] shadow-elevation-sm ring-1 ring-primary/10 active:cursor-grabbing"
                      : "cursor-pointer",
                    draggedIndex === index && "scale-95 opacity-20",
                  )}
                >
                  <div className="relative h-[var(--space-900)] w-[var(--space-900)] shrink-0">
                    <AppDockEntryIcon icon={app.icon} className="h-full w-full" />
                  </div>
                  <p className="h-[var(--space-700)] w-full break-words text-center text-[length:var(--font-size-xs)] leading-normal text-text-secondary">
                    {app.name}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}