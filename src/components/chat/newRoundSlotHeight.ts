/**
 * 新一轮对话槽位高度（px），与 `MainAIChatWindow` 中 `armNewRoundForUserSend` 写入 `newRoundSlot.slotHeightPx` 的算法一致。
 * 「去底部」按钮的显示阈值应调用本函数，以便与槽位调整同步。
 */
export type NewRoundSlotHeightInput = {
  /** 对话滚动容器 `clientHeight`（顶栏下、底栏上的可视区） */
  chatClientHeight: number;
  /** 滚动区内吸顶块（如待办卡）占位高度；无则 0 */
  pinOverlayHeight: number;
  /** 交互规范文档页等：`slotBand × 0.7`；否则为整段 `slotBand` */
  demoInstructionShell: boolean;
};

export function computeNewRoundSlotHeightPx(input: NewRoundSlotHeightInput): number {
  const slotBandPx = Math.max(0, input.chatClientHeight - input.pinOverlayHeight);
  return input.demoInstructionShell
    ? Math.max(200, Math.round(slotBandPx * 0.7))
    : Math.max(200, slotBandPx);
}
