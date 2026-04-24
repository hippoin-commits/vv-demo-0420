/**
 * VV 应用框架图标（src/assets/vv-ai-frame-img）
 * 主导航：main-nav；底部应用区：app-nav（选中 on / 未选 off）
 * 主导航 AI 使用 PNG（AI.png / AI-selected.png），其余 main-nav、app-nav 为 SVG。
 */

import toolbarApps from "../../assets/vv-ai-frame-img/应用,分类,应用市场,app,category,market.png"
import toolbarRobot from "../../assets/vv-ai-frame-img/机器人,robot.png"
import toolbarSearch from "../../assets/vv-ai-frame-img/放大镜、搜索.png"
import toolbarSettings from "../../assets/vv-ai-frame-img/设置,齿轮,系统设置,set,gear,system settings.png"
import userAvatar from "../../assets/vv-ai-frame-img/头像 Avatar.png"

import mainAi from "../../assets/vv-ai-frame-img/main-nav/AI.png"
import mainAiSelected from "../../assets/vv-ai-frame-img/main-nav/AI-selected.png"

/** 对话区助手头像（与主导航「AI」未选中态一致，不用 Figma 机器人插图） */
export const vvAssistantChatAvatar: string = mainAi
import mainContacts from "../../assets/vv-ai-frame-img/main-nav/通讯录,用户管理,contact,user management.svg"
import mainContactsSelected from "../../assets/vv-ai-frame-img/main-nav/通讯录,contact-selected.svg"
import mainMessage from "../../assets/vv-ai-frame-img/main-nav/消息,messenger.svg"
import mainMessageSelected from "../../assets/vv-ai-frame-img/main-nav/消息,messenger-selected.svg"
import mainProfile from "../../assets/vv-ai-frame-img/main-nav/我的,个人中心,my,my cente.svg"
import mainProfileSelected from "../../assets/vv-ai-frame-img/main-nav/我的,my-selected.svg"
import mainWorkspace from "../../assets/vv-ai-frame-img/main-nav/工作台,应用服务,workplace,application service.svg"
import mainWorkspaceSelected from "../../assets/vv-ai-frame-img/main-nav/工作台,workplace-selected.svg"

import appCalendarOff from "../../assets/vv-ai-frame-img/app-nav/选项=日历, 选中=off.svg"
import appCalendarOn from "../../assets/vv-ai-frame-img/app-nav/选项=日历, 选中=on.svg"
import appDocsOff from "../../assets/vv-ai-frame-img/app-nav/选项=文档, 选中=off.svg"
import appDocsOn from "../../assets/vv-ai-frame-img/app-nav/选项=文档, 选中=on.svg"
import appEducationOff from "../../assets/vv-ai-frame-img/app-nav/选项=教育, 选中=off.svg"
import appEducationOn from "../../assets/vv-ai-frame-img/app-nav/选项=教育, 选中=on.svg"
import appGoalOff from "../../assets/vv-ai-frame-img/app-nav/选项=目标, 选中=off.svg"
import appGoalOn from "../../assets/vv-ai-frame-img/app-nav/选项=目标, 选中=on.svg"
import appMoreOff from "../../assets/vv-ai-frame-img/app-nav/选项=更多应用, 选中=off.svg"
import appMoreOn from "../../assets/vv-ai-frame-img/app-nav/选项=更多应用, 选中=on.svg"
import appPhoneOff from "../../assets/vv-ai-frame-img/app-nav/选项=电话, 选中=off.svg"
import appPhoneOn from "../../assets/vv-ai-frame-img/app-nav/选项=电话, 选中=on.svg"
import appProjectOff from "../../assets/vv-ai-frame-img/app-nav/选项=项目, 选中=off.svg"
import appProjectOn from "../../assets/vv-ai-frame-img/app-nav/选项=项目, 选中=on.svg"
import appTasksOff from "../../assets/vv-ai-frame-img/app-nav/选项=任务, 选中=off.svg"
import appTasksOn from "../../assets/vv-ai-frame-img/app-nav/选项=任务, 选中=on.svg"
import appTodoOff from "../../assets/vv-ai-frame-img/app-nav/选项=待办, 选中=off.svg"
import appTodoOn from "../../assets/vv-ai-frame-img/app-nav/选项=待办, 选中=on.svg"

export const vvAiFrameToolbar = {
  search: toolbarSearch,
  apps: toolbarApps,
  settings: toolbarSettings,
  robot: toolbarRobot,
} as const

/** 侧栏用户头像（Figma「头像 Avatar」） */
export const vvAiFrameUserAvatar = userAvatar

export type MainNavIconId =
  | "message"
  | "workspace"
  | "ai"
  | "contacts"
  | "profile"

/** 主导航图标：选中时用带 -selected 资源 */
export function getMainNavIconSrc(
  id: MainNavIconId,
  selected: boolean,
): string {
  if (id === "ai") {
    return selected ? mainAiSelected : mainAi
  }
  if (id === "message") {
    return selected ? mainMessageSelected : mainMessage
  }
  if (id === "workspace") {
    return selected ? mainWorkspaceSelected : mainWorkspace
  }
  if (id === "contacts") {
    return selected ? mainContactsSelected : mainContacts
  }
  return selected ? mainProfileSelected : mainProfile
}

/** 底部应用区：与 VVAppShellShortcutId 顺序一致；静态展示使用 off，后续可接选中态 on */
export const vvAiFrameAppNav = {
  todo: { off: appTodoOff, on: appTodoOn },
  education: { off: appEducationOff, on: appEducationOn },
  calendar: { off: appCalendarOff, on: appCalendarOn },
  docs: { off: appDocsOff, on: appDocsOn },
  phone: { off: appPhoneOff, on: appPhoneOn },
  tasks: { off: appTasksOff, on: appTasksOn },
  project: { off: appProjectOff, on: appProjectOn },
  goal: { off: appGoalOff, on: appGoalOn },
  more: { off: appMoreOff, on: appMoreOn },
} as const
