import * as React from "react"
import { VvAiLogo, NewMessageIcon } from "./ChatComponents"
import { SidebarIcon } from "./SidebarIcons"
import Triangle from "../../imports/三角形"
import SeparateWindowIcon from "../../imports/独立窗口SeparateWindow/独立窗口SeparateWindow"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu"
import { Switch } from "../ui/switch"
import { GripVertical, ChevronDown, ChevronRight, ChevronUp, Layers, User, Home, Building2, Plus } from "lucide-react"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { cn } from "../ui/utils"
import svgPaths from "../../imports/svg-nn22u1wuv6"
import NewMessage from "../../imports/新对话NewMessage/新对话NewMessage"

import orgIcon from 'figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png';

// 使用 SVG 打勾图标
const CheckIcon = () => (
  <svg className="w-[16px] h-[16px] text-primary" viewBox="0 0 16 16" fill="none">
    <path d="M13.3334 4L6.00008 11.3333L2.66675 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const AvatarPlaceholder = () => (
  <div className="w-[20px] h-[20px] rounded-[4px] overflow-hidden flex items-center justify-center shrink-0">
    <img src={orgIcon} alt="Organization Icon" className="w-full h-full object-cover" />
  </div>
)

/** 邮箱视角行首图标：与任务组织行 20×20 圆角方块对齐 */
function EmailScopeLeadingIcon({
  mode,
  orgIconSrc,
}: {
  mode: "all" | "personal" | "tenant";
  orgIconSrc?: string;
}) {
  if (mode === "all") {
    return (
      <div className="w-[20px] h-[20px] rounded-[4px] shrink-0 bg-[var(--black-alpha-9)] flex items-center justify-center border border-[var(--black-alpha-11)]">
        <Layers className="w-[12px] h-[12px] text-text-secondary" strokeWidth={2} />
      </div>
    );
  }
  if (mode === "personal") {
    return (
      <div className="w-[20px] h-[20px] rounded-[4px] shrink-0 bg-[var(--black-alpha-9)] flex items-center justify-center border border-[var(--black-alpha-11)]">
        <User className="w-[12px] h-[12px] text-text-secondary" strokeWidth={2} />
      </div>
    );
  }
  return (
    <img src={orgIconSrc || orgIcon} alt="" className="w-[20px] h-[20px] rounded-[4px] shrink-0 object-cover" />
  );
}

/** 教育空间下拉行首的「拖拽手柄」（2×3 圆点） */
const DragHandleIcon = () => (
  <svg
    width="10"
    height="14"
    viewBox="0 0 10 14"
    fill="currentColor"
    className="text-text-tertiary shrink-0"
    aria-hidden
  >
    <circle cx="2" cy="3" r="1" />
    <circle cx="2" cy="7" r="1" />
    <circle cx="2" cy="11" r="1" />
    <circle cx="8" cy="3" r="1" />
    <circle cx="8" cy="7" r="1" />
    <circle cx="8" cy="11" r="1" />
  </svg>
);

/** 教育空间行首图标：与租户/机构 20×20 圆角方块对齐 */
function EducationSpaceLeadingIcon({
  kind,
  iconSrc,
}: {
  kind: 'tenant' | 'institution' | 'family';
  iconSrc?: string;
}) {
  if (kind === 'family') {
    return (
      <div className="w-[20px] h-[20px] rounded-[4px] shrink-0 bg-[var(--black-alpha-9)] flex items-center justify-center border border-[var(--black-alpha-11)]">
        <Home className="w-[12px] h-[12px] text-text-secondary" strokeWidth={2} />
      </div>
    );
  }
  if (kind === 'institution') {
    if (iconSrc) {
      return <img src={iconSrc} alt="" className="w-[20px] h-[20px] rounded-[4px] shrink-0 object-cover" />;
    }
    return (
      <div className="w-[20px] h-[20px] rounded-[4px] shrink-0 bg-[var(--black-alpha-9)] flex items-center justify-center border border-[var(--black-alpha-11)]">
        <Building2 className="w-[12px] h-[12px] text-text-secondary" strokeWidth={2} />
      </div>
    );
  }
  return (
    <img src={iconSrc || orgIcon} alt="" className="w-[20px] h-[20px] rounded-[4px] shrink-0 object-cover" />
  );
}

// GPT模型图标
const ModelIcon = () => (
  <div className="relative shrink-0 w-[16px] h-[16px]">
    <svg className="absolute block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
      <path d={svgPaths.p2abfb900} fill="currentColor" className="text-text" />
    </svg>
  </div>
)

// 下拉箭头（小）
const SmallChevronDownIcon = () => (
  <div className="flex items-center justify-center shrink-0 w-[12px] h-[12px]">
    <svg className="block w-full" fill="none" viewBox="0 0 8.75 4.75">
      <path d={svgPaths.p18154430} fill="currentColor" className="text-text-tertiary" />
    </svg>
  </div>
)

// 模型版本接口
export interface ModelVersion {
  id: string;
  name: string;
  description?: string;
  isRecommended?: boolean;
}

// 模型家族接口
export interface ModelFamily {
  id: string;
  name: string;
  versions: ModelVersion[];
}

/** 教育空间树节点：
 *  - `kind === 'tenant'`：租户，**不可选中**，点整行展开/收起 `children`（机构教育空间）
 *  - `kind === 'institution'`：租户下的机构教育空间，可选中
 *  - `kind === 'family'`：家庭空间，1 级叶子，可直接选中
 */
export interface EducationSpaceNode {
  id: string;
  name: string;
  kind: 'tenant' | 'institution' | 'family';
  icon?: string;
  children?: EducationSpaceNode[];
}

interface ChatNavBarProps {
  title?: string;
  onToggleHistory?: () => void;
  onClose?: () => void;
  onBack?: () => void;
  onNewMessage?: () => void;
  showClose?: boolean;
  showOrgSelect?: boolean;
  currentOrg?: string;
  onOrgClick?: () => void;
  organizations?: Array<{ id: string; name: string; icon?: string; memberCount?: number; description?: string }>;
  onOrgSelect?: (orgId: string) => void;
  onCreateOrg?: () => void;
  onJoinOrg?: () => void;
  showModelSelect?: boolean;
  currentModel?: string;
  modelFamilies?: ModelFamily[]; // 新的模型家族数据结构
  models?: Array<{ id: string; name: string; description?: string; isRecommended?: boolean }>; // 保留向后兼容
  onModelSelect?: (modelId: string) => void;
  showIndependentWindow?: boolean;
  onIndependentWindow?: () => void;
  /**
   * 0421-有组织无教育空间：主 AI 顶栏在有组织下拉时仍始终展示独立窗口按钮（默认小屏会与组织区抢宽而 `hidden md:flex`）。
   */
  independentWindowAlwaysVisible?: boolean;
  /** 邮箱应用（CUI demo）：顶栏中间为「全部 / 租户列表 / 个人」，默认全部 */
  emailMailboxSelect?: {
    value: "all" | "personal" | string;
    onChange: (value: "all" | "personal" | string) => void;
    organizations: Array<{ id: string; name: string; icon?: string }>;
  };
  /** 教育应用：顶栏中间为「教育空间切换」树形下拉（租户 → 机构教育空间；另含家庭空间） */
  educationSpaceSelect?: {
    value: string;
    onChange: (id: string) => void;
    nodes: EducationSpaceNode[];
    /** 下拉底部固定区「创建机构教育空间」按钮回调 */
    onCreateInstitution?: () => void;
    /** 下拉底部固定区「创建家庭教育空间」按钮回调 */
    onCreateFamily?: () => void;
  };
  /** 教育应用空态：用户还未创建任何教育空间时，顶栏中间为「创建教育空间」下拉按钮（可选覆盖主按钮与二级项文案，如 0421 学生受邀场景） */
  educationCreateSpace?: {
    onCreateInstitution: () => void;
    onCreateFamily: () => void;
    /** 顶栏主按钮文案，默认「创建教育空间」 */
    triggerLabel?: string;
    /** 第一项主标题，默认「创建机构教育空间」 */
    createInstitutionTitle?: string;
    createInstitutionDescription?: string;
    /** 第二项主标题，默认「创建家庭教育空间」 */
    createFamilyTitle?: string;
    createFamilyDescription?: string;
  };
  /** 主 AI 无组织：顶栏中间为「创建或加入企业/组织」下拉，内含创建 / 加入两个入口 */
  organizationOnboarding?: {
    onCreateOrganization: () => void;
    onJoinOrganization: () => void;
  };
  /**
   * 抽屉内嵌 AI 等场景：规范要求 VVAI 旁不放应用标题；中间仅展示 `title`；
   * 且不展示大模型切换、租户/组织/邮箱/教育空间等上下文控件（即使父级误传）。
   */
  titleOnlyChrome?: boolean;
}

export function ChatNavBar({ 
  title = "Title", 
  onToggleHistory, 
  onClose, 
  onBack,
  onNewMessage,
  showClose = false,
  showOrgSelect = false,
  currentOrg = "xiaoce",
  onOrgClick,
  organizations = [],
  onOrgSelect,
  onCreateOrg,
  onJoinOrg,
  showModelSelect = false,
  currentModel = "gpt-4",
  modelFamilies = [],
  models = [],
  onModelSelect,
  showIndependentWindow = false,
  onIndependentWindow,
  independentWindowAlwaysVisible = false,
  emailMailboxSelect,
  educationSpaceSelect,
  educationCreateSpace,
  organizationOnboarding,
  titleOnlyChrome = false,
}: ChatNavBarProps) {
  const currentOrgData = organizations.find(o => o.id === currentOrg);

  const effectiveShowModelSelect = titleOnlyChrome ? false : showModelSelect;
  const effectiveEmailMailbox = titleOnlyChrome ? undefined : emailMailboxSelect;
  const effectiveOrganizationOnboarding = titleOnlyChrome ? undefined : organizationOnboarding;
  const effectiveEducationSpaceSelect = titleOnlyChrome ? undefined : educationSpaceSelect;
  const effectiveEducationCreateSpace = titleOnlyChrome ? undefined : educationCreateSpace;
  const effectiveShowOrgSelect = titleOnlyChrome ? false : showOrgSelect;

  /** 在教育空间树中查找当前选中的叶子节点（机构 / 家庭） */
  const findEducationSpaceById = React.useCallback(
    (nodes: EducationSpaceNode[], id: string): EducationSpaceNode | undefined => {
      for (const n of nodes) {
        if (n.id === id && n.kind !== 'tenant') return n;
        if (n.children) {
          const hit = findEducationSpaceById(n.children, id);
          if (hit) return hit;
        }
      }
      return undefined;
    },
    [],
  );

  const currentEducationSpace = effectiveEducationSpaceSelect
    ? findEducationSpaceById(effectiveEducationSpaceSelect.nodes, effectiveEducationSpaceSelect.value)
    : undefined;
  const currentEducationTenant = React.useMemo(() => {
    if (!effectiveEducationSpaceSelect || !currentEducationSpace || currentEducationSpace.kind !== 'institution')
      return undefined;
    return effectiveEducationSpaceSelect.nodes.find(
      (n) => n.kind === 'tenant' && n.children?.some((c) => c.id === currentEducationSpace.id),
    );
  }, [effectiveEducationSpaceSelect, currentEducationSpace]);

  /** 默认展开「当前选中机构所在租户」，其它租户默认折叠 */
  const [educationExpanded, setEducationExpanded] = React.useState<Record<string, boolean>>(() => {
    if (!effectiveEducationSpaceSelect) return {};
    const initial: Record<string, boolean> = {};
    for (const n of effectiveEducationSpaceSelect.nodes) {
      if (n.kind === 'tenant') {
        initial[n.id] = !!n.children?.some((c) => c.id === effectiveEducationSpaceSelect.value);
      }
    }
    return initial;
  });
  React.useEffect(() => {
    if (!effectiveEducationSpaceSelect) return;
    setEducationExpanded((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const n of effectiveEducationSpaceSelect.nodes) {
        if (n.kind === 'tenant' && n.children?.some((c) => c.id === effectiveEducationSpaceSelect.value) && !prev[n.id]) {
          next[n.id] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [effectiveEducationSpaceSelect]);

  const educationTriggerLabel = currentEducationSpace?.name ?? '教育空间';

  /** 下拉内搜索关键词（仅 educationSpaceSelect 使用） */
  const [educationSearchQuery, setEducationSearchQuery] = React.useState('');

  /** 排序：租户在前、家庭空间在后；搜索时过滤，并自动展开命中的租户 */
  const educationFilteredNodes = React.useMemo(() => {
    if (!effectiveEducationSpaceSelect) return [] as EducationSpaceNode[];
    const q = educationSearchQuery.trim().toLowerCase();
    const tenants = effectiveEducationSpaceSelect.nodes.filter((n) => n.kind === 'tenant');
    const families = effectiveEducationSpaceSelect.nodes.filter((n) => n.kind === 'family');
    if (!q) return [...tenants, ...families];
    const filteredTenants: EducationSpaceNode[] = [];
    for (const t of tenants) {
      const selfMatch = t.name.toLowerCase().includes(q);
      const childMatches = t.children?.filter((c) => c.name.toLowerCase().includes(q)) ?? [];
      if (selfMatch) {
        filteredTenants.push(t);
      } else if (childMatches.length > 0) {
        filteredTenants.push({ ...t, children: childMatches });
      }
    }
    const filteredFamilies = families.filter((n) => n.name.toLowerCase().includes(q));
    return [...filteredTenants, ...filteredFamilies];
  }, [effectiveEducationSpaceSelect, educationSearchQuery]);

  /** 搜索有命中子节点时，自动展开对应租户（否则尊重用户手动折叠状态） */
  const isTenantForceExpanded = React.useCallback(
    (tenantId: string) => {
      if (!educationSearchQuery.trim()) return false;
      const t = educationFilteredNodes.find((n) => n.id === tenantId && n.kind === 'tenant');
      return !!t && (t.children?.length ?? 0) > 0;
    },
    [educationSearchQuery, educationFilteredNodes],
  );

  const emailTriggerLabel = effectiveEmailMailbox
    ? effectiveEmailMailbox.value === "all"
      ? "全部"
      : effectiveEmailMailbox.value === "personal"
        ? "个人"
        : effectiveEmailMailbox.organizations.find((o) => o.id === effectiveEmailMailbox.value)?.name ?? "租户"
    : "";

  /** 顶栏中间：仅当前组织名（应用名由底栏展示） */
  const centerOrgTriggerText =
    effectiveShowOrgSelect && organizations.length > 0 ? currentOrgData?.name ?? "未知组织" : "";

  // 查找当前选中的模型
  let currentModelData: ModelVersion | undefined;
  
  if (modelFamilies.length > 0) {
    for (const family of modelFamilies) {
      const version = family.versions.find(v => v.id === currentModel);
      if (version) {
        currentModelData = version;
        break;
      }
    }
  } else {
    // 向后兼容旧的 models 数组
    currentModelData = models.find(m => m.id === currentModel) as ModelVersion | undefined;
  }

  const [deepThinkStates, setDeepThinkStates] = React.useState<Record<string, boolean>>({});

  // 向后兼容：如果使用旧的 models 数组，转换为 modelFamilies 格式
  const displayFamilies = modelFamilies.length > 0 ? modelFamilies : (
    models.length > 0 ? [{
      id: 'default',
      name: '默认',
      versions: models as ModelVersion[]
    }] : []
  );

  const modelSelectorNode = effectiveShowModelSelect && displayFamilies.length > 0 ? (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-[4px] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border min-w-0 shrink">
          <div className="shrink-0 flex items-center justify-center">
            <ModelIcon />
          </div>
          <span className="text-[length:var(--font-size-xs)] font-[var(--font-weight-regular)] text-text truncate min-w-0">
            {currentModelData?.name || 'ChatGPT'}
          </span>
          <div className="shrink-0 flex items-center justify-center">
            <SmallChevronDownIcon />
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[360px] max-h-[500px] overflow-y-auto">
        {displayFamilies.map((family, familyIndex) => (
          <div key={family.id}>
            <div className="px-[var(--space-300)] py-[var(--space-200)]">
              <p className="text-[length:var(--font-size-xs)] text-text-tertiary font-[var(--font-weight-medium)]">{family.name}</p>
            </div>
            {family.versions.map((version) => (
              <DropdownMenuItem
                key={version.id}
                onSelect={(e) => {
                  if ((e.target as HTMLElement).closest('.deep-think-toggle')) {
                    e.preventDefault();
                    return;
                  }
                  onModelSelect?.(version.id);
                }}
                className={`flex items-start gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer hover:bg-[var(--black-alpha-11)] group ${version.id === currentModel ? 'bg-[var(--blue-alpha-11)]' : ''}`}
              >
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-[var(--space-100)]">
                    <div className="flex items-center gap-[var(--space-150)] flex-wrap">
                      <p className={`text-[length:var(--font-size-sm)] ${version.id === currentModel ? 'text-primary font-[var(--font-weight-bold)]' : 'text-text font-[var(--font-weight-medium)]'}`}>{version.name}</p>
                      {version.isRecommended && (
                        <span className="px-[var(--space-150)] py-[2px] rounded-[var(--radius-sm)] bg-[var(--blue-alpha-11)] text-primary text-[length:var(--font-size-xxs)] font-[var(--font-weight-medium)]">推荐</span>
                      )}
                    </div>
                    {version.id === currentModel && (
                      <div className="shrink-0 ml-[var(--space-200)]">
                        <CheckIcon />
                      </div>
                    )}
                  </div>
                  {version.description && (
                    <p className="text-[length:var(--font-size-xs)] text-text-tertiary group-hover:text-text-secondary transition-colors leading-[var(--line-height-sm)] mb-[var(--space-150)]">
                      {version.description}
                    </p>
                  )}
                  <div
                    className="deep-think-toggle flex items-center gap-[var(--space-150)] mt-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Switch
                      checked={deepThinkStates[version.id] || false}
                      onCheckedChange={(checked) => setDeepThinkStates(prev => ({...prev, [version.id]: checked}))}
                      className="scale-75 origin-left"
                    />
                    <span className="text-[length:var(--font-size-xs)] text-text-secondary font-[var(--font-weight-medium)]">深度思考</span>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
            {familyIndex < displayFamilies.length - 1 && (
              <DropdownMenuSeparator className="my-[var(--space-200)]" />
            )}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  ) : null;

  return (
    <header className="flex-none flex items-center justify-between relative z-20 px-[var(--space-400)] pt-[var(--space-200)] pb-[var(--space-100)] bg-transparent">
      <div className="flex items-center justify-start gap-[var(--space-200)] z-30 flex-1 min-w-0">
        {onToggleHistory && (
          <button 
            onClick={onToggleHistory}
            className="h-auto w-auto bg-transparent border-none cursor-pointer hover:bg-[var(--black-alpha-11)] rounded-md transition-colors focus:outline-none flex items-center justify-center p-[var(--space-100)] shrink-0"
            title="Toggle History"
          >
             <SidebarIcon />
          </button>
        )}
        <div className="flex items-center shrink-0">
          <VvAiLogo />
        </div>
        {modelSelectorNode}
      </div>

      <div className="flex items-center justify-center flex-1 z-30 min-w-0 @container">
        {effectiveEmailMailbox ? (
          <div className="flex justify-center w-full min-w-0 px-[var(--space-100)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex max-w-full min-w-0 items-center gap-[var(--space-150)] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border"
                >
                  <EmailScopeLeadingIcon
                    mode={
                      effectiveEmailMailbox.value === "all"
                        ? "all"
                        : effectiveEmailMailbox.value === "personal"
                          ? "personal"
                          : "tenant"
                    }
                    orgIconSrc={
                      effectiveEmailMailbox.organizations.find((o) => o.id === effectiveEmailMailbox.value)?.icon
                    }
                  />
                  <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-full truncate">
                    {emailTriggerLabel}
                  </span>
                  <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="max-h-[min(400px,70vh)] max-w-[min(100vw-2rem,520px)] min-w-[var(--radix-dropdown-menu-trigger-width)] w-max overflow-y-auto overflow-x-hidden"
              >
                <DropdownMenuItem
                  onClick={() => effectiveEmailMailbox.onChange("all")}
                  className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer"
                >
                  <GripVertical className="w-[14px] h-[14px] text-text-tertiary shrink-0" />
                  <EmailScopeLeadingIcon mode="all" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[length:var(--font-size-base)] text-text truncate">全部</p>
                  </div>
                  {effectiveEmailMailbox.value === "all" ? <CheckIcon /> : null}
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-[var(--space-100)]" />
                {effectiveEmailMailbox.organizations.map((org) => (
                  <DropdownMenuItem
                    key={org.id}
                    onClick={() => effectiveEmailMailbox.onChange(org.id)}
                    className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer"
                  >
                    <GripVertical className="w-[14px] h-[14px] text-text-tertiary shrink-0" />
                    <EmailScopeLeadingIcon mode="tenant" orgIconSrc={org.icon} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[length:var(--font-size-base)] text-text truncate">{org.name}</p>
                    </div>
                    {effectiveEmailMailbox.value === org.id ? <CheckIcon /> : null}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-[var(--space-100)]" />
                <DropdownMenuItem
                  onClick={() => effectiveEmailMailbox.onChange("personal")}
                  className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer"
                >
                  <GripVertical className="w-[14px] h-[14px] text-text-tertiary shrink-0" />
                  <EmailScopeLeadingIcon mode="personal" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[length:var(--font-size-base)] text-text truncate">个人</p>
                  </div>
                  {effectiveEmailMailbox.value === "personal" ? <CheckIcon /> : null}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : effectiveOrganizationOnboarding ? (
          <div className="flex justify-center w-full min-w-0 px-[var(--space-100)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex max-w-full min-w-0 items-center gap-[var(--space-150)] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border outline-none focus-visible:outline-none ring-0 focus-visible:ring-0"
                >
                  <Building2 className="w-[18px] h-[18px] text-text-secondary shrink-0" strokeWidth={2} />
                  <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-full truncate">
                    创建或加入企业/组织
                  </span>
                  <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="max-h-[min(400px,70vh)] max-w-[min(100vw-2rem,520px)] min-w-[var(--radix-dropdown-menu-trigger-width)] w-max overflow-y-auto overflow-x-hidden"
              >
                <DropdownMenuItem
                  onClick={() => effectiveOrganizationOnboarding.onCreateOrganization()}
                  className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer"
                >
                  <Building2 className="w-[16px] h-[16px] text-text-secondary shrink-0" strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[length:var(--font-size-base)] text-text font-[var(--font-weight-medium)] truncate">
                      创建企业/组织
                    </p>
                    <p className="text-[length:var(--font-size-xs)] text-text-tertiary truncate">
                      新建企业或组织并担任管理员
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-[var(--space-100)]" />
                <DropdownMenuItem
                  onClick={() => effectiveOrganizationOnboarding.onJoinOrganization()}
                  className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer"
                >
                  <User className="w-[16px] h-[16px] text-text-secondary shrink-0" strokeWidth={2} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[length:var(--font-size-base)] text-text font-[var(--font-weight-medium)] truncate">
                      加入企业/组织
                    </p>
                    <p className="text-[length:var(--font-size-xs)] text-text-tertiary truncate">
                      通过邀请码或链接加入已有组织
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : effectiveEducationSpaceSelect ? (
          <div className="flex justify-center w-full min-w-0 px-[var(--space-100)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex max-w-full min-w-0 items-center gap-[var(--space-150)] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border outline-none focus-visible:outline-none ring-0 focus-visible:ring-0"
                >
                  <EducationSpaceLeadingIcon
                    kind={currentEducationSpace?.kind ?? 'institution'}
                    iconSrc={currentEducationSpace?.icon ?? currentEducationTenant?.icon}
                  />
                  <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-full truncate">
                    {educationTriggerLabel}
                  </span>
                  <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-[min(100vw-2rem,440px)] p-0 overflow-hidden flex flex-col"
              >
                {/* 顶部搜索框 */}
                <div className="shrink-0 p-[var(--space-200)] bg-bg">
                  <Input
                    variant="search"
                    placeholder="搜索"
                    value={educationSearchQuery}
                    onChange={(e) => setEducationSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      // 防止方向键等被 Radix 下拉菜单拦截用于条目导航
                      e.stopPropagation();
                    }}
                    allowClear
                  />
                </div>

                {/* 可滚动列表 */}
                <div className="min-h-0 max-h-[min(360px,50vh)] overflow-y-auto py-[var(--space-100)]">
                  {educationFilteredNodes.length === 0 ? (
                    <div className="flex items-center justify-center py-[var(--space-500)]">
                      <span className="text-[length:var(--font-size-sm)] text-text-tertiary">暂无匹配结果</span>
                    </div>
                  ) : (
                    educationFilteredNodes.map((node) => {
                      if (node.kind === 'tenant') {
                        const expanded =
                          isTenantForceExpanded(node.id) || !!educationExpanded[node.id];
                        return (
                          <React.Fragment key={node.id}>
                            <DropdownMenuItem
                              onSelect={(e) => {
                                e.preventDefault();
                                setEducationExpanded((prev) => ({
                                  ...prev,
                                  [node.id]: !expanded,
                                }));
                              }}
                              className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-200)] cursor-pointer"
                            >
                              <DragHandleIcon />
                              <EducationSpaceLeadingIcon kind="tenant" iconSrc={node.icon} />
                              <div className="flex-1 min-w-0">
                                <p className="text-[length:var(--font-size-base)] text-text truncate">
                                  {node.name}
                                </p>
                              </div>
                              {expanded ? (
                                <ChevronUp className="w-[16px] h-[16px] text-primary shrink-0" strokeWidth={2.4} />
                              ) : (
                                <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" strokeWidth={2.4} />
                              )}
                            </DropdownMenuItem>
                            {expanded &&
                              node.children?.map((child) => {
                                const selected = child.id === effectiveEducationSpaceSelect.value;
                                return (
                                  <DropdownMenuItem
                                    key={child.id}
                                    onClick={() => effectiveEducationSpaceSelect.onChange(child.id)}
                                    className="flex items-center gap-[var(--space-200)] pl-[calc(var(--space-300)+var(--space-400))] pr-[var(--space-300)] py-[var(--space-200)] cursor-pointer"
                                  >
                                    <DragHandleIcon />
                                    {selected ? (
                                      <CheckIcon />
                                    ) : (
                                      <EducationSpaceLeadingIcon kind="institution" iconSrc={child.icon} />
                                    )}
                                    <div className="flex-1 min-w-0">
                                      <p
                                        className={`text-[length:var(--font-size-base)] truncate ${selected ? 'text-primary font-[var(--font-weight-medium)]' : 'text-text'}`}
                                      >
                                        {child.name}
                                      </p>
                                    </div>
                                  </DropdownMenuItem>
                                );
                              })}
                          </React.Fragment>
                        );
                      }
                      const selected = node.id === effectiveEducationSpaceSelect.value;
                      return (
                        <DropdownMenuItem
                          key={node.id}
                          onClick={() => effectiveEducationSpaceSelect.onChange(node.id)}
                          className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-200)] cursor-pointer"
                        >
                          <DragHandleIcon />
                          {selected ? (
                            <CheckIcon />
                          ) : (
                            <EducationSpaceLeadingIcon kind={node.kind} iconSrc={node.icon} />
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-[length:var(--font-size-base)] truncate ${selected ? 'text-primary font-[var(--font-weight-medium)]' : 'text-text'}`}
                            >
                              {node.name}
                            </p>
                          </div>
                        </DropdownMenuItem>
                      );
                    })
                  )}
                </div>

                {/* 底部固定：两个创建按钮 */}
                {(effectiveEducationSpaceSelect.onCreateInstitution || effectiveEducationSpaceSelect.onCreateFamily) && (
                  <div className="shrink-0 flex items-center justify-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] border-t border-border bg-bg">
                    {effectiveEducationSpaceSelect.onCreateInstitution && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => effectiveEducationSpaceSelect.onCreateInstitution?.()}
                      >
                        创建机构教育空间
                      </Button>
                    )}
                    {effectiveEducationSpaceSelect.onCreateFamily && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => effectiveEducationSpaceSelect.onCreateFamily?.()}
                      >
                        创建家庭教育空间
                      </Button>
                    )}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : effectiveEducationCreateSpace ? (
          <div className="flex justify-center w-full min-w-0 px-[var(--space-100)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex max-w-full min-w-0 items-center gap-[var(--space-150)] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border outline-none focus-visible:outline-none ring-0 focus-visible:ring-0"
                >
                  <div className="w-[20px] h-[20px] rounded-[4px] shrink-0 bg-[var(--blue-alpha-11)] flex items-center justify-center">
                    <Plus className="w-[12px] h-[12px] text-primary" strokeWidth={2.4} />
                  </div>
                  <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-full truncate">
                    {effectiveEducationCreateSpace.triggerLabel ?? "创建教育空间"}
                  </span>
                  <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="max-h-[min(400px,70vh)] max-w-[min(100vw-2rem,520px)] min-w-[var(--radix-dropdown-menu-trigger-width)] w-max overflow-y-auto overflow-x-hidden"
              >
                <DropdownMenuItem
                  onClick={() => effectiveEducationCreateSpace.onCreateInstitution()}
                  className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer"
                >
                  <EducationSpaceLeadingIcon kind="institution" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[length:var(--font-size-base)] text-text font-[var(--font-weight-medium)] truncate">
                      {effectiveEducationCreateSpace.createInstitutionTitle ?? "创建机构教育空间"}
                    </p>
                    <p className="text-[length:var(--font-size-xs)] text-text-tertiary truncate">
                      {effectiveEducationCreateSpace.createInstitutionDescription ??
                        "适合教育机构、学校、培训组织"}
                    </p>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-[var(--space-100)]" />
                <DropdownMenuItem
                  onClick={() => effectiveEducationCreateSpace.onCreateFamily()}
                  className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer"
                >
                  <EducationSpaceLeadingIcon kind="family" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[length:var(--font-size-base)] text-text font-[var(--font-weight-medium)] truncate">
                      {effectiveEducationCreateSpace.createFamilyTitle ?? "创建家庭教育空间"}
                    </p>
                    <p className="text-[length:var(--font-size-xs)] text-text-tertiary truncate">
                      {effectiveEducationCreateSpace.createFamilyDescription ??
                        "适合学生、家长的个人学习场景"}
                    </p>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : effectiveShowOrgSelect && organizations.length > 0 ? (
          <div className="flex justify-center w-full min-w-0 px-[var(--space-100)]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="inline-flex max-w-full min-w-0 items-center gap-[var(--space-150)] px-[var(--space-200)] py-[var(--space-100)] hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors border border-transparent hover:border-border"
                >
                  <AvatarPlaceholder />
                  <span className="text-[length:var(--font-size-base)] font-[var(--font-weight-medium)] text-text max-w-full truncate">
                    {centerOrgTriggerText}
                  </span>
                  <ChevronDown className="w-[16px] h-[16px] text-text-tertiary shrink-0" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="center"
                className="w-[min(100vw-2rem,440px)] p-0 overflow-hidden flex flex-col"
              >
                <div className="min-h-0 max-h-[min(360px,50vh)] overflow-y-auto py-[var(--space-100)]">
                  {organizations.map((org) => (
                    <DropdownMenuItem
                      key={org.id}
                      onClick={() => onOrgSelect?.(org.id)}
                      className="flex items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] cursor-pointer"
                    >
                      <GripVertical className="w-[14px] h-[14px] text-text-tertiary shrink-0" />
                      <img src={org.icon || orgIcon} alt="" className="w-[20px] h-[20px] rounded-[4px] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[length:var(--font-size-base)] text-text truncate">{org.name}</p>
                      </div>
                      {org.id === currentOrg && <CheckIcon />}
                    </DropdownMenuItem>
                  ))}
                </div>
                {onCreateOrg && onJoinOrg && (
                  <div className="shrink-0 flex w-full items-stretch justify-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-250)] border-t border-border bg-bg">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="min-w-0 flex-1"
                      onClick={() => onCreateOrg()}
                    >
                      创建企业/组织
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="min-w-0 flex-1"
                      onClick={() => onJoinOrg()}
                    >
                      加入企业/组织
                    </Button>
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <span className="text-[length:var(--font-size-md)] font-[var(--font-weight-medium)] text-text truncate">{title}</span>
        )}
      </div>

      <div className="flex items-center justify-end flex-1 z-30 gap-[var(--space-100)] min-w-0">
        {onNewMessage && (
          <button
            onClick={onNewMessage}
            className="h-[var(--space-800)] w-[var(--space-800)] bg-transparent border-none cursor-pointer hover:bg-[var(--black-alpha-11)] rounded-[var(--radius-md)] transition-colors focus:outline-none flex items-center justify-center text-text-secondary shrink-0"
            title="新对话"
          >
            <div className="w-[16px] h-[16px] text-current">
              <NewMessage />
            </div>
          </button>
        )}

        {showIndependentWindow && (
          <button
            onClick={onIndependentWindow}
            className={cn(
              "h-[var(--space-800)] w-[var(--space-800)] bg-transparent border-none cursor-pointer hover:bg-[var(--black-alpha-11)] rounded-md transition-colors focus:outline-none items-center justify-center text-text-secondary shrink-0",
              independentWindowAlwaysVisible ? "flex" : effectiveShowOrgSelect ? "hidden md:flex" : "flex",
            )}
            title="独立窗口"
          >
            <div className="w-[16px] h-[16px]">
              <SeparateWindowIcon />
            </div>
          </button>
        )}
        {showClose && onClose && (
          <button
            onClick={onClose}
            className="h-auto w-auto bg-transparent border-none cursor-pointer hover:bg-[var(--black-alpha-11)] rounded-md transition-colors focus:outline-none flex items-center justify-center text-text-secondary p-[var(--space-100)] shrink-0"
            title="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15.4167 5.7625L14.2375 4.58334L10 8.82084L5.7625 4.58334L4.58334 5.7625L8.82084 10L4.58334 14.2375L5.7625 15.4167L10 11.1792L14.2375 15.4167L15.4167 14.2375L11.1792 10L15.4167 5.7625Z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  )
}