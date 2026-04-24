import type { MailSettingsPageId, MailSignatureEditorMarkerPayload } from "./emailCuiData";
import { MailAccountsSettingsCard } from "./MailAccountsSettingsCard";
import { MailSenderSettingsCard } from "./MailSenderSettingsCard";
import { MailSignatureSettingsCard } from "./MailSignatureSettingsCard";

export function MailSettingsCuiCard({
  page,
  onRequestSignatureEditor,
}: {
  page: MailSettingsPageId;
  /** 签名设置页：在会话中打开新建/编辑签名卡片 */
  onRequestSignatureEditor?: (payload: MailSignatureEditorMarkerPayload) => void;
}) {
  if (page === "signature") {
    return <MailSignatureSettingsCard onRequestSignatureEditor={onRequestSignatureEditor} />;
  }
  if (page === "sender") {
    return <MailSenderSettingsCard />;
  }
  if (page === "accounts") {
    return <MailAccountsSettingsCard />;
  }
  return null;
}
