import type { VVAppShellPrimaryNavId } from "./VVAppShell"

const MODULE_LABEL: Record<VVAppShellPrimaryNavId, string> = {
  message: "消息",
  workspace: "工作台",
  ai: "AI",
  contacts: "通讯录",
  profile: "我的",
}

/**
 * 主导航对应模块的空白占位区，后续替换为各模块具体实现。
 */
export function NavModulePlaceholder({
  navId,
}: {
  navId: VVAppShellPrimaryNavId
}) {
  return (
    <div
      className="flex min-h-0 min-w-0 flex-1 flex-col bg-bg-secondary"
      role="region"
      aria-label={`${MODULE_LABEL[navId]}模块内容占位`}
      data-nav-module-placeholder={navId}
    />
  )
}
