import courseIcon from "../../assets/ac6e3391c1eb88804cbf0804668d449463a1e1a3.png";
import goodsIcon from "../../assets/d6c155d2820ba2910285fbcb066152b9efb7141c.png";
import membersIcon from "../../assets/ecb04190c46a6ecd790d2bc345d963ba9a4a8f0b.png";
import calendarIcon from "../../assets/e653b0a7cada3ea08e52cb29bc4bd546be59d3d5.png";
import companyIcon from "../../assets/bc4adf9e89b5ade28461d7ae6da09053ea8bf0e1.png";

/** 与 EDUCATION_APPS 同结构；`directClick` + 空 `menu` 表示无二级菜单，主按钮一次打开卡片 */
export const TASK_APPS = [
  {
    id: "task_overview",
    name: "任务总览",
    imageSrc: courseIcon,
    menu: [
      { id: "all", name: "全部任务", iconKey: "task_all" },
      { id: "overdue", name: "仅看逾期", iconKey: "task_overdue" },
      { id: "executed", name: "我执行过的", iconKey: "task_executed" },
      { id: "recent_done", name: "近期完成的", iconKey: "task_recent_done" },
    ],
  },
  {
    id: "task_mine",
    name: "我的",
    imageSrc: goodsIcon,
    menu: [
      { id: "mine_exec", name: "我执行的", iconKey: "task_my_exec" },
      { id: "mine_owner", name: "我负责的", iconKey: "task_my_owner" },
      { id: "mine_part", name: "我参与的", iconKey: "task_my_part" },
      { id: "mine_follow", name: "我关注的", iconKey: "task_my_follow" },
      { id: "mine_subs", name: "下属的", iconKey: "task_mine_subs" },
    ],
  },
  {
    id: "task_new",
    name: "新建与草稿",
    imageSrc: membersIcon,
    menu: [
      { id: "new_task", name: "新建任务", iconKey: "task_new" },
      { id: "drafts", name: "草稿箱", iconKey: "task_drafts" },
    ],
  },
  {
    id: "task_filter",
    name: "筛选任务",
    imageSrc: calendarIcon,
    menu: [],
    directClick: true,
  },
  {
    id: "task_settings",
    name: "设置",
    imageSrc: companyIcon,
    menu: [],
    directClick: true,
  },
];

/** 演示用当前用户，与列表/详情人名一致 */
export const DEMO_CURRENT_USER = "殷朝";

export type TaskRow = {
  id: string;
  name: string;
  assignee: string;
  owner: string;
  status: string;
  progress: number;
  due: string;
  risk: string;
};

/** 执行内容分工表一行 */
export type ExecutionDivisionRow = {
  content: string;
  assignee: string;
  /** 状态文案，如「执行中」「未开始」 */
  statusLabel: string;
  phase: string;
  difficulty: string;
  updatedAt: string;
};

export type TaskDetailData = {
  id: string;
  name: string;
  assignee: string;
  owner: string;
  status: string;
  progress: number;
  due: string;
  risk: string;
  priority: "低" | "中" | "高";
  type: string;
  phase: string;
  estimatedHours: number;
  description: string;
  createdAt: string;
  updatedAt: string;
  /** 演示：协作视角标签 */
  perspective?: string;
  subtasks: { title: string; done: boolean }[];
  activity: { time: string; text: string }[];
  /** 基本信息区：任务编码（展示） */
  taskCode?: string;
  /** 创建人 */
  creator?: string;
  /** 任务周期起 */
  cycleStart?: string;
  /** 任务周期止 */
  cycleEnd?: string;
  /** 多人执行人（缺省由 assignee 单字段解析） */
  assignees?: string[];
  /** 多人负责人（缺省由 owner 单字段解析） */
  owners?: string[];
  /** 参与人列表（无单字段回退） */
  participantNames?: string[];
  /** 执行内容分工表多行（缺省为单行演示） */
  executionDivisionRows?: ExecutionDivisionRow[];
};

/** 将编辑表单快照合并进任务详情（0417 新卡片编辑：保存后详情卡与列表入口一致但反映编辑结果） */
export function applyTaskEditSnapshotToDetail(
  detail: TaskDetailData,
  snap: {
    name: string;
    assignee: string;
    owner: string;
    hours: string;
    dateStart: string;
    dateEnd: string;
    desc: string;
    priority: string;
    type: string;
    phase: string;
  }
): TaskDetailData {
  const p = snap.priority;
  const priority: TaskDetailData["priority"] =
    p === "低" || p === "中" || p === "高" ? p : detail.priority;
  const n = Math.floor(Number(snap.hours));
  return {
    ...detail,
    name: snap.name.trim() || detail.name,
    assignee: snap.assignee,
    owner: snap.owner,
    description: snap.desc,
    priority,
    type: snap.type,
    phase: snap.phase,
    estimatedHours: !Number.isFinite(n) || n <= 0 ? detail.estimatedHours : n,
    cycleStart: snap.dateStart || detail.cycleStart,
    cycleEnd: snap.dateEnd || detail.cycleEnd,
    due: snap.dateEnd || detail.due,
  };
}

export function getExecutionDivisionRows(d: TaskDetailData): ExecutionDivisionRow[] {
  if (d.executionDivisionRows && d.executionDivisionRows.length > 0) {
    return d.executionDivisionRows;
  }
  const assignee = d.assignee && d.assignee !== "—" ? d.assignee : "--";
  const updated =
    d.updatedAt && d.updatedAt.length >= 10 ? d.updatedAt.slice(0, 10) : d.updatedAt || "—";
  return [
    {
      content: "字段口径核对",
      assignee,
      statusLabel: "执行中",
      phase: d.phase || "设计阶段",
      difficulty: "--",
      updatedAt: updated,
    },
  ];
}

/** 「只看我的」：与任务执行人同名的分工行 */
export function filterExecutionDivisionRowsMine(d: TaskDetailData): ExecutionDivisionRow[] {
  const rows = getExecutionDivisionRows(d);
  const mine = d.assignee?.trim();
  if (!mine || mine === "—") return [];
  return rows.filter((r) => r.assignee === mine);
}

/** 「只看下属」：执行人非本人的分工行（演示） */
export function filterExecutionDivisionRowsSubordinates(d: TaskDetailData): ExecutionDivisionRow[] {
  const rows = getExecutionDivisionRows(d);
  const mine = d.assignee?.trim();
  if (!mine || mine === "—") return rows;
  return rows.filter((r) => r.assignee !== mine);
}

/** 将详情中的「单字段 + 可选数组」规范为姓名列表 */
export function resolvePersonNames(explicit: string[] | undefined, single: string): string[] {
  if (explicit && explicit.length > 0) return explicit;
  const t = single?.trim();
  if (!t || t === "—" || t === "--") return [];
  return [t];
}

/** 参与人仅有数组，无则空 */
export function resolveParticipantNames(explicit: string[] | undefined): string[] {
  if (!explicit?.length) return [];
  return explicit;
}

/** 全量任务行（「全部任务」基准集） */
const BASE_ROWS: TaskRow[] = [
  {
    id: "t-101",
    name: "Q2 产品路线图评审",
    assignee: DEMO_CURRENT_USER,
    owner: "段鹏",
    status: "进行中",
    progress: 62,
    due: "2026-04-18",
    risk: "无",
  },
  {
    id: "t-102",
    name: "客户 POC · 接口联调",
    assignee: "张三",
    owner: DEMO_CURRENT_USER,
    status: "进行中",
    progress: 35,
    due: "2026-04-09",
    risk: "有风险",
  },
  {
    id: "t-103",
    name: "官网落地页文案定稿",
    assignee: "陈晨",
    owner: "李四",
    status: "未开始",
    progress: 0,
    due: "2026-04-25",
    risk: "无",
  },
  {
    id: "t-104",
    name: "数据看板字段对齐",
    assignee: DEMO_CURRENT_USER,
    owner: "李四",
    status: "进行中",
    progress: 48,
    due: "2026-04-12",
    risk: "无",
  },
  {
    id: "t-105",
    name: "合同归档与扫描件上传",
    assignee: "刘洋",
    owner: "王敏",
    status: "未开始",
    progress: 0,
    due: "2026-04-06",
    risk: "无",
  },
  {
    id: "t-106",
    name: "周报模板迭代",
    assignee: "赵玥",
    owner: DEMO_CURRENT_USER,
    status: "已完成",
    progress: 100,
    due: "2026-04-08",
    risk: "无",
  },
  {
    id: "t-107",
    name: "灰度发布 checklist",
    assignee: DEMO_CURRENT_USER,
    owner: "段鹏",
    status: "已完成",
    progress: 100,
    due: "2026-04-10",
    risk: "无",
  },
  {
    id: "t-108",
    name: "销售漏斗数据清洗",
    assignee: "周凯",
    owner: "段鹏",
    status: "进行中",
    progress: 20,
    due: "2026-03-28",
    risk: "有风险",
  },
];

function overdueRows(): TaskRow[] {
  return BASE_ROWS.filter((r) => r.due < "2026-04-11");
}

function myExecutedHistory(): TaskRow[] {
  return BASE_ROWS.filter((r) => r.assignee === DEMO_CURRENT_USER);
}

function recentDone(): TaskRow[] {
  return BASE_ROWS.filter((r) => r.status === "已完成");
}

/** 我执行的：当前由我执行且未完成优先 */
function myExecuting(): TaskRow[] {
  return BASE_ROWS.filter(
    (r) => r.assignee === DEMO_CURRENT_USER && r.status !== "已完成"
  );
}

function myOwner(): TaskRow[] {
  return BASE_ROWS.filter((r) => r.owner === DEMO_CURRENT_USER);
}

/** 演示：我参与的 = 协作任务（跨角色可见） */
function myParticipate(): TaskRow[] {
  return BASE_ROWS.filter((r) => ["t-104", "t-102"].includes(r.id));
}

function myFollow(): TaskRow[] {
  return BASE_ROWS.filter(
    (r) => r.owner === "段鹏" || r.name.includes("评审") || r.name.includes("灰度")
  );
}

function subordinateRows(): TaskRow[] {
  return BASE_ROWS.filter((r) => ["张三", "周凯", "刘洋"].includes(r.assignee));
}

/** 按底部入口语义返回高保真演示行（各入口列表互不雷同，便于 demo） */
export function getTaskRowsForFilter(filterHint: string | undefined): TaskRow[] {
  const key = (filterHint ?? "全部任务").trim();
  const map: Record<string, TaskRow[]> = {
    全部任务: BASE_ROWS,
    仅看逾期: overdueRows(),
    我执行过的: myExecutedHistory(),
    近期完成的: recentDone(),
    我执行的: myExecuting(),
    我负责的: myOwner(),
    我参与的: myParticipate(),
    我关注的: myFollow(),
    下属的: subordinateRows(),
  };
  return map[key]?.length ? map[key] : BASE_ROWS;
}

/** t-101 演示：多人执行（与详情卡「张雪松 等22人」一致） */
const DEMO_T101_ASSIGNEES = [
  "张雪松",
  "李明",
  "王芳",
  "刘伟",
  "陈静",
  "杨洋",
  "赵强",
  "周杰",
  "吴婷",
  "孙浩",
  "朱琳",
  "马超",
  "胡斌",
  "郭丽",
  "何勇",
  "高飞",
  "林娜",
  "罗军",
  "梁敏",
  "郑伟",
  "谢芳",
  "韩磊",
];

/** 详情全字段（与列表行 id 对齐） */
export const TASK_DETAIL_BY_ID: Record<string, TaskDetailData> = {
  "t-101": {
    id: "t-101",
    name: "Q2 产品路线图评审",
    assignee: "张雪松",
    assignees: DEMO_T101_ASSIGNEES,
    owner: "段鹏",
    owners: ["段鹏", "王敏"],
    status: "进行中",
    progress: 62,
    due: "2026-04-18",
    risk: "无",
    priority: "高",
    type: "需求",
    phase: "规划",
    estimatedHours: 16,
    description:
      "对齐 Q2 目标与资源，输出评审纪要并在会后 24h 内同步到项目空间。需产品、研发、销售三方到场。",
    createdAt: "2026-04-01 10:20",
    updatedAt: "2026-04-10 16:42",
    perspective: "协作 · 负责人段鹏",
    participantNames: ["贾曙光", "钱进", "孙丽"],
    subtasks: [
      { title: "收集各组输入", done: true },
      { title: "评审材料排版", done: true },
      { title: "会后纪要发送", done: false },
    ],
    activity: [
      { time: "04-10 16:40", text: "段鹏 上传了附件「路线图-v3.pdf」" },
      { time: "04-09 11:05", text: `${DEMO_CURRENT_USER} 更新了进度为 62%` },
    ],
  },
  "t-102": {
    id: "t-102",
    name: "客户 POC · 接口联调",
    assignee: "张三",
    owner: DEMO_CURRENT_USER,
    status: "进行中",
    progress: 35,
    due: "2026-04-09",
    risk: "有风险",
    priority: "高",
    type: "需求",
    phase: "执行",
    estimatedHours: 24,
    description:
      "与客户环境联调 OAuth 与订单查询接口；需预留沙箱账号与回调白名单。当前阻塞：客户侧证书未下发。",
    createdAt: "2026-03-28 09:00",
    updatedAt: "2026-04-10 09:15",
    perspective: "我负责 · 执行人张三",
    taskCode: "TK-2026-POC-001",
    creator: "段鹏",
    cycleStart: "2026-03-28",
    cycleEnd: "2026-04-15",
    executionDivisionRows: [
      {
        content: "字段口径核对",
        assignee: "张三",
        statusLabel: "执行中",
        phase: "设计阶段",
        difficulty: "--",
        updatedAt: "2026-04-10",
      },
      {
        content: "OAuth 回调与白名单联调",
        assignee: "张三",
        statusLabel: "执行中",
        phase: "研发阶段",
        difficulty: "中",
        updatedAt: "2026-04-09",
      },
      {
        content: "沙箱签名与证书验证",
        assignee: "王工",
        statusLabel: "未开始",
        phase: "研发阶段",
        difficulty: "高",
        updatedAt: "2026-04-08",
      },
      {
        content: "客户环境冒烟用例",
        assignee: "李四",
        statusLabel: "未开始",
        phase: "测试阶段",
        difficulty: "--",
        updatedAt: "2026-04-07",
      },
    ],
    subtasks: [
      { title: "沙箱账号申请", done: true },
      { title: "签名联调", done: false },
      { title: "客户验收邮件", done: false },
    ],
    activity: [
      { time: "04-10 09:12", text: "风险：依赖客户证书，已标红同步客户成功经理" },
      { time: "04-08 14:00", text: "张三 完成首轮联调日志抓取" },
    ],
  },
  "t-103": {
    id: "t-103",
    name: "官网落地页文案定稿",
    assignee: "陈晨",
    owner: "李四",
    status: "未开始",
    progress: 0,
    due: "2026-04-25",
    risk: "无",
    priority: "中",
    type: "运营",
    phase: "规划",
    estimatedHours: 8,
    description: "与品牌对齐主标题与 CTA，输出中/英两版，需法务过审。",
    createdAt: "2026-04-05 13:00",
    updatedAt: "2026-04-05 13:00",
    subtasks: [
      { title: "初稿", done: false },
      { title: "法务审核", done: false },
    ],
    activity: [{ time: "04-05 13:00", text: "李四 创建任务并指派陈晨" }],
  },
  "t-104": {
    id: "t-104",
    name: "数据看板字段对齐",
    assignee: DEMO_CURRENT_USER,
    owner: "李四",
    status: "进行中",
    progress: 48,
    due: "2026-04-12",
    risk: "无",
    priority: "中",
    type: "需求",
    phase: "执行",
    estimatedHours: 12,
    description: "与数据组统一「成交金额」「退款额」口径，更新看板数据集与字段说明。",
    createdAt: "2026-04-02 10:00",
    updatedAt: "2026-04-10 11:30",
    perspective: "我执行",
    subtasks: [
      { title: "口径文档", done: true },
      { title: "数据集变更", done: false },
    ],
    activity: [
      { time: "04-10 11:28", text: `${DEMO_CURRENT_USER} 评论：等待数仓排期` },
    ],
  },
  "t-105": {
    id: "t-105",
    name: "合同归档与扫描件上传",
    assignee: "刘洋",
    owner: "王敏",
    status: "未开始",
    progress: 0,
    due: "2026-04-06",
    risk: "无",
    priority: "低",
    type: "运营",
    phase: "执行",
    estimatedHours: 4,
    description: "将纸质合同扫描上传至档案库，并关联 CRM 合同编号。",
    createdAt: "2026-04-01 08:00",
    updatedAt: "2026-04-01 08:00",
    subtasks: [{ title: "扫描上传", done: false }],
    activity: [],
  },
  "t-106": {
    id: "t-106",
    name: "周报模板迭代",
    assignee: "赵玥",
    owner: DEMO_CURRENT_USER,
    status: "已完成",
    progress: 100,
    due: "2026-04-08",
    risk: "无",
    priority: "低",
    type: "运营",
    phase: "验收",
    estimatedHours: 3,
    description: "合并管理层反馈，发布新版周报模板至全员。",
    createdAt: "2026-03-30 10:00",
    updatedAt: "2026-04-08 17:00",
    perspective: "我负责",
    subtasks: [
      { title: "模板发布", done: true },
      { title: "全员公告", done: true },
    ],
    activity: [{ time: "04-08 17:00", text: "状态变更为 已完成" }],
  },
  "t-107": {
    id: "t-107",
    name: "灰度发布 checklist",
    assignee: DEMO_CURRENT_USER,
    owner: "段鹏",
    status: "已完成",
    progress: 100,
    due: "2026-04-10",
    risk: "无",
    priority: "高",
    type: "需求",
    phase: "验收",
    estimatedHours: 6,
    description: "按发布清单执行灰度步骤，回滚预案已备案。",
    createdAt: "2026-04-04 09:00",
    updatedAt: "2026-04-10 20:10",
    subtasks: [
      { title: "预发验证", done: true },
      { title: "生产灰度", done: true },
    ],
    activity: [{ time: "04-10 20:08", text: "发布完成，监控无异常" }],
  },
  "t-108": {
    id: "t-108",
    name: "销售漏斗数据清洗",
    assignee: "周凯",
    owner: "段鹏",
    status: "进行中",
    progress: 20,
    due: "2026-03-28",
    risk: "有风险",
    priority: "中",
    type: "运营",
    phase: "执行",
    estimatedHours: 10,
    description: "清洗重复线索与空值字段，输出清洗规则文档供数仓固化。",
    createdAt: "2026-03-20 15:00",
    updatedAt: "2026-04-07 10:00",
    subtasks: [{ title: "规则评审", done: false }],
    activity: [{ time: "04-07 10:00", text: "周凯：源表延迟，进度受影响" }],
  },
};

export function getTaskDetailById(id: string): TaskDetailData | undefined {
  return TASK_DETAIL_BY_ID[id];
}

/** 关联子任务弹窗：可选任务列表（排除当前任务） */
export function getTasksForLinkPicker(excludeTaskId: string): TaskRow[] {
  return BASE_ROWS.filter((r) => r.id !== excludeTaskId);
}

/** 列表行打开详情时，保证总有可渲染结构 */
export function getTaskDetailOrFallback(id: string): TaskDetailData {
  const d = getTaskDetailById(id);
  if (d) return d;
  return {
    id,
    name: "（演示）未索引的任务",
    assignee: "—",
    owner: "—",
    status: "—",
    progress: 0,
    due: "—",
    risk: "无",
    priority: "中",
    type: "其他",
    phase: "—",
    estimatedHours: 0,
    description: "当前演示数据未包含该任务的完整档案，请从标准列表入口重新打开。",
    createdAt: "—",
    updatedAt: "—",
    subtasks: [],
    activity: [],
    taskCode: id,
    creator: "—",
    cycleStart: "—",
    cycleEnd: "—",
  };
}

/** @deprecated 使用 getTaskRowsForFilter */
export const MOCK_TASK_ROWS: TaskRow[] = BASE_ROWS;
