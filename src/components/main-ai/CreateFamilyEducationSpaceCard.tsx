import * as React from "react";
import { SquarePlus, Info, Check } from "lucide-react";
import { GenericFormCard } from "./GenericFormCard";
import { Input } from "../ui/input";
import { cn } from "../ui/utils";

export type FamilyEducationIdentity = "parent" | "student";

export interface CreateFamilyEducationSpaceData {
  identity: FamilyEducationIdentity;
  /** identity=parent → 孩子姓名；identity=student → 本人姓名 */
  name: string;
}

interface CreateFamilyEducationSpaceCardProps {
  /** 当 identity=student 时预填的默认姓名（取当前登录用户） */
  defaultStudentName?: string;
  onSubmit: (data: CreateFamilyEducationSpaceData) => void;
  onCancel?: () => void;
}

/**
 * 创建家庭教育空间（分两步）：
 * 1) 选择身份：家长为孩子创建 / 学生为自己创建
 * 2) 根据身份展示「创建教育空间」表单；学生路径的「姓名」预填当前用户名
 */
export function CreateFamilyEducationSpaceCard({
  defaultStudentName = "",
  onSubmit,
}: CreateFamilyEducationSpaceCardProps) {
  const [identity, setIdentity] = React.useState<FamilyEducationIdentity | null>(null);
  const [parentChildName, setParentChildName] = React.useState("");
  const [studentName, setStudentName] = React.useState(defaultStudentName);
  const [error, setError] = React.useState<string | undefined>();
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  /** 选择身份后，如切换身份，重置名称输入 */
  const handleSelectIdentity = (next: FamilyEducationIdentity) => {
    if (identity === next) return;
    setIdentity(next);
    setError(undefined);
    if (next === "student") {
      setStudentName(defaultStudentName);
    } else {
      setParentChildName("");
    }
  };

  const handleReset = () => {
    if (identity === "student") {
      setStudentName(defaultStudentName);
    } else {
      setParentChildName("");
    }
    setError(undefined);
  };

  const handleSubmit = () => {
    if (!identity) {
      setError("请选择身份");
      return;
    }
    const name = identity === "parent" ? parentChildName.trim() : studentName.trim();
    const label = identity === "parent" ? "孩子姓名" : "姓名";
    if (!name) {
      setError(`${label}不能为空`);
      return;
    }
    setIsSubmitted(true);
    onSubmit({ identity, name });
  };

  const currentName = identity === "parent" ? parentChildName : studentName;
  const currentLabel = identity === "parent" ? "孩子姓名" : "姓名";
  const setCurrentName = identity === "parent" ? setParentChildName : setStudentName;

  return (
    <div className="flex flex-col gap-[var(--space-300)] w-full">
      {/* 身份选择卡（气泡样式） */}
      <div className="bg-bg rounded-card shadow-xs p-[var(--space-350)] flex flex-col gap-[var(--space-250)] w-full">
        <p className="text-[length:var(--font-size-sm)] text-text-tertiary">请选择</p>
        <div className="flex flex-wrap gap-[var(--space-200)]">
          <IdentityOption
            label="我是家长，给孩子创建教育空间"
            selected={identity === "parent"}
            disabled={isSubmitted}
            onClick={() => handleSelectIdentity("parent")}
          />
          <IdentityOption
            label="我是学生，为自己创建教育空间"
            selected={identity === "student"}
            disabled={isSubmitted}
            onClick={() => handleSelectIdentity("student")}
          />
        </div>
      </div>

      {/* 表单卡：选择身份后出现；确认创建后卡片直接卸载（上方身份卡保留选中+禁用态） */}
      {identity && !isSubmitted && (
        <GenericFormCard
          title="创建教育空间"
          icon={<SquarePlus className="w-[18px] h-[18px]" />}
          onSubmit={handleSubmit}
          onReset={handleReset}
          submitText="确认创建"
          resetText="重置"
          isSubmitted={isSubmitted}
        >
          <div className="flex flex-col gap-[var(--space-200)]">
            <label className="text-[length:var(--font-size-sm)] text-text leading-[20px] inline-flex items-center gap-[var(--space-100)]">
              {currentLabel}
              <Info className="w-[12px] h-[12px] text-text-tertiary" />
              <span className="text-error ml-[var(--space-100)]">*</span>
            </label>
            <Input
              placeholder="请输入"
              value={currentName}
              onChange={(e) => {
                setCurrentName(e.target.value);
                if (error) setError(undefined);
              }}
              className={error ? "border-error" : ""}
              readOnly={isSubmitted}
            />
            {error && (
              <p className="text-[length:var(--font-size-xs)] text-error leading-[18px]">
                {error}
              </p>
            )}
          </div>
        </GenericFormCard>
      )}
    </div>
  );
}

/** 身份选项按钮：选中态使用 primary 边框 + 浅底 + 右下角三角勾选角标 */
function IdentityOption({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "relative flex items-center px-[var(--space-300)] py-[var(--space-200)] rounded-[var(--radius-200)] border transition-colors",
        "text-[length:var(--font-size-sm)] leading-[20px] shrink-0 overflow-hidden",
        "disabled:cursor-not-allowed",
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-border bg-bg-secondary/60 text-text hover:bg-bg-secondary",
        /** 禁用态：非选中项弱化显示，选中项保留选中色仅锁交互 */
        disabled && !selected && "opacity-60 hover:bg-bg-secondary/60",
      )}
    >
      <span>{label}</span>
      {selected && <CornerCheckBadge />}
    </button>
  );
}

/** 右下角三角形+勾的选中角标 */
function CornerCheckBadge() {
  return (
    <span
      className="pointer-events-none absolute bottom-0 right-0 block"
      aria-hidden
    >
      {/* 三角形底色 */}
      <span
        className="block w-0 h-0"
        style={{
          borderTop: "16px solid transparent",
          borderRight: "16px solid var(--color-primary)",
        }}
      />
      {/* 勾 */}
      <Check
        className="absolute right-[1px] bottom-[1px] w-[10px] h-[10px] text-white"
        strokeWidth={3}
      />
    </span>
  );
}
