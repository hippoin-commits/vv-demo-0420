import * as React from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { GenericCard } from "../main-ai/GenericCard";
import { ChatTaskFormFooter } from "../main-ai/task-detail/TaskChatCards";
import { cn } from "../ui/utils";
import { INVITE0421_ORG_COMPANY_NAME } from "../../constants/invite0421InvitedTodo";

/** 主 AI / IM 员工邀请：表单提交后的助手反馈（纯文案气泡） */
export const INVITE0421_ORG_EMPLOYEE_SUBMIT_SUCCESS_TEXT =
  "信息提交成功。我们将尽快完成后续流程。";

/** 与 `Invite0421MessageModule` / TaskFormFields 输入框同款 */
const INVITE_TASK_STYLE_FIELD_CLASS =
  "w-full h-[var(--space-900)] px-[var(--space-300)] rounded-[var(--radius-input)] border border-border bg-bg text-[length:var(--font-size-sm)] text-text";

export function Invite0421OrgEmployeeBasicInfoForm({
  frozen,
  onSubmit,
  titleBelowAccessory,
}: {
  frozen: boolean;
  onSubmit: (payload: { name: string; gender: string }) => void;
  titleBelowAccessory?: React.ReactNode;
}) {
  const [name, setName] = React.useState("");
  const [gender, setGender] = React.useState("保密");

  return (
    <GenericCard
      title="基本信息"
      titleBelowAccessory={titleBelowAccessory}
      className={cn("@container min-w-0", frozen && "opacity-[0.92]")}
    >
      <p className="mb-[var(--space-400)] text-[length:var(--font-size-xs)] text-text-secondary">
        请填写以下信息（演示数据，不提交真实后端）
      </p>

      <div className="flex w-full min-w-0 flex-col gap-[var(--space-400)]">
        <div className="flex w-full min-w-0 justify-start">
          <div
            className={cn(
              "flex size-[length:var(--space-1000)] shrink-0 items-center justify-center rounded-full border border-dashed border-border bg-bg-secondary text-text-tertiary",
              frozen && "cursor-not-allowed",
            )}
          >
            <span className="text-[length:var(--font-size-xs)]">头像</span>
          </div>
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-[var(--space-400)] @min-[length:calc(var(--space-800)*10+var(--space-400))]:grid-cols-2">
          <div className="flex min-w-0 flex-col gap-[length:var(--space-150)]">
            <Label htmlFor="invite0421-org-name" className="text-[length:var(--font-size-xs)] text-text-secondary">
              姓名（必填）<span className="text-destructive">*</span>
            </Label>
            <Input
              id="invite0421-org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
              readOnly={frozen}
              disabled={frozen}
              className={INVITE_TASK_STYLE_FIELD_CLASS}
            />
          </div>
          <div className="flex min-w-0 flex-col gap-[length:var(--space-150)]">
            <Label htmlFor="invite0421-org-gender" className="text-[length:var(--font-size-xs)] text-text-secondary">
              性别
            </Label>
            <Select value={gender} onValueChange={setGender} disabled={frozen}>
              <SelectTrigger id="invite0421-org-gender" className={INVITE_TASK_STYLE_FIELD_CLASS}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="保密">保密</SelectItem>
                <SelectItem value="男">男</SelectItem>
                <SelectItem value="女">女</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <ChatTaskFormFooter
        disabled={frozen}
        onReset={() => {
          if (frozen) return;
          setName("");
          setGender("保密");
        }}
        onConfirm={() => {
          if (frozen) return;
          onSubmit({ name: name.trim() || "yzhao", gender });
        }}
      />
    </GenericCard>
  );
}

export function Invite0421OrgEmployeeOnboardingIntroText() {
  return `感谢您选择加入${INVITE0421_ORG_COMPANY_NAME}！请完善您的基本信息，以便顺利完成加入流程。`;
}
