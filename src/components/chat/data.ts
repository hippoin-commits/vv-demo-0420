import { vvAssistantChatAvatar } from "../vv-app-shell/vv-ai-frame-assets"
import userAvatar from "figma:asset/82646def8a61cdad4e2cbba3209910b1f157760c.png"

export type User = {
  id: string
  name: string
  avatar: string
  status: 'online' | 'offline' | 'away'
}

/** 从某张会话卡片上的操作打开新卡片时写入；用于卡片外右上角「操作来源」 */
export type MessageOperationSource = {
  /** 来源类型/场景，如「任务管理」「任务」「任务详情」 */
  cardTitle: string
  sourceMessageId: string
  /** 来源上的具体对象名（如任务名），与 cardTitle 组合为「任务  周报模板迭代」 */
  sourceDetailLabel?: string
  /** 来源消息所在会话 id；与当前消息所在会话不一致时不展示操作来源（如跨租户/切换对话后插入的卡片） */
  sourceConversationId?: string
}

export type Message = {
  id: string
  senderId: string
  content: string
  timestamp: string
  createdAt?: number
  isReadonly?: boolean
  formData?: any
  isAfterPrompt?: boolean
  /** 与同一条助手回合中的上一条消息共用头像（不重复显示头像） */
  suppressAvatar?: boolean
  operationSource?: MessageOperationSource
}

export type Conversation = {
  id: string
  user: User
  messages: Message[]
  unread: number
  /** 0419 方案探索等：侧栏展示的会话标题（模拟 AI 根据首条用户内容生成）；未设置时侧栏回退末条消息文案 */
  sessionTitle?: string
}

export const currentUser: User = {
  id: 'me',
  name: '我',
  avatar: userAvatar,
  status: 'online'
}

export const users: User[] = [
  {
    id: 'ai-assistant',
    name: '微微AI',
    avatar: vvAssistantChatAvatar,
    status: 'online'
  },
  {
    id: 'ai-helper',
    name: '智能助手',
    avatar: vvAssistantChatAvatar,
    status: 'online'
  },
  {
    id: 'ai-writer',
    name: '写作助手',
    avatar: vvAssistantChatAvatar,
    status: 'online'
  }
]

export const conversations: Conversation[] = [
  {
    id: 'c1',
    user: users[0],
    unread: 0,
    messages: [
      { id: "m1", senderId: "me", content: "Text Content", timestamp: "14:58", createdAt: Date.now() - 300000 },
      {
        id: "m2a",
        senderId: "ai-assistant",
        content: "Text Content",
        timestamp: "14:59",
        createdAt: Date.now() - 240000,
      },
      { id: "m3", senderId: "me", content: "Text Content", timestamp: "15:00", createdAt: Date.now() - 180000 },
      { id: "m4", senderId: "ai-assistant", content: "Text Content", timestamp: "15:01", createdAt: Date.now() - 120000 },
    ],
  },
  {
    id: 'c2',
    user: users[1],
    unread: 1,
    messages: [
      { id: 'm1', senderId: 'me', content: '帮我写一份关于人工智能发展趋势的报告大纲。', timestamp: 'Yesterday', createdAt: Date.now() - 86400000 },
      { id: 'm2', senderId: 'ai-helper', content: '没问题，以下是关于人工智能发展趋势的报告大纲草案：\n\n1. 引言\n2. 技术突破\n3. 行业应用\n4. 伦理与挑战\n5. 未来展望\n\n你需要我针对某一部分详细展开吗？', timestamp: 'Yesterday', createdAt: Date.now() - 86395000 },
    ]
  },
  {
    id: 'c3',
    user: users[2],
    unread: 0,
    messages: [
      { id: 'm1', senderId: 'ai-writer', content: '上次的文章修改建议你看了吗？觉得如何？', timestamp: '2 days ago', createdAt: Date.now() - 172800000 },
    ]
  },
  /** 0422-日程-抽屉交互细节演示：主 AI 对话内嵌「全部日程」列表卡（与 `SCHEDULE_0422_ALL_LIST_MARKER` 一致） */
  {
    id: "c-schedule-0422-demo",
    user: users[0],
    unread: 0,
    sessionTitle: "0422 日程抽屉演示",
    messages: [
      {
        id: "sch0422-w1",
        senderId: "ai-assistant",
        content: "好的，已为你打开全部日程列表（演示数据）。点击列表中的日程可查看详情。",
        timestamp: "10:00",
        createdAt: Date.now() - 3_600_000,
      },
      {
        id: "sch0422-card",
        senderId: "ai-assistant",
        content: "<<<RENDER_SCHEDULE_0422_ALL_LIST>>>",
        timestamp: "10:01",
        createdAt: Date.now() - 3_500_000,
      },
    ],
  },
  /** 0415-邮箱-在抽屉查看邮件内容：顶栏「全部 / 租户 / 个人」与邮箱分桶消息对齐 */
  {
    id: 'mail-scope-all',
    user: users[0],
    unread: 0,
    messages: [],
  },
  {
    id: 'mail-scope-personal',
    user: users[0],
    unread: 0,
    messages: [],
  },
  {
    id: 'mail-scope-tenant-xiaoce',
    user: users[0],
    unread: 0,
    messages: [],
  },
  {
    id: 'mail-scope-tenant-default',
    user: users[0],
    unread: 0,
    messages: [],
  },
  {
    id: 'mail-scope-tenant-test',
    user: users[0],
    unread: 0,
    messages: [],
  },
]

/** 邮箱应用（email0415）：顶栏「全部 / 租户 / 个人」各对应独立会话线程（与本地 mailMessagesByScope 对齐） */
export function mailScopeToConversationId(scope: "all" | "personal" | string): string {
  if (scope === "all") return "mail-scope-all";
  if (scope === "personal") return "mail-scope-personal";
  return `mail-scope-tenant-${scope}`;
}

export function conversationIdToMailScope(id: string): "all" | "personal" | string | null {
  if (id === "mail-scope-all") return "all";
  if (id === "mail-scope-personal") return "personal";
  const m = /^mail-scope-tenant-(.+)$/.exec(id);
  return m ? m[1] : null;
}
