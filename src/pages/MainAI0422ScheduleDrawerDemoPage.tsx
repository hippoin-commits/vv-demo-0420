import * as React from "react"
import { MainAI } from "../components/main-ai/MainAI"
import { SCHEDULE_0422_CONVERSATION_ID } from "../components/schedule-0422/schedule0422Model"

/**
 * 0422-日程-抽屉交互细节演示：沿用主 AI 壳（侧栏、顶栏、对话区、输入框），对话内嵌「全部日程」列表卡；
 * 点击条目打开与 Home「业务入口」同结构的抽屉（详情卡逻辑对齐来源 `ScheduleDetailCard`）。
 */
export function MainAI0422ScheduleDrawerDemoPage() {
  return (
    <MainAI
      hasOrganization
      schedule0422DrawerDemo
      initialConversationId={SCHEDULE_0422_CONVERSATION_ID}
      alwaysShowIndependentWindow
    />
  )
}
