# VV Design System Reference

## 规范来源（本仓库）

- 设计规范：`guidelines/Guidelines.md`
- 变量定义：`src/styles/globals.css`
- 组件目录：`src/components/ui`

## 关键规范摘要

- 双层变量体系：
  - 语义层：`@theme`（优先）
  - 基础层：`:root`（补充）
- 强制原则：
  - 永不硬编码样式值
  - 先语义变量，后基础变量
  - 同类场景保持同一映射规则

## 变量使用速记

- 颜色（优先语义类）：`bg-primary` `text-text` `border-border`
- 颜色（变量兜底）：`bg-[var(--color-primary)]`
- 字号：`text-[length:var(--font-size-*)]`
- 间距：`p-[var(--space-*)]` `gap-[var(--space-*)]`
- 圆角：`rounded-[var(--radius-*)]`
- 透明与特效：`--blue-alpha-*` `--black-alpha-*` 等基础变量

## 反模式（禁止）

- `bg-[#5590F6]` / `rgb(...)`
- `bg-blue-500` 等非设计系统主题色
- `p-4` `gap-2` `rounded-[8px]` 这类硬编码或脱离 token 的写法

## 聊天卡片与消息布局规则（来自 Guidelines）

- 移动端：头像 28px，纵向结构，`gap-[6px]`
- 桌面端：头像 36px，横向结构，`md:gap-[8px]`
- 默认消息卡片优先 `<GenericCard>`
- 表单消息卡片优先 `<GenericFormCard>`
- 卡片外必须给后续 prompt，按钮使用 `<ChatPromptButton>`
- 表单内按钮使用 `<Button variant="chat-submit" | "chat-reset">`

## 组件清单（可复用来源）

- `accordion.tsx`
- `alert-dialog.tsx`
- `alert.tsx`
- `aspect-ratio.tsx`
- `avatar.tsx`
- `badge.tsx`
- `breadcrumb.tsx`
- `browse.tsx`
- `button.tsx`
- `calendar.tsx`
- `card.tsx`
- `carousel.tsx`
- `chart.tsx`
- `checkbox.tsx`
- `collapsible.tsx`
- `command.tsx`
- `context-menu.tsx`
- `dialog.tsx`
- `drawer.tsx`
- `dropdown-menu.tsx`
- `field.tsx`
- `file-upload.tsx`
- `form.tsx`
- `hover-card.tsx`
- `input-otp.tsx`
- `input.tsx`
- `label.tsx`
- `menubar.tsx`
- `navigation-menu.tsx`
- `pagination.tsx`
- `popover.tsx`
- `progress.tsx`
- `radio-group.tsx`
- `resizable.tsx`
- `scroll-area.tsx`
- `select.tsx`
- `separator.tsx`
- `sheet.tsx`
- `sidebar.tsx`
- `skeleton.tsx`
- `slider.tsx`
- `sonner.tsx`
- `switch.tsx`
- `table.tsx`
- `tabs.tsx`
- `textarea.tsx`
- `toggle-group.tsx`
- `toggle.tsx`
- `tooltip.tsx`

## 维护建议

- 每次 `Guidelines.md` 或 `src/styles/globals.css` 变化后，同步更新本文件。
- 新增 UI 组件后，将文件名补入“组件清单”。
- 若变量命名变更，先更新 skill，再批量改业务，避免新旧规则并存。
