import * as React from "react";
import { GenericCard } from "./GenericCard";
import { Button } from "../ui/button";
import { ChatPromptButton } from "../chat/ChatPromptButton";
import { Users } from "lucide-react";

interface JoinOrgConfirmCardProps {
  orgId: string;
  orgName: string;
  orgIcon: string;
  memberCount: number;
  description: string;
  onConfirm: (orgId: string) => void;
  onCancel: () => void;
  titleBelowAccessory?: React.ReactNode;
}

export function JoinOrgConfirmCard({
  orgId,
  orgName,
  orgIcon,
  memberCount,
  description,
  onConfirm,
  onCancel,
  titleBelowAccessory,
}: JoinOrgConfirmCardProps) {
  return (
    <>
      <GenericCard title="确认加入组织" titleBelowAccessory={titleBelowAccessory}>
        <div className="flex flex-col gap-[var(--space-400)]">
          {/* Organization Info */}
          <div className="flex items-start gap-[var(--space-400)] p-[var(--space-400)] bg-bg-secondary border border-border rounded-md">
            <img 
              src={orgIcon} 
              alt={orgName} 
              className="w-[48px] h-[48px] rounded-[6px] shrink-0" 
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-[length:var(--font-size-lg)] font-[var(--font-weight-semi-bold)] text-text mb-[var(--space-100)]">
                {orgName}
              </h3>
              <p className="text-[length:var(--font-size-sm)] text-text-secondary mb-[var(--space-200)] leading-relaxed">
                {description}
              </p>
              <div className="flex items-center gap-[var(--space-100)] text-text-tertiary">
                <Users size={14} />
                <span className="text-[length:var(--font-size-xs)]">
                  {memberCount} 位成员
                </span>
              </div>
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-bg-tertiary border border-border rounded-md p-[var(--space-400)]">
            <p className="text-[length:var(--font-size-sm)] text-text-secondary leading-relaxed">
              ⚠️ 加入该组织后，您将可以：<br/>
              • 访问组织的所有资源和数据<br/>
              • 与组织成员进行协作<br/>
              • 查看和编辑组织内的内容<br/><br/>
              请确认您有权限加入该组织。
            </p>
          </div>

          {/* Action Buttons：左取消 chat-reset，右主操作 chat-submit 占满右侧（同卡片表单底栏规范） */}
          <div className="flex w-full min-w-0 flex-col gap-[var(--space-200)] sm:flex-row sm:items-stretch">
            <Button className="w-full shrink-0 sm:w-auto" type="button" variant="chat-reset" onClick={onCancel}>
              取消
            </Button>
            <Button
              className="w-full min-w-0 flex-1 sm:min-h-10"
              type="button"
              variant="chat-submit"
              onClick={() => onConfirm(orgId)}
            >
              确认加入
            </Button>
          </div>
        </div>
      </GenericCard>

      {/* Prompt Buttons - Outside the card */}
      <div className="flex flex-wrap gap-[var(--space-200)] mt-[var(--space-200)]">
        
        
      </div>
    </>
  );
}
