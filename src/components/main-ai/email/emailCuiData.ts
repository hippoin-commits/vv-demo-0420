import courseIcon from "../../../assets/ac6e3391c1eb88804cbf0804668d449463a1e1a3.png";
import membersIcon from "../../../assets/ecb04190c46a6ecd790d2bc345d963ba9a4a8f0b.png";
import calendarIcon from "../../../assets/e653b0a7cada3ea08e52cb29bc4bd546be59d3d5.png";
import profileIcon from "../../../assets/a9b0f43698a9015397dc60f26d1ea217390fec97.png";
/** 底栏「邮箱管理」入口图标（与「我的邮箱」区分） */
import diskIcon from "../../../assets/78530a18370215c595d4c989d64c188f7450dbda.png";

/** 对话卡片：邮箱列表（与任务侧 marker 一致风格） */
export const MAIL_MAILBOX_MARKER = "<<<MAIL_MAILBOX_CARD>>>";

/** 特殊卡片：收到新邮件（一级 我的/业务 → 二级仅含未读的邮箱地址与列表），与普通邮箱列表卡规则独立 */
export const MAIL_NEW_MAIL_DIGEST_MARKER = "<<<MAIL_NEW_MAIL_DIGEST>>>";

/** 对话卡片：邮箱设置列表（账号/签名/发件人） */
export const MAIL_SETTINGS_MARKER = "<<<MAIL_SETTINGS_CARD>>>";

/** 底栏「邮箱管理」：当前为全部/个人时，引导选择租户（0415-邮箱-在抽屉查看邮件内容） */
export const MAIL_TENANT_PICK_FOR_ADMIN_MARKER = "<<<MAIL_TENANT_PICK_FOR_ADMIN>>>";

/** 底栏「邮箱管理」：已在具体租户上下文中时的管理面板（业务邮箱 / 员工邮箱） */
export const MAIL_MAIL_ADMIN_PANEL_MARKER = "<<<MAIL_MAIL_ADMIN_PANEL>>>";

export type MailAdminPanelKind = "business" | "staff";

/** 对话卡片：新邮件写信界面（发件人下拉 + 收件人/抄送/主题/正文） */
export const MAIL_COMPOSE_ENTRY_MARKER = "<<<MAIL_COMPOSE_ENTRY_CARD>>>";

/** 对话卡片：在会话中阅读单封邮件（0417 方案，替代右侧抽屉） */
export const MAIL_READ_IN_CHAT_MARKER = "<<<MAIL_READ_IN_CHAT_CARD>>>";

/** 对话卡片：新建 / 编辑邮件签名（替代弹窗） */
export const MAIL_SIGNATURE_EDITOR_MARKER = "<<<MAIL_SIGNATURE_EDITOR_CARD>>>";

/** 推入签名编辑卡片时的载荷（演示） */
export type MailSignatureEditorMarkerPayload = {
  mode: "create" | "edit";
  mailboxId: string;
  signatureId?: string;
};

/** 从读信抽屉发起的写信场景 */
export type MailComposeAction = "reply" | "replyAll" | "forward";

/** 推入写信卡片时可选默认发件邮箱（演示） */
export type MailComposeEntryPayload = {
  defaultPersonalMailboxId?: string;
  defaultBusinessMailboxId?: string;
  /** 从草稿箱列表点入：演示数据 `DEMO_MAILS` 中的邮件 id，用于预填「编辑草稿」卡片 */
  draftMailId?: string;
  /** 从读信抽屉：回复 / 全部回复 / 转发，与 `sourceMailId` 联用 */
  composeAction?: MailComposeAction;
  /** 演示数据 `DEMO_MAILS` 中当前阅读的邮件 id */
  sourceMailId?: string;
};

export type MailFolderId = "inbox" | "sent" | "drafts" | "trash";

export type MailScope = "all" | "personal" | string;

/** 用户本人私用邮箱（相对业务邮箱），演示：多账号 + 未读数；菜单与卡标题展示邮箱地址 */
export type PersonalMailboxDemo = {
  id: string;
  email: string;
  unread: number;
};

/** 演示：三个私人邮箱账号（接入后端后由账号列表替换） */
export const DEMO_PERSONAL_MAILBOXES: PersonalMailboxDemo[] = [
  { id: "pm_work", email: "zhangsan.work@company.com", unread: 1 },
  { id: "pm_life", email: "zhangsan.private@gmail.com", unread: 0 },
  { id: "pm_backup", email: "zhangsan.backup@icloud.com", unread: 0 },
];

/** 业务邮箱账号（演示：2 个），与 DEMO_MAILS 中 businessMailboxId 对应 */
export type BusinessMailboxDemo = {
  id: string;
  email: string;
};

export const DEMO_BUSINESS_MAILBOXES: BusinessMailboxDemo[] = [
  { id: "bm_product", email: "product@company.com" },
  { id: "bm_finance", email: "finance@company.com" },
];

/** Radix Select 等业务用的合成 value：`personal:pm_work` / `business:bm_product` */
export function defaultComposeSelectValue(payload: MailComposeEntryPayload | undefined): string {
  const p = payload ?? {};
  if (p.defaultBusinessMailboxId) {
    const m = DEMO_BUSINESS_MAILBOXES.find((x) => x.id === p.defaultBusinessMailboxId);
    if (m) return `business:${m.id}`;
  }
  if (p.defaultPersonalMailboxId) {
    const m = DEMO_PERSONAL_MAILBOXES.find((x) => x.id === p.defaultPersonalMailboxId);
    if (m) return `personal:${m.id}`;
  }
  return `personal:${DEMO_PERSONAL_MAILBOXES[0].id}`;
}

export function resolveComposeMailboxFromSelect(value: string): {
  bucket: "我的邮箱" | "业务邮箱";
  email: string;
} | null {
  const sep = value.indexOf(":");
  if (sep < 0) return null;
  const kind = value.slice(0, sep);
  const id = value.slice(sep + 1);
  if (kind === "personal") {
    const m = DEMO_PERSONAL_MAILBOXES.find((x) => x.id === id);
    return m ? { bucket: "我的邮箱", email: m.email } : null;
  }
  if (kind === "business") {
    const m = DEMO_BUSINESS_MAILBOXES.find((x) => x.id === id);
    return m ? { bucket: "业务邮箱", email: m.email } : null;
  }
  return null;
}

export function countUnreadInBusinessMailbox(businessMailboxId: string): number {
  return DEMO_MAILS.filter(
    (r) => r.kind === "business" && r.businessMailboxId === businessMailboxId && r.unread
  ).length;
}

export function countUnreadInPersonalMailbox(personalMailboxId: string): number {
  return DEMO_MAILS.filter(
    (r) => r.kind === "personal" && r.personalMailboxId === personalMailboxId && r.unread
  ).length;
}

const MY_MAILBOX_SUBMENU: Array<{ id: string; name: string; iconKey: string }> = [
  { id: "my_inbox", name: "收件箱", iconKey: "mail_inbox" },
  { id: "my_sent", name: "发件箱", iconKey: "mail_sent" },
  { id: "my_drafts", name: "草稿箱", iconKey: "mail_draft" },
];

const BUSINESS_MAILBOX_SUBMENU: Array<{ id: string; name: string; iconKey: string }> = [
  { id: "biz_inbox", name: "收件箱", iconKey: "mail_inbox" },
  { id: "biz_sent", name: "发件箱", iconKey: "mail_sent" },
  { id: "biz_drafts", name: "草稿箱", iconKey: "mail_draft" },
];

/**
 * 底栏邮箱区：收发邮件（hover：收邮件 / 写邮件）→ 我的邮箱（二级）→ 业务邮箱（二级）→ 设置
 */
export const MAIL_DOCK_APPS = [
  {
    id: "mail_send_receive",
    name: "收发邮件",
    imageSrc: courseIcon,
    menu: [
      { id: "sub_fetch", name: "收邮件", iconKey: "mail_inbox" },
      { id: "sub_compose", name: "写邮件", iconKey: "mail_edit" },
    ],
  },
  {
    id: "mail_my",
    name: "我的邮箱",
    imageSrc: profileIcon,
    menu: MY_MAILBOX_SUBMENU,
  },
  {
    id: "mail_business",
    name: "业务邮箱",
    imageSrc: membersIcon,
    menu: BUSINESS_MAILBOX_SUBMENU,
  },
  {
    id: "mail_settings",
    name: "邮箱设置",
    imageSrc: calendarIcon,
    menu: [
      { id: "set_accounts", name: "邮箱管理", iconKey: "mail_settings_accounts" },
      { id: "set_signature", name: "签名设置", iconKey: "mail_settings_signature" },
      { id: "set_sender", name: "发件人设置", iconKey: "mail_settings_sender" },
    ],
  },
];

/**
 * 0415-邮箱-在抽屉查看邮件内容 底栏：收发邮件 → 我的邮箱 → 业务邮箱 → 邮箱设置（无账号管理子项）→ 邮箱管理（二级：业务/员工）
 */
export const MAIL_DOCK_APPS_EMAIL0415 = [
  MAIL_DOCK_APPS[0],
  MAIL_DOCK_APPS[1],
  MAIL_DOCK_APPS[2],
  {
    id: "mail_settings",
    name: "邮箱设置",
    imageSrc: calendarIcon,
    menu: [
      { id: "set_signature", name: "签名设置", iconKey: "mail_settings_signature" },
      { id: "set_sender", name: "发件人设置", iconKey: "mail_settings_sender" },
    ],
  },
  {
    id: "mail_admin",
    name: "邮箱管理",
    imageSrc: diskIcon,
    menu: [
      { id: "admin_business_mail", name: "管理业务邮箱", iconKey: "mail_admin_business" },
      { id: "admin_staff_mail", name: "管理员工邮箱", iconKey: "mail_admin_staff" },
    ],
  },
];

/** @deprecated 使用 MAIL_DOCK_APPS */
export const EMAIL_APPS = MAIL_DOCK_APPS;

export type DemoMailRow = {
  id: string;
  subject: string;
  /** 发件人地址或标识（列表副行，可与 fromDisplayName 搭配） */
  from: string;
  /** 列表主行发件人名称；缺省时主行使用 from（如「我」或纯邮箱） */
  fromDisplayName?: string;
  /** 列表行圆形头像；缺省用名称/地址首字（含中文首字） */
  fromAvatarUrl?: string;
  preview: string;
  time: string;
  unread?: boolean;
  /** personal | business */
  kind: "personal" | "business";
  /** 个人邮箱账号（私用多邮箱时） */
  personalMailboxId?: string;
  /** 业务邮箱账号（多业务邮箱时） */
  businessMailboxId?: string;
};

export const DEMO_MAILS: DemoMailRow[] = [
  {
    id: "m1",
    subject: "【产品】周报待确认",
    from: "zhangsan@company.com",
    fromDisplayName: "张三",
    fromAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan-work",
    preview: "请在周五前确认本周迭代范围…",
    time: "10:24",
    unread: true,
    kind: "business",
    businessMailboxId: "bm_product",
  },
  {
    id: "m2",
    subject: "Re: 设计稿反馈",
    from: "我",
    preview: "已按评论更新 Figma，请查收。",
    time: "昨天",
    unread: true,
    kind: "personal",
    personalMailboxId: "pm_work",
  },
  {
    id: "m3",
    subject: "发票已开具",
    from: "finance@company.com",
    fromDisplayName: "财务部",
    fromAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=finance-dept",
    preview: "电子发票见附件。",
    time: "周一",
    kind: "business",
    businessMailboxId: "bm_finance",
  },
  {
    id: "m5",
    subject: "订阅确认",
    from: "newsletters@example.com",
    fromDisplayName: "生活资讯",
    preview: "感谢订阅生活类资讯。",
    time: "09:00",
    kind: "personal",
    personalMailboxId: "pm_life",
  },
  {
    id: "m6",
    subject: "【HR】年假余额提醒",
    from: "hr@company.com",
    fromDisplayName: "人力资源部",
    fromAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=hr-notice",
    preview: "您本年度剩余年假 3 天，请于年底前安排。",
    time: "昨天",
    kind: "personal",
    personalMailboxId: "pm_work",
  },
  {
    id: "m7",
    subject: "会议室预定成功：评审室 A",
    from: "rooms@company.com",
    fromDisplayName: "会议室系统",
    preview: "已锁定明日 14:00–15:00，请准时参加。",
    time: "昨天",
    kind: "personal",
    personalMailboxId: "pm_work",
  },
  {
    id: "m8",
    subject: "[Confluence] 页面「迭代看板」有更新",
    from: "noreply@confluence.local",
    fromDisplayName: "Confluence",
    preview: "李四 更新了 3 处内容，点击查看差异。",
    time: "周二",
    kind: "personal",
    personalMailboxId: "pm_work",
  },
  {
    id: "m9",
    subject: "本月信用卡账单已出",
    from: "billing@bank.example",
    fromDisplayName: "银行账单",
    preview: "账单金额 ¥1,248.50，还款日 25 日。",
    time: "周二",
    kind: "personal",
    personalMailboxId: "pm_life",
  },
  {
    id: "m10",
    subject: "你在 LinkedIn 有新的好友请求",
    from: "invitations@linkedin.com",
    fromDisplayName: "LinkedIn",
    fromAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=linkedin-invite",
    preview: "王五 希望与你建立联系。",
    time: "周一",
    kind: "personal",
    personalMailboxId: "pm_life",
  },
  {
    id: "m11",
    subject: "iCloud 同步已完成",
    from: "noreply@icloud.com",
    fromDisplayName: "iCloud",
    preview: "12 张照片已备份至云端。",
    time: "周日",
    kind: "personal",
    personalMailboxId: "pm_backup",
  },
  {
    id: "m12",
    subject: "登录验证",
    from: "security@service.io",
    fromDisplayName: "安全中心",
    preview: "验证码 582391，10 分钟内有效。",
    time: "10:02",
    kind: "personal",
    personalMailboxId: "pm_backup",
  },
  {
    id: "m13",
    subject: "需求评审纪要 - V2.3",
    from: "pm@company.com",
    fromDisplayName: "产品邮箱",
    fromAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=pm-mailbox",
    preview: "结论：P0 两项本周排期，附件为决策表。",
    time: "09:40",
    kind: "business",
    businessMailboxId: "bm_product",
  },
  {
    id: "m14",
    subject: "Build #2048 已通过",
    from: "ci@company.com",
    fromDisplayName: "CI 机器人",
    preview: "main 分支构建成功，可部署测试环境。",
    time: "08:55",
    kind: "business",
    businessMailboxId: "bm_product",
  },
  {
    id: "m15",
    subject: "报销单 #8821 已审批",
    from: "expense@company.com",
    fromDisplayName: "费用系统",
    preview: "款项将在 3 个工作日内原路退回。",
    time: "昨天",
    kind: "business",
    businessMailboxId: "bm_finance",
  },
  {
    id: "m16",
    subject: "2025Q1 对账单",
    from: "finance@company.com",
    fromDisplayName: "财务对账",
    preview: "请核对附件 PDF，如有疑问联系对口财务。",
    time: "周一",
    kind: "business",
    businessMailboxId: "bm_finance",
  },
  {
    id: "m17",
    subject: "报价单已发送给客户 A",
    from: "我",
    preview: "详见附件 PDF，有效期 14 天。",
    time: "周三",
    kind: "personal",
    personalMailboxId: "pm_work",
  },
  {
    id: "m18",
    subject: "Re: 版本排期同步",
    from: "partner@vendor.com",
    fromDisplayName: "合作伙伴",
    fromAvatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=vendor-partner",
    preview: "研发已确认里程碑，请本周五前反馈排期。",
    time: "周二",
    kind: "business",
    businessMailboxId: "bm_product",
  },
  {
    id: "m19",
    subject: "付款申请需补充材料",
    from: "audit@company.com",
    fromDisplayName: "内审流程",
    preview: "请补传盖章版合同扫描件后重新提交。",
    time: "周一",
    kind: "business",
    businessMailboxId: "bm_finance",
  },
  {
    id: "m20",
    subject: "会议纪要：季度规划",
    from: "我",
    preview: "附件为今日会议要点与待办，请各 owner 认领。",
    time: "周四",
    kind: "business",
    businessMailboxId: "bm_product",
  },
];

/** 列表区域过高时在卡片内滚动（与主会话区滚动解耦） */
export const MAIL_LIST_BODY_SCROLL_CLASS =
  "max-h-[min(400px,52vh)] overflow-y-auto overflow-x-hidden overscroll-y-contain [scrollbar-gutter:stable]";

export type MailSettingsPageId = "accounts" | "signature" | "sender";

export function mailSettingsPageTitle(page: MailSettingsPageId): string {
  switch (page) {
    case "accounts":
      return "邮箱管理";
    case "signature":
      return "签名设置";
    case "sender":
      return "发件人设置";
    default:
      return "邮箱设置";
  }
}

/** 同一归属（邮箱）下最多可创建的邮件签名数量（演示与产品规则一致） */
export const MAX_DEMO_MAIL_SIGNATURES_PER_MAILBOX = 10;

/** 演示：单条邮件签名（按 mailboxId 隔离存储） */
export type DemoMailSignature = {
  id: string;
  title: string;
  /** 签名正文（演示；列表仅展示标题） */
  body: string;
  isDefault: boolean;
};

/** 演示初始数据：与签名设置卡片设计稿一致，每个邮箱独立一套 */
export function buildInitialDemoSignaturesByMailbox(): Record<string, DemoMailSignature[]> {
  return {
    pm_work: [
      { id: "sig-pm-work-1", title: "111111", body: "张三 · 产品组\nzhangsan.work@company.com", isDefault: true },
      { id: "sig-pm-work-2", title: "哈哈哈", body: "（空）", isDefault: false },
    ],
    pm_life: [{ id: "sig-pm-life-1", title: "生活签名", body: "个人邮箱联系用", isDefault: true }],
    pm_backup: [{ id: "sig-pm-bak-1", title: "备用邮箱签名", body: "", isDefault: true }],
    bm_product: [{ id: "sig-bm-prod-1", title: "产品团队", body: "Product Team", isDefault: true }],
    bm_finance: [{ id: "sig-bm-fin-1", title: "财务对公", body: "Finance · 对公业务", isDefault: true }],
  };
}

/** 演示：用于首屏欢迎语（未读/草稿等） */
export function getDemoMailWelcomeDigest() {
  const unreadRows = DEMO_MAILS.filter((r) => r.unread);
  const unreadTotal = unreadRows.length;
  const unreadPersonal = unreadRows.filter((r) => r.kind === "personal").length;
  const unreadBusiness = unreadRows.filter((r) => r.kind === "business").length;
  /** 演示：草稿数量占位，接入真实数据后由服务端返回 */
  const draftCount = 1;
  return { unreadTotal, unreadPersonal, unreadBusiness, draftCount };
}

/** 「我的邮箱」侧（聚合全部私人邮箱）未读数量（演示数据） */
export function getDemoMyMailboxUnreadCount(): number {
  return DEMO_MAILS.filter((r) => r.kind === "personal" && r.unread).length;
}

/** 业务邮箱未读总数（演示数据） */
export function getDemoBusinessUnreadTotal(): number {
  return DEMO_MAILS.filter((r) => r.kind === "business" && r.unread).length;
}

/** 演示：是否存在任意未读（用于首屏种子 / 收邮件） */
export function getDemoAnyUnreadMail(): boolean {
  return DEMO_MAILS.some((r) => r.unread);
}

/** 「收到新邮件」卡片：仅包含有未读的私人邮箱账号 */
export function demoPersonalMailboxesWithUnread(): PersonalMailboxDemo[] {
  return DEMO_PERSONAL_MAILBOXES.filter((m) => countUnreadInPersonalMailbox(m.id) > 0);
}

/** 「收到新邮件」卡片：仅包含有未读的业务邮箱账号 */
export function demoBusinessMailboxesWithUnread(): BusinessMailboxDemo[] {
  return DEMO_BUSINESS_MAILBOXES.filter((m) => countUnreadInBusinessMailbox(m.id) > 0);
}

/** 首段引导：以「我的邮箱」为主，分有/无未读两种话术（演示数据） */
export function getDemoMailWelcomeGreeting(): string {
  const myUnread = getDemoMyMailboxUnreadCount();
  const bizUnread = DEMO_MAILS.filter((r) => r.kind === "business" && r.unread).length;
  if (myUnread > 0) {
    return `你好。你的「我的邮箱」有 ${myUnread} 封未读邮件，下方已自动展开未读列表（演示）。点击列表行可在右侧读正文。`;
  }
  const bizHint = bizUnread > 0 ? `业务邮箱侧还有 ${bizUnread} 封未读。` : "";
  return `你好。「我的邮箱」暂无未读。${bizHint}可使用下方入口打开「我的邮箱」「业务邮箱」或撰写新邮件（演示）。`;
}

/** 与首屏行动建议一致：我的邮箱 / 业务邮箱 / 写邮件（compose） */
export type MailWelcomeActionKind = "personal_inbox" | "business_inbox" | "compose";

export function folderTitle(folder: MailFolderId): string {
  switch (folder) {
    case "inbox":
      return "收件箱";
    case "sent":
      return "发件箱";
    case "drafts":
      return "草稿箱";
    case "trash":
      return "已删除";
    default:
      return "邮件";
  }
}

export type MailListFilter = "all" | "unread";

/** 演示数据过滤（接入后端后替换） */
export function filterDemoMailRows(
  folder: MailFolderId,
  scope: MailScope,
  personalMailboxId?: string,
  listFilter: MailListFilter = "all",
  businessMailboxId?: string
): DemoMailRow[] {
  let rows: DemoMailRow[];
  if (folder === "drafts") {
    let base: DemoMailRow[];
    if (scope === "personal" || scope === "all") {
      base = DEMO_MAILS.filter((r) => r.kind === "personal");
      if (personalMailboxId) {
        base = base.filter((r) => r.personalMailboxId === personalMailboxId);
      }
    } else {
      base = DEMO_MAILS.filter((r) => r.kind === "business");
      if (businessMailboxId) {
        base = base.filter((r) => r.businessMailboxId === businessMailboxId);
      }
    }
    rows = base.slice(0, 5).map((r) => ({
      ...r,
      subject: `[草稿] ${r.subject}`,
      unread: true,
    }));
  } else if (folder === "trash") {
    rows = DEMO_MAILS.filter((r) => ["m7", "m10", "m14", "m16"].includes(r.id));
  } else if (folder === "sent") {
    const sentBase = DEMO_MAILS.filter((r) => r.from === "我" || r.preview.includes("已按"));
    if (scope === "all") {
      rows = sentBase;
    } else if (scope === "personal") {
      rows = sentBase.filter((r) => r.kind === "personal");
      if (personalMailboxId) {
        rows = rows.filter((r) => r.personalMailboxId === personalMailboxId);
      }
    } else {
      rows = sentBase.filter((r) => r.kind === "business");
      if (businessMailboxId) {
        rows = rows.filter((r) => r.businessMailboxId === businessMailboxId);
      }
    }
  } else if (folder === "inbox") {
    if (scope === "all") {
      rows = DEMO_MAILS;
    } else if (scope === "personal") {
      rows = DEMO_MAILS.filter((r) => r.kind === "personal");
      if (personalMailboxId) {
        rows = rows.filter((r) => r.personalMailboxId === personalMailboxId);
      }
    } else {
      rows = DEMO_MAILS.filter((r) => r.kind === "business");
      if (businessMailboxId) {
        rows = rows.filter((r) => r.businessMailboxId === businessMailboxId);
      }
    }
  } else {
    rows = DEMO_MAILS;
  }
  if (listFilter === "unread") {
    rows = rows.filter((r) => r.unread);
  }
  return rows;
}

/**
 * 列表卡标题。
 * 层级：我的/业务邮箱 ＞ 收件/发件等 ＞ 具体邮箱（子账号视图时为「文件夹 · 邮箱地址」）。
 */
export function buildMailboxListCardTitle(
  folder: MailFolderId,
  scope: MailScope,
  personalMailboxId?: string,
  listFilter: MailListFilter = "all",
  businessMailboxId?: string
): string {
  const ft = folderTitle(folder);
  const unreadSuffix = listFilter === "unread" ? "（未读）" : "";

  if (personalMailboxId) {
    const mb = DEMO_PERSONAL_MAILBOXES.find((m) => m.id === personalMailboxId);
    if (mb) return `${ft}${unreadSuffix} · ${mb.email}`;
  }

  /** 聚合「我的邮箱」仅看未读时的专用标题 */
  if (folder === "inbox" && scope === "personal" && listFilter === "unread" && !businessMailboxId) {
    return "我的邮箱 · 未读邮件";
  }

  if (businessMailboxId) {
    const bm = DEMO_BUSINESS_MAILBOXES.find((m) => m.id === businessMailboxId);
    if (bm) return `${ft}${unreadSuffix} · ${bm.email}`;
  }

  let category: string;
  if (scope === "all") {
    category = "全部邮箱";
  } else if (scope === "personal") {
    category = "我的邮箱";
  } else {
    category = "业务邮箱";
  }

  return `${category} · ${ft}${unreadSuffix}`;
}
