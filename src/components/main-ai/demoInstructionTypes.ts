/** 交互规范文档页：大纲演示链接等触发，由 MainAI 统一消费 */
export type DemoInstructionCommand =
  /** 交互规范文档「自然语言对话」：切主 AI、预填输入框；用户点发送或回车后由聊天窗追加一条自然对话式演示回复 */
  | { kind: "prefillNaturalDialogDemo" }
  /** 交互规范文档「业务指令→卡片」：切主 AI、预填含业务关键词的句子；用户发送后主 AI 流中追加一条交互式通用卡片（演示） */
  | { kind: "prefillBusinessCardCommandDemo" }
  /**
   * 交互规范文档「3.2」：若不在主 AI 则切回主 AI，并在主 AI 对话流插入 0425 组织管理演示卡；
   * 默认在卡片内标题下展示组织切换（方案1）；可通过行动建议切换为卡外左对齐、与顶栏一致的组织切换入口（方案2，无底色、无创建/加入区）。
   */
  | { kind: "showMainAiOrgManagementSwitcherDemo" }
  /** 交互规范文档「5.1」：切至主导航「消息」并展示 IM 界面框架（MCP 设计对齐，演示） */
  | { kind: "openImFrameworkDemo" }
  /** 交互演示指令集：生成长对话并滚离底部，用于展示「去底部」按钮阈值 */
  | { kind: "showScrollToBottomThresholdDemo" }
  /** 交互演示指令集：只切回主 AI 并预填指令，不直接生成对话内容 */
  | { kind: "prefillMainAiDemoPrompt"; prompt: string }
