import React from "react";
import { FileText } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { cn } from "../ui/utils";

interface AppIconProps {
  imageSrc?: string;
  className?: string;
}

export function AppIcon({ imageSrc, className = '' }: AppIconProps) {
  // 严格遵守设计系统：所有图标均使用静态图片，不再支持SVG回退
  return (
    <div className={`relative shrink-0 rounded-[var(--radius-sm)] overflow-hidden ${className || 'size-[16px]'}`}>
      {imageSrc ? (
        <ImageWithFallback 
          src={imageSrc} 
          alt="app icon" 
          className="w-full h-full object-contain" 
        />
      ) : (
        <div className="w-full h-full bg-[var(--gray-alpha-11)]" />
      )}
    </div>
  );
}

/** 主 AI / 应用切换条上的「一级应用入口」：深色底 + 白色符号（与 `iconType: docs` 等特例一致） */
export function AppDockEntryIcon({
  icon,
  className,
}: {
  icon: { imageSrc?: string; iconType?: string };
  /** 外层尺寸，如 size-[18px]、h-full w-full */
  className?: string;
}) {
  if (icon.iconType === "docs") {
    return (
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[var(--orange-7)] text-white",
          className || "size-[18px]",
        )}
        aria-hidden
      >
        <FileText className="size-[13px] shrink-0" strokeWidth={2} />
      </span>
    );
  }
  return <AppIcon imageSrc={icon.imageSrc} className={className || "size-[18px]"} />;
}
