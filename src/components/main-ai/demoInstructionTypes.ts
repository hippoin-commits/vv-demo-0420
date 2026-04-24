import type { VVAppShellPrimaryNavId, VVAppShellShortcutId } from "../vv-app-shell/VVAppShell"

/** 交互规范文档页：大纲演示链接等触发，由 MainAI 统一消费 */
export type DemoInstructionCommand =
  | { kind: "primaryNav"; id: VVAppShellPrimaryNavId }
  | { kind: "invite0421ShellGate"; id: VVAppShellShortcutId }
  | { kind: "invite0421OpenEducation" }
  | { kind: "navigate"; path: string }
  /** 交互规范文档「自然语言对话」：切主 AI、预填输入框；用户点发送或回车后由聊天窗追加一条自然对话式演示回复 */
  | { kind: "prefillNaturalDialogDemo" }
