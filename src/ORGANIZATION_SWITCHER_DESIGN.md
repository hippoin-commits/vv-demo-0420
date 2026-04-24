# CUI 组织切换完整体验设计

## 概述
为 CUI 界面设计了一个完整的组织切换体验，以对话形式进行，充分利用现有的 Chat 组件体系，遵循 Guidelines.md 中的所有设计规范。

## 设计特点

### 1. 对话式交互
- 当用户点击导航栏的组织名称时，AI 主动发起对话
- 使用 `GenericCard` 和 `OrganizationSwitcherCard` 展示组织信息
- 提供 `ChatPromptButton` 作为快捷操作选项

### 2. 智能头像显示
- 组织切换卡片使用标准的头像显示逻辑
- 切换确认消息强制显示头像（`isAfterPrompt: true`）
- 符合 Guidelines.md 中的响应式布局规则

### 3. 响应式设计
- 移动端（< 768px）：垂直布局，28px 头像，6px 间距
- 桌面端（≥ 768px）：水平布局，36px 头像，8px 间距
- 卡片宽度自适应：`w-full md:w-[calc(100%-44px)]`

## 实现架构

### 已完成的组件

#### 1. OrganizationSwitcherCard 组件
位置：`/components/main-ai/OrganizationSwitcherCard.tsx`

特性：
- 显示当前组织信息（图标、名称、成员数）
- 可选组织列表（支持选择和确认）
- 集成操作按钮（加入组织、创建组织）
- **在卡片外部**提供 ChatPromptButton 快捷操作

```typescript
interface Organization {
  id: string;
  name: string;
  icon?: string;
  memberCount?: number;
  description?: string;
}
```

#### 2. ChatNavBar 修改
新增 props：
- `currentOrg?: string` - 当前选中的组织 ID
- `onOrgClick?: () => void` - 点击组织时的回调

功能：
- 组织选择器改为按钮，点击触发 `onOrgClick`
- 显示当前组织名称
- 悬停效果和过渡动画

#### 3. 组织数据定义
在 `MainAIChatWindow.tsx` 中定义：

```typescript
const AVAILABLE_ORGANIZATIONS: Organization[] = [
  {
    id: 'xiaoce',
    name: '小测教育机构',
    icon: orgIcon,
    memberCount: 156,
    description: '专注K12在线教育的领先机构'
  },
  {
    id: 'default',
    name: '默认组织',
    icon: orgIcon,
    memberCount: 42,
    description: '系统默认组织'
  },
  {
    id: 'test',
    name: '测试机构',
    icon: orgIcon,
    memberCount: 8,
    description: '用于测试和演示的组织'
  }
];
```

## 完整实现步骤（待完成）

### 第一步：添加组织状态管理

在 `MainAIChatWindow` 组件中添加：

```typescript
// 在 Education Mode State 之后添加
const [currentOrg, setCurrentOrg] = React.useState<string>('xiaoce');
```

### 第二步：实现组织切换处理函数

```typescript
// 在 handleContinueCreateEmail 之后添加

const handleOrgClick = () => {
  // 用户点击组织时，插入一条 AI 消息
  const orgSwitcherMsg: Message = {
    id: `org-switcher-${Date.now()}`,
    senderId: conversation.user.id,
    content: ORG_SWITCHER_MARKER,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now(),
    isAfterPrompt: false
  };
  
  setEducationMessages(prev => [...prev, orgSwitcherMsg]);
  
  // 自动滚动到底部
  setTimeout(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, 100);
};

const handleOrgSwitch = (orgId: string) => {
  const selectedOrg = AVAILABLE_ORGANIZATIONS.find(o => o.id === orgId);
  if (!selectedOrg) return;
  
  // 更新当前组织
  setCurrentOrg(orgId);
  
  // 添加确认消息
  const confirmMsg: Message = {
    id: `org-confirm-${Date.now()}`,
    senderId: conversation.user.id,
    content: `已成功切换到「${selectedOrg.name}」，该组织共有 ${selectedOrg.memberCount} 位成员。您现在可以访问该组织的所有资源和功能。`,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),\n    createdAt: Date.now(),
    isAfterPrompt: true // 强制显示头像
  };
  
  setEducationMessages(prev => [...prev, confirmMsg]);
  
  // 自动滚动
  setTimeout(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: "smooth" });
  }, 100);
};

const handleCreateOrg = () => {
  // 显示创建组织的提示
  const createMsg: Message = {
    id: `org-create-${Date.now()}`,
    senderId: conversation.user.id,
    content: "创建新组织功能开发中，敬请期待。您可以先选择现有组织进行切换。",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now(),
    isAfterPrompt: true
  };
  
  setEducationMessages(prev => [...prev, createMsg]);
};

const handleJoinOrg = () => {
  // 显示加入组织的提示
  const joinMsg: Message = {
    id: `org-join-${Date.now()}`,
    senderId: conversation.user.id,
    content: "请联系组织管理员获取邀请链接，或输入组织邀请码进行加入。",
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: Date.now(),
    isAfterPrompt: true
  };
  
  setEducationMessages(prev => [...prev, joinMsg]);
};
```

### 第三步：在消息渲染中添加组织切换卡片

在消息渲染逻辑中（`messages.map` 部分），添加 `isOrgSwitcher` 判断：

```typescript
const isMe = msg.senderId === currentUser.id
const isPersonalInfo = msg.content === PERSONAL_INFO_MARKER
const isCreateEmailForm = msg.content === CREATE_EMAIL_MARKER
const isContinueEmail = msg.content === CONTINUE_EMAIL_MARKER
const isGenericCard = msg.content.startsWith("<<<RENDER_GENERIC_CARD>>>:");
const isOrgSwitcher = msg.content === ORG_SWITCHER_MARKER; // 新增
const isSpecialComponent = isPersonalInfo || isCreateEmailForm || isContinueEmail || isGenericCard || isOrgSwitcher; // 更新
```

然后在渲染部分添加组织切换卡片的条件渲染（在 `isGenericCard` 判断之后）：

```typescript
) : isOrgSwitcher ? (
  <div className={cn(
    "flex flex-col md:flex-row gap-[6px] md:gap-[8px] w-full md:w-[calc(100%-44px)] justify-start group",
    hideAvatar ? "-mt-[var(--space-400)]" : ""
  )}>
    {!hideAvatar ? (
      <Avatar className="w-[28px] h-[28px] md:w-[36px] md:h-[36px] shrink-0">
        <AvatarImage src={conversation.user.avatar} />
      </Avatar>
    ) : (
      <div className="hidden md:block w-[36px] shrink-0" />
    )}
    <div className="w-full">
      <OrganizationSwitcherCard
        currentOrg={AVAILABLE_ORGANIZATIONS.find(o => o.id === currentOrg) || AVAILABLE_ORGANIZATIONS[0]}
        organizations={AVAILABLE_ORGANIZATIONS}
        onSelectOrg={handleOrgSwitch}
        onCreateOrg={handleCreateOrg}
        onJoinOrg={handleJoinOrg}
      />
    </div>
  </div>
```

### 第四步：更新 ChatNavBar props

在 `<ChatNavBar>` 组件调用处添加新的 props：

```typescript
<ChatNavBar 
  title=""
  onToggleHistory={onToggleHistory}
  onNewMessage={handleNewConversation}
  showOrgSelect={activeApp === 'education'}
  currentOrg={currentOrg} // 新增
  onOrgClick={activeApp === 'education' ? handleOrgClick : undefined} // 新增
  onBack={activeApp === 'education' ? () => setActiveApp(null) : undefined}
/>
```

## 用户流程示例

### 场景1：主动切换组织

1. **用户操作**：点击导航栏的"小测教育机构"
2. **AI 响应**：显示组织切换卡片，包含：
   - 当前组织信息（小测教育机构，156位成员）
   - 可选组织列表（默认组织、测试机构）
   - 操作按钮（加入组织、创建组织）
3. **快捷操作**：卡片外部显示 ChatPromptButton：
   - "保持当前组织"
   - "切换到默认组织"
   - "切换到测试机构"
   - "创建新组织"
4. **用户选择**：点击"测试机构"或通过快捷按钮选择
5. **AI 确认**：显示切换成功消息，强制显示头像

### 场景2：创建新组织

1. **用户操作**：在组织切换卡片中点击"创建组织"
2. **AI 响应**：提示功能开发中，或引导用户完成创建流程
3. **后续操作**：可能触发表单填写等交互

### 场景3：加入组织

1. **用户操作**：点击"加入组织"
2. **AI 响应**：提示输入邀请码或联系管理员
3. **后续交互**：可能需要验证邀请码

## 设计规范遵循

### CSS 变量使用
- ✅ 所有颜色使用 `--color-*` 变量
- ✅ 间距使用 `--space-*` 变量
- ✅ 圆角使用 `--radius-*` 变量
- ✅ 字体大小使用 `--font-size-*` 变量

### 响应式布局
- ✅ Mobile: `flex-col gap-[6px]`
- ✅ Desktop: `md:flex-row md:gap-[8px]`
- ✅ 头像大小: `w-[28px] md:w-[36px]`
- ✅ 卡片宽度: `w-full md:w-[calc(100%-44px)]`

### 组件优先级
- ✅ 优先使用 `GenericCard`
- ✅ Prompt 按钮使用 `ChatPromptButton`
- ✅ 头像显示遵循智能逻辑
- ✅ 卡片外部提供 Prompt 选项

## 视觉效果

### 组织切换卡片
```
┌─────────────────────────────────────────┐
│  🏢  切换组织                            │
├─────────────────────────────────────────┤
│  当前组织                                │
│  ┌───────────────────────────────────┐  │
│  │ 📷 小测教育机构                    │  │
│  │    156 位成员                      │  │
│  └───────────────────────────────────┘  │
│                                          │
│  选择要切换的组织                         │
│  ┌───────────────────────────────────┐  │
│  │ 📷 默认组织           ✓            │  │
│  │    42 位成员                       │  │
│  └───────────────────────────────────┘  │
│  ┌───────────────────────────────────┐  │
│  │ 📷 测试机构                        │  │
│  │    8 位成员                        │  │
│  └───────────────────────────────────┘  │
│                                          │
│  [ 确认切换到默认组织 ]                  │
│                                          │
│  [ 加入组织 ]  [ 创建组织 ]             │
└─────────────────────────────────────────┘

💬 保持当前组织  💬 切换到默认组织  💬 创建新组织
```

## 技术亮点

1. **状态管理**：使用 React hooks 管理组织状态
2. **类型安全**：TypeScript 类型定义完整
3. **可扩展性**：易于添加更多组织或功能
4. **用户体验**：流畅的过渡动画和即时反馈
5. **一致性**：完全遵循现有设计规范

## 后续优化建议

1. **持久化**：将当前组织保存到 localStorage
2. **权限控制**：根据用户权限显示不同的组织列表
3. **搜索功能**：当组织很多时添加搜索框
4. **最近访问**：显示最近访问的组织
5. **组织详情**：点击组织查看详细信息

## 总结

该设计提供了一个完整的、符合 CUI 风格的组织切换体验，充分利用了现有的 Chat 组件体系，遵循了所有设计规范，并提供了流畅的用户交互。实现简单，易于扩展，用户体验优秀。
