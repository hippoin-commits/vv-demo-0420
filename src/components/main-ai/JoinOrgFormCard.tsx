import * as React from "react";
import { GenericFormCard } from "./GenericFormCard";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ChatPromptButton } from "../chat/ChatPromptButton";

interface JoinOrgFormCardProps {
  onSubmit: (inviteCode: string) => void;
  onCancel: () => void;
}

export function JoinOrgFormCard({ onSubmit, onCancel }: JoinOrgFormCardProps) {
  const [inviteCode, setInviteCode] = React.useState("");
  const [error, setError] = React.useState<string | undefined>();

  const handleSubmit = () => {
    if (!inviteCode.trim()) {
      setError("邀请码不能为空");
      return;
    }
    
    if (inviteCode.trim().length < 6) {
      setError("邀请码格式不正确，请检查后重试");
      return;
    }
    
    onSubmit(inviteCode.trim());
  };

  const handleReset = () => {
    setInviteCode("");
    setError(undefined);
  };

  return (
    <>
      <GenericFormCard 
        title="加入组织"
        onSubmit={handleSubmit}
        onReset={handleReset}
        submitText="验证并加入"
        resetText="重置"
      >
        <div className="flex flex-col gap-[var(--space-400)]">
          <div className="bg-bg-secondary border border-border rounded-md p-[var(--space-400)]">
            <p className="text-[length:var(--font-size-sm)] text-text-secondary leading-relaxed">
              💡 请输入组织管理员提供的邀请码。如果您还没有邀请码，请联系组织管理员获取。
            </p>
          </div>

          <div className="flex flex-col gap-[var(--space-200)]">
            <label htmlFor="invite-code" className="text-[length:var(--font-size-sm)] font-[var(--font-weight-medium)] text-text">
              邀请码 <span className="text-error">*</span>
            </label>
            <Input
              id="invite-code"
              type="text"
              placeholder="请输入组织邀请码（如：XIAOCE2024）"
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value.toUpperCase());
                if (error) setError(undefined);
              }}
              className={error ? "border-error" : ""}
              maxLength={20}
            />
            {error && (
              <p className="text-[length:var(--font-size-xs)] text-error">{error}</p>
            )}
          </div>

          <div className="bg-bg-tertiary border border-border rounded-md p-[var(--space-300)]">
            <p className="text-[length:var(--font-size-xs)] text-text-tertiary leading-relaxed">
              <strong className="text-text">测试邀请码：</strong><br/>
              XIAOCE2024（小测教育机构）<br/>
              DEFAULT001（默认组织）<br/>
              TEST123（测试机构）
            </p>
          </div>
        </div>
      </GenericFormCard>

      {/* Prompt Buttons - Outside the card */}
      <div className="flex flex-wrap gap-[var(--space-200)] mt-[var(--space-200)]">
        <ChatPromptButton onClick={() => setInviteCode("XIAOCE2024")}>
          使用小测教育邀请码
        </ChatPromptButton>
        <ChatPromptButton onClick={() => setInviteCode("DEFAULT001")}>
          使用默认组织邀请码
        </ChatPromptButton>
        <ChatPromptButton onClick={onCancel}>
          取消加入
        </ChatPromptButton>
      </div>
    </>
  );
}