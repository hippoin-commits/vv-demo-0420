import React from "react";
import {
  BadgeCheck,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  FileText,
  Flag,
  FolderKanban,
  KeyRound,
  Landmark,
  MessageSquareWarning,
  Package,
  Presentation,
  Repeat2,
  ScrollText,
  UserMinus,
  UserPlus,
  UserRoundCheck,
  UsersRound,
  Workflow,
} from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { cn } from "../ui/utils";

interface AppIconProps {
  imageSrc?: string;
  className?: string;
}

export function AppIcon({ imageSrc, className = '' }: AppIconProps) {
  // 严格遵守设计系统：所有图标均使用静态图片，不再支持SVG回退
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-[35%] ${className || 'size-[16px]'}`}>
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

const appDockIconConfigs = {
  docs: { Icon: FileText, bg: "bg-[var(--orange-7)]" },
  company: { Icon: Landmark, bg: "bg-[var(--blue-7)]" },
  organization: { Icon: UsersRound, bg: "bg-[var(--blue-7)]" },
  employee: { Icon: ClipboardCheck, bg: "bg-[var(--green-7)]" },
  recruitment: { Icon: BriefcaseBusiness, bg: "bg-[var(--blue-7)]" },
  attendance: { Icon: UsersRound, bg: "bg-[var(--blue-7)]" },
  salary: { Icon: BadgeCheck, bg: "bg-[var(--red-7)]" },
  performance: { Icon: BarChart3, bg: "bg-[var(--red-7)]" },
  finance: { Icon: Landmark, bg: "bg-[var(--red-7)]" },
  policy: { Icon: ScrollText, bg: "bg-[var(--orange-7)]" },
  material: { Icon: Package, bg: "bg-[var(--green-7)]" },
  onboarding: { Icon: UserPlus, bg: "bg-[var(--green-7)]" },
  regularization: { Icon: Repeat2, bg: "bg-[var(--green-7)]" },
  transfer: { Icon: UserRoundCheck, bg: "bg-[var(--orange-7)]" },
  resignation: { Icon: UserMinus, bg: "bg-[var(--red-7)]" },
  contract: { Icon: FileText, bg: "bg-[var(--orange-7)]" },
  goal: { Icon: Flag, bg: "bg-[var(--blue-7)]" },
  project: { Icon: FolderKanban, bg: "bg-[var(--green-7)]" },
  feedback: { Icon: MessageSquareWarning, bg: "bg-[var(--red-7)]" },
  meeting_room: { Icon: Presentation, bg: "bg-[var(--blue-7)]" },
  workflow: { Icon: Workflow, bg: "bg-[var(--blue-7)]" },
  permission: { Icon: KeyRound, bg: "bg-[var(--blue-7)]" },
  customer: { Icon: Building2, bg: "bg-[var(--orange-7)]" },
} as const;

/** 主 AI / 应用切换条上的「一级应用入口」：深色底 + 白色符号（与 `iconType: docs` 等特例一致） */
export function AppDockEntryIcon({
  icon,
  className,
}: {
  icon: { imageSrc?: string; iconType?: string };
  /** 外层尺寸，如 size-[18px]、h-full w-full */
  className?: string;
}) {
  const config = icon.iconType
    ? appDockIconConfigs[icon.iconType as keyof typeof appDockIconConfigs]
    : undefined;

  if (config) {
    const { Icon, bg } = config;
    return (
      <span
        className={cn(
          "relative flex shrink-0 items-center justify-center overflow-hidden rounded-[35%] text-white",
          bg,
          className || "size-[18px]",
        )}
        aria-hidden
      >
        <Icon className="size-[65%] shrink-0" strokeWidth={2.4} />
      </span>
    );
  }
  return <AppIcon imageSrc={icon.imageSrc} className={className || "size-[18px]"} />;
}
