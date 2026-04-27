import React from "react";
import { GenericCard } from "./GenericCard";
import { ChatPromptButton } from "../chat/ChatPromptButton";
import { cn } from "../ui/utils";
import orgIcon from 'figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png';
import checkIcon from 'figma:asset/9f2b842327a3c3f28d84a51e60f0896068694af1.png';

export interface Organization {
  id: string;
  name: string;
  icon?: string;
  memberCount?: number;
  description?: string;
}

export interface OrganizationSwitcherCardProps {
  currentOrg: Organization;
  organizations: Organization[];
  onSelectOrg: (orgId: string) => void;
  onCreateOrg?: () => void;
  onJoinOrg?: () => void;
  /** 主 AI：卡片标题下与顶栏一致的组织切换条（无排序、无新建加入） */
  titleBelowAccessory?: React.ReactNode;
}

export function OrganizationSwitcherCard({
  currentOrg,
  organizations,
  onSelectOrg,
  onCreateOrg,
  onJoinOrg,
  titleBelowAccessory,
}: OrganizationSwitcherCardProps) {
  const [selectedOrgId, setSelectedOrgId] = React.useState(currentOrg.id);

  const handleOrgSelect = (orgId: string) => {
    setSelectedOrgId(orgId);
  };

  const handleConfirm = () => {
    if (selectedOrgId !== currentOrg.id) {
      onSelectOrg(selectedOrgId);
    }
  };

  return (
    <div className="w-full flex flex-col gap-[var(--space-300)]">
      <GenericCard title="切换组织" titleBelowAccessory={titleBelowAccessory}>
        {/* 当前组织信息 */}
        <div className="flex flex-col gap-[var(--space-200)] mb-[var(--space-400)]">
          <p className="text-[length:var(--font-size-xs)] text-text-secondary">当前组织</p>
          <div className="flex items-center gap-[var(--space-300)] p-[var(--space-300)] bg-bg-secondary border border-border rounded-[var(--radius-md)]">
            <img src={currentOrg.icon || orgIcon} alt="" className="w-[32px] h-[32px] rounded-[var(--radius-100)] shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-[length:var(--font-size-base)] text-text font-[var(--font-weight-medium)] truncate">{currentOrg.name}</p>
              {currentOrg.memberCount !== undefined && (
                <p className="text-[length:var(--font-size-xs)] text-text-secondary">{currentOrg.memberCount} 位成员</p>
              )}
            </div>
          </div>
        </div>

        {/* 可切换的组织列表 */}
        <div className="flex flex-col gap-[var(--space-200)]">
          <p className="text-[length:var(--font-size-xs)] text-text-secondary">选择要切换的组织</p>
          <div className="flex flex-col gap-[var(--space-150)]">
            {organizations.map((org) => {
              const isSelected = selectedOrgId === org.id;
              const isCurrent = org.id === currentOrg.id;
              
              return (
                <button
                  key={org.id}
                  onClick={() => handleOrgSelect(org.id)}
                  className={cn(
                    "flex items-center justify-between gap-[var(--space-300)] p-[var(--space-300)] rounded-[var(--radius-md)] transition-all",
                    "border border-border hover:border-primary/30 hover:bg-bg-tertiary",
                    isSelected && "border-primary bg-bg-tertiary",
                    isCurrent && "opacity-60"
                  )}
                  disabled={isCurrent}
                >
                  <div className="flex items-center gap-[var(--space-300)] flex-1 min-w-0">
                    <img src={org.icon || orgIcon} alt="" className="w-[28px] h-[28px] rounded-[var(--radius-100)] shrink-0" />
                    <div className="flex-1 min-w-0 text-left">
                      <p className={cn(
                        "text-[length:var(--font-size-base)] font-[var(--font-weight-regular)] truncate",
                        isSelected ? "text-primary" : "text-text"
                      )}>
                        {org.name}
                        {isCurrent && <span className="ml-[var(--space-150)] text-text-tertiary text-[length:var(--font-size-xs)]">(当前)</span>}
                      </p>
                      {org.memberCount !== undefined && (
                        <p className="text-[length:var(--font-size-xs)] text-text-secondary">{org.memberCount} 位成员</p>
                      )}
                    </div>
                  </div>
                  {isSelected && (
                    <img src={checkIcon} alt="Selected" className="w-[16px] h-[16px] shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 确认按钮 */}
        {selectedOrgId !== currentOrg.id && (
          <div className="mt-[var(--space-400)] pt-[var(--space-400)] border-t border-border">
            <button
              onClick={handleConfirm}
              className="w-full h-[var(--space-900)] px-[var(--space-400)] bg-primary text-[var(--color-white)] rounded-[var(--radius-button)] text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] hover:bg-primary-hover active:bg-primary-active transition-colors"
            >
              确认切换到 {organizations.find(o => o.id === selectedOrgId)?.name}
            </button>
          </div>
        )}

        {/* 其他操作按钮 */}
        <div className="mt-[var(--space-300)] flex gap-[var(--space-200)] w-full">
          {onJoinOrg && (
            <button
              onClick={onJoinOrg}
              className="flex-1 h-[var(--space-800)] px-[var(--space-300)] bg-transparent border border-border text-text rounded-[var(--radius-button)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] hover:bg-bg-tertiary transition-colors"
            >
              加入组织
            </button>
          )}
          {onCreateOrg && (
            <button
              onClick={onCreateOrg}
              className="flex-1 h-[var(--space-800)] px-[var(--space-300)] bg-transparent border border-primary text-primary rounded-[var(--radius-button)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)] hover:bg-[var(--blue-alpha-11)] transition-colors"
            >
              创建组织
            </button>
          )}
        </div>
      </GenericCard>

      {/* 快捷 Prompt 按钮 - 必须在卡片外部 */}
      <div className="flex flex-wrap gap-[var(--space-200)] w-full">
        <ChatPromptButton onClick={() => onSelectOrg(currentOrg.id)}>
          保持当前组织
        </ChatPromptButton>
        {organizations.filter(org => org.id !== currentOrg.id).slice(0, 2).map(org => (
          <ChatPromptButton key={org.id} onClick={() => onSelectOrg(org.id)}>
            切换到{org.name}
          </ChatPromptButton>
        ))}
        {onCreateOrg && (
          <ChatPromptButton onClick={onCreateOrg}>
            创建新组织
          </ChatPromptButton>
        )}
      </div>
    </div>
  );
}
