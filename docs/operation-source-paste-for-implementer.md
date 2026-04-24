# 操作来源（返回来源消息）— 给实现者的粘贴用说明

把下面 **「从 ---PROMPT START--- 到 ---PROMPT END---」** 的整块复制到 ChatGPT / Cursor / 其它 AI 的输入框即可；实现者无需打开本仓库。

---

## ---PROMPT START---

你是资深前端工程师。请在**当前项目**（对话式 UI / 消息列表 + 卡片）中实现「**操作来源**」能力：当用户从某条消息上的**卡片/列表**进入下一条助手卡片时，在新卡片区域右上角显示可点击的来源条；点击后**滚动**回「来源那条消息」在列表中的位置。

### 一、数据模型（每条消息可选字段）

```ts
type MessageOperationSource = {
  /** 主文案场景名，如「收到新邮件」「我的邮箱」「写邮件」 */
  cardTitle: string;
  /** 必填：来源那条消息在列表里的 id；用于滚动与「紧挨不展示」判断 */
  sourceMessageId: string;
  /** 可选：补充对象名，与 cardTitle 拼展示，如邮件主题、菜单名 */
  sourceDetailLabel?: string;
  /** 可选：来源消息所在会话 id；若与当前消息会话 id 不一致则整条不展示 */
  sourceConversationId?: string;
};
```

在「从父卡片/列表打开子卡片」时，给**新追加**的那条助手消息附上 `operationSource`。

### 二、展示文案算法（必须一致）

函数 `resolveOperationSourceLabel(msg, index, messages, currentConversationId)` 返回 `string | undefined`：

1. 若无 `operationSource`，或 `cardTitle` 空白，或无 `sourceMessageId` → 返回 `undefined`（**不渲染**操作来源条）。
2. 若同时存在 `currentConversationId` 与 `sourceConversationId` 且不相等 → 返回 `undefined`（跨会话/租户不展示）。
3. **紧挨隐藏**：若 `messages[index - 1]?.id === operationSource.sourceMessageId` → 返回 `undefined`。  
   - **重要**：`sourceMessageId` 必须是**来源卡片所在行的消息 id**，不要填更上面的用户气泡 id，否则子卡与来源卡紧挨时仍会错误显示操作来源。
4. 否则：设 `title = cardTitle.trim()`，`detail = sourceDetailLabel?.trim()`。  
   - 若有 `detail`：展示为 **`title + "  " + detail`**（**两个半角空格**）。  
   - 若无 `detail`：展示为 **`title`**。

### 三、UI 与交互

- 操作来源条放在**助手消息行内、主卡片上方或右上**，与头像列布局协调（窄屏可头像与条同一行右对齐；桌面可条单独一行右对齐）。
- 若 `resolveOperationSourceLabel(...) === undefined`：**不渲染**该条。
- 若有文案且存在 `sourceMessageId`：渲染为**可点击按钮**；`onClick` 调用 `scrollToMessageById(sourceMessageId)`。
- 用 React Context 包在每条消息外：`value={{ onNavigateToOperationSource: hasId ? () => scroll(id) : undefined }}`，条内 `useContext` 决定按钮/只读。

### 四、滚动实现契约

- 每条消息最外层容器必须有 **`data-message-id={message.id}`**，与 `sourceMessageId` 一致。
- `scrollToMessageById`：`document.querySelector('[data-message-id="' + escape(id) + '"]')` 找到行 → 找最近滚动父节点（如 `.overflow-y-auto`）→ 将目标行**顶对齐**到可视区域（若有固定顶栏需减去高度）。找不到则 noop。建议支持 `prefers-reduced-motion`。

### 五、何时写入 `operationSource`（业务规则）

| 场景 | 写法 |
|------|------|
| 从列表卡/摘要卡点开子卡片（读信、写信等） | `cardTitle` = 父卡片类型名；`sourceMessageId` = **父卡片那条消息的 id**；可选 `sourceDetailLabel` = 菜单或邮件主题 |
| 从底栏菜单推入一串：先用户消息再 bot 卡片 | 常见做法：`sourceMessageId` = **刚插入的那条用户消息 id**；`cardTitle` = 应用名；`sourceDetailLabel` = 子菜单文案 |
| 从「新邮件摘要」点快捷入口推列表/写信 | 若存在摘要消息：从会话中定位该摘要消息 id，`cardTitle: "收到新邮件"`，`sourceDetailLabel`: 「我的邮箱」/「业务邮箱」/「写邮件」；**若无摘要消息则不写** `operationSource` |
| 纯文本回复、同条消息内仅 patch 形态（不新增消息） | **不要写** `operationSource` |

### 六、自测清单

- [ ] 子卡紧跟父卡且无中间消息时：**不出现**操作来源条。  
- [ ] 中间插入一条别的消息后：子卡**出现**条，点击能滚到父卡。  
- [ ] `sourceConversationId` 与当前会话不一致时：**不出现**条。  
- [ ] 有 `sourceDetailLabel` 时展示为「主标题␠␠补充」（两空格）。  
- [ ] 点击后目标行在视口内可见且不被顶栏挡住。

按上述规范实现；语言栈（React/Vue）可替换，**逻辑与字段语义不可省略**。

## ---PROMPT END---

---

## 你怎么发给同事（三选一）

1. **发文件**：把本文件路径发他，让他在本仓库打开  
   `docs/operation-source-paste-for-implementer.md`  
   让他只复制其中 **PROMPT START/END 之间** 到 AI 输入框。

2. **发纯文本**：打开该文件，复制 **「从 ---PROMPT START--- 到 ---PROMPT END---」** 整段，微信/飞书/邮件粘贴即可。

3. **发链接**：若代码托管在 Git 网页上，发该文件在仓库里的 **blob 链接**；对方打开后同样复制 PROMPT 区块。

> 说明：AI 只能按**文字规范**实现，无法自动读你未挂载的私有仓库；若同事项目与你们差异大，让他在粘贴后再补一句：「我们技术栈是 ___，消息列表组件是 ___。」
