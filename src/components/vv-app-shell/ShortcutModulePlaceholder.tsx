import type { VVAppShellShortcutId } from "./VVAppShell"

const MODULE_LABEL: Record<VVAppShellShortcutId, string> = {
  todo: "待办",
  education: "教育",
  calendar: "日历",
  docs: "文档",
  phone: "电话",
  tasks: "任务",
  project: "项目",
  goal: "目标",
  more: "更多应用",
}

/**
 * 侧栏底部应用选中后的空白占位，后续替换为具体应用模块。
 */
export function ShortcutModulePlaceholder({
  shortcutId,
}: {
  shortcutId: VVAppShellShortcutId
}) {
  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 flex-col bg-bg-secondary"
      role="region"
      aria-label={`${MODULE_LABEL[shortcutId]}应用内容占位`}
      data-shortcut-module-placeholder={shortcutId}
    />
  )
}
