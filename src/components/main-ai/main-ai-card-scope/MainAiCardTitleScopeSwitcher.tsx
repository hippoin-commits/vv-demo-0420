import * as React from "react";
import { Building2, ChevronDown, ChevronUp, Home } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { Input } from "../../ui/input";
import { cn } from "../../ui/utils";
import { InteractionRulesOrgSelectBar } from "../InteractionRulesOrgSelectBar";
import type { EducationSpaceNode } from "../../chat/ChatNavBar";
import orgIcon from "figma:asset/58a97c06b4ae6edfc613d20add2fb4ead0363c64.png";

const CheckGlyph = () => (
  <svg className="h-[16px] w-[16px] shrink-0 text-primary" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M13.3334 4L6.00008 11.3333L2.66675 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function EducationSpaceGlyph({
  kind,
  iconSrc,
}: {
  kind: "tenant" | "institution" | "family";
  iconSrc?: string;
}) {
  if (kind === "family") {
    return (
      <div className="flex size-[length:var(--space-500)] shrink-0 items-center justify-center rounded-[var(--radius-100)] border border-[var(--black-alpha-11)] bg-[var(--black-alpha-9)]">
        <Home className="size-[length:var(--space-300)] text-text-secondary" strokeWidth={2} />
      </div>
    );
  }
  if (kind === "institution") {
    if (iconSrc) {
      return <img src={iconSrc} alt="" className="size-[length:var(--space-500)] shrink-0 rounded-[var(--radius-100)] object-cover" />;
    }
    return (
      <div className="flex size-[length:var(--space-500)] shrink-0 items-center justify-center rounded-[var(--radius-100)] border border-[var(--black-alpha-11)] bg-[var(--black-alpha-9)]">
        <Building2 className="size-[length:var(--space-300)] text-text-secondary" strokeWidth={2} />
      </div>
    );
  }
  return <img src={iconSrc || orgIcon} alt="" className="size-[length:var(--space-500)] shrink-0 rounded-[var(--radius-100)] object-cover" />;
}

function findEducationLeafById(nodes: EducationSpaceNode[], id: string): EducationSpaceNode | undefined {
  for (const n of nodes) {
    if (n.id === id && n.kind !== "tenant") return n;
    if (n.children) {
      const hit = findEducationLeafById(n.children, id);
      if (hit) return hit;
    }
  }
  return undefined;
}

function findTenantForInstitution(nodes: EducationSpaceNode[], institutionId: string): EducationSpaceNode | undefined {
  for (const n of nodes) {
    if (n.kind === "tenant" && n.children?.some((c) => c.id === institutionId)) return n;
  }
  return undefined;
}

/**
 * 主 AI 对话卡片标题下：组织切换（与顶栏列表一致，无排序 / 无新建加入区）。
 * 实现复用 `InteractionRulesOrgSelectBar`，并固定隐藏菜单内排序手柄。
 */
export function MainAiCardOrgScopeSelectBar(
  props: Omit<React.ComponentProps<typeof InteractionRulesOrgSelectBar>, "hideMenuSortIcon">,
) {
  return <InteractionRulesOrgSelectBar {...props} hideMenuSortIcon />;
}

/**
 * 主 AI 对话卡片标题下：教育空间切换（与顶栏树形列表一致：搜索 + 租户展开 + 可选叶子；无排序手柄、无底部创建区）。
 */
export function MainAiCardEducationSpaceSelectBar({
  nodes,
  value,
  onChange,
  embedded = true,
}: {
  nodes: EducationSpaceNode[];
  value: string;
  onChange: (id: string) => void;
  embedded?: boolean;
}) {
  const currentLeaf = React.useMemo(() => findEducationLeafById(nodes, value), [nodes, value]);
  const currentTenant = React.useMemo(() => {
    if (!currentLeaf || currentLeaf.kind !== "institution") return undefined;
    return findTenantForInstitution(nodes, currentLeaf.id);
  }, [nodes, currentLeaf]);

  const [expanded, setExpanded] = React.useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const n of nodes) {
      if (n.kind === "tenant") {
        initial[n.id] = !!n.children?.some((c) => c.id === value);
      }
    }
    return initial;
  });

  React.useEffect(() => {
    setExpanded((prev) => {
      const next = { ...prev };
      let changed = false;
      for (const n of nodes) {
        if (n.kind === "tenant" && n.children?.some((c) => c.id === value) && !prev[n.id]) {
          next[n.id] = true;
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [nodes, value]);

  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredNodes = React.useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const tenants = nodes.filter((n) => n.kind === "tenant");
    const families = nodes.filter((n) => n.kind === "family");
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
  }, [nodes, searchQuery]);

  const tenantForceExpanded = React.useCallback(
    (tenantId: string) => {
      if (!searchQuery.trim()) return false;
      const t = filteredNodes.find((n) => n.id === tenantId && n.kind === "tenant");
      return !!t && (t.children?.length ?? 0) > 0;
    },
    [searchQuery, filteredNodes],
  );

  const triggerLabel = currentLeaf?.name ?? "教育空间";

  return (
    <div className={cn("flex w-full min-w-0 justify-start", embedded ? "mb-0" : "mb-[var(--space-200)]")}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex max-w-full min-w-0 items-center gap-[var(--space-150)] rounded-[var(--radius-md)] border-0 bg-transparent px-0 py-[var(--space-100)] text-left shadow-none outline-none",
              "cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            )}
          >
            <EducationSpaceGlyph
              kind={currentLeaf?.kind ?? "institution"}
              iconSrc={currentLeaf?.icon ?? currentTenant?.icon}
            />
            <span className="min-w-0 truncate text-[length:var(--font-size-xs)] font-[var(--font-weight-normal)] text-text-tertiary">
              {triggerLabel}
            </span>
            <ChevronDown className="h-[16px] w-[16px] shrink-0 text-text-tertiary" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="flex w-[min(100vw-2rem,440px)] flex-col overflow-hidden p-0"
        >
          <div className="shrink-0 bg-bg p-[var(--space-200)]">
            <Input
              variant="search"
              placeholder="搜索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
              }}
              allowClear
            />
          </div>
          <div className="max-h-[min(360px,50vh)] min-h-0 overflow-y-auto py-[var(--space-100)]">
            {filteredNodes.length === 0 ? (
              <div className="flex items-center justify-center py-[var(--space-500)]">
                <span className="text-[length:var(--font-size-sm)] text-text-tertiary">暂无匹配结果</span>
              </div>
            ) : (
              filteredNodes.map((node) => {
                if (node.kind === "tenant") {
                  const isExpanded = tenantForceExpanded(node.id) || !!expanded[node.id];
                  return (
                    <React.Fragment key={node.id}>
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault();
                          setExpanded((prev) => ({
                            ...prev,
                            [node.id]: !isExpanded,
                          }));
                        }}
                        className="flex cursor-pointer items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-200)]"
                      >
                        <EducationSpaceGlyph kind="tenant" iconSrc={node.icon} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[length:var(--font-size-base)] text-text">{node.name}</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="size-[16px] shrink-0 text-primary" strokeWidth={2.4} />
                        ) : (
                          <ChevronDown className="size-[16px] shrink-0 text-text-tertiary" strokeWidth={2.4} />
                        )}
                      </DropdownMenuItem>
                      {isExpanded &&
                        node.children?.map((child) => {
                          const selected = child.id === value;
                          return (
                            <DropdownMenuItem
                              key={child.id}
                              onClick={() => onChange(child.id)}
                              className="flex cursor-pointer items-center gap-[var(--space-200)] py-[var(--space-200)] pl-[var(--space-600)] pr-[var(--space-300)]"
                            >
                              {selected ? (
                                <CheckGlyph />
                              ) : (
                                <EducationSpaceGlyph kind="institution" iconSrc={child.icon} />
                              )}
                              <div className="min-w-0 flex-1">
                                <p
                                  className={cn(
                                    "truncate text-[length:var(--font-size-base)]",
                                    selected ? "font-[var(--font-weight-medium)] text-primary" : "text-text",
                                  )}
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
                const selected = node.id === value;
                return (
                  <DropdownMenuItem
                    key={node.id}
                    onClick={() => onChange(node.id)}
                    className="flex cursor-pointer items-center gap-[var(--space-200)] px-[var(--space-300)] py-[var(--space-200)]"
                  >
                    {selected ? <CheckGlyph /> : <EducationSpaceGlyph kind={node.kind} iconSrc={node.icon} />}
                    <div className="min-w-0 flex-1">
                      <p
                        className={cn(
                          "truncate text-[length:var(--font-size-base)]",
                          selected ? "font-[var(--font-weight-medium)] text-primary" : "text-text",
                        )}
                      >
                        {node.name}
                      </p>
                    </div>
                  </DropdownMenuItem>
                );
              })
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
