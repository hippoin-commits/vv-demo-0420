/**
 * Home「业务入口」/ IM 员工抽屉 / 日程业务入口 / 其它 **CUI 对话抽屉** 共用的 `SheetContent` 外壳样式。
 *
 * 完整壳层结构约定见 `.cursor/rules/cui-drawer-business-entry.mdc`，实现参考：
 * `Schedule0422BusinessDrawer`、`Invite0421MessageModule` 内 Sheet 抽屉。
 */
export const CHAT_BUSINESS_ENTRY_DRAWER_SHEET_CLASSNAME =
  "h-full w-[70vw] max-w-[70vw] sm:max-w-[70vw] p-0 border-none rounded-l-[length:var(--radius-400)] overflow-hidden flex flex-col gap-0 shadow-2xl [&>button]:hidden" as const;
