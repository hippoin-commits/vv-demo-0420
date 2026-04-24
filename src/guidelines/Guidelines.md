# Design System & CSS Variables Guidelines

> **Purpose**: This document defines the CSS variable system and usage rules for maintaining consistency across the entire project. All developers and AI assistants must follow these guidelines strictly to prevent hardcoding and ensure design system integrity.

---

## Table of Contents

1. [Overview](#overview)
2. [Variable Priority System](#variable-priority-system)
3. [Variable Reference Guide](#variable-reference-guide)
4. [Usage Rules & Best Practices](#usage-rules--best-practices)
5. [Common Patterns](#common-patterns)
6. [Troubleshooting](#troubleshooting)

---

## Overview

### Design System Architecture

The project uses a **two-layer CSS variable system**:

1. **Semantic Layer** (`@theme`) - Component-level variables that generate Tailwind classes
2. **Foundation Layer** (`:root`) - Design token primitives (12-step color scales, spacing, radius, etc.)

### File Location

All CSS variables are defined in `/styles/globals.css`:
- **Lines 8-359**: Foundation layer (`:root` and `.dark`)
- **Lines 561-684**: Semantic layer (`@theme`)

### Guiding Principles

- ✅ **NEVER hardcode values** - Always use CSS variables
- ✅ **Follow priority order** - Semantic → Foundation → Never hardcode
- ✅ **Use generated classes** - Prefer Tailwind classes over arbitrary values when possible
- ✅ **Maintain consistency** - Same use case = same variable reference pattern

---

## Variable Priority System

### Priority 1: Semantic Variables (`@theme`) 🟢

**When to use**: For all theme-related UI components (buttons, badges, cards, inputs, alerts, etc.)

These variables are defined in the `@theme` block and **automatically generate Tailwind utility classes**.

#### Available Semantic Variables

##### Brand Colors (Primary)

| Variable | Generates Tailwind Class | Use Case |
|----------|-------------------------|----------|
| `--color-primary` | `bg-primary`, `text-primary`, `border-primary` | Default brand color |
| `--color-primary-hover` | `hover:bg-primary-hover` | Hover state |
| `--color-primary-active` | `active:bg-primary-active` | Active/pressed state |
| `--color-primary-disabled` | `disabled:bg-primary-disabled` | Disabled state |
| `--color-primary-selected` | `bg-primary-selected` | Selected state |
| `--color-primary-foreground` | `text-primary-foreground` | Text on primary background (usually white) |

##### Background Colors

| Variable | Generates Tailwind Class | Use Case |
|----------|-------------------------|----------|
| `--color-bg` | `bg-bg` | Application main background |
| `--color-bg-secondary` | `bg-bg-secondary` | Secondary background (secondary cards, panels) |
| `--color-bg-tertiary` | `bg-bg-tertiary` | Tertiary background (nested elements) |

##### Text Colors

| Variable | Generates Tailwind Class | Use Case |
|----------|-------------------------|----------|
| `--color-text` | `text-text` | Primary text |
| `--color-text-secondary` | `text-text-secondary` | Secondary text (descriptions) |
| `--color-text-tertiary` | `text-text-tertiary` | Tertiary text (captions) |
| `--color-text-muted` | `text-text-muted` | Muted text (placeholders, hints) |

##### State Colors

Each state has a complete set of variants:

**Info State**
- `--color-info` → `bg-info`
- `--color-info-hover` → `hover:bg-info-hover`
- `--color-info-active` → `active:bg-info-active`
- `--color-info-disabled` → `disabled:bg-info-disabled`
- `--color-info-foreground` → `text-info-foreground`

**Success State** (replace `info` with `success`)  
**Warning State** (replace `info` with `warning`)  
**Error State** (replace `info` with `error`)

##### Border & Dividers

| Variable | Generates Tailwind Class | Use Case |
|----------|-------------------------|----------|
| `--color-border` | `border-border` | Default borders |
| `--color-border-divider` | `border-border-divider` | Divider lines |

##### Contrast Colors

| Variable | Direct Usage | Use Case |
|----------|--------------|----------|
| `--color-white` | `text-[var(--color-white)]` | Pure white (Tailwind class may not work) |
| `--color-black` | `text-[var(--color-black)]` | Pure black (Tailwind class may not work) |

##### Other Semantic Colors

| Variable | Generates Tailwind Class | Use Case |
|----------|-------------------------|----------|
| `--color-disabled` | `bg-disabled` | Disabled state background |
| `--color-destructive` | `bg-destructive` | Dangerous actions |
| `--color-ring` | `ring-ring` | Focus ring |
| `--color-overlay` | `bg-overlay` | Modal overlay |
| `--color-overlay-light` | `bg-overlay-light` | Light overlay |

##### Radius

| Variable | Generates Tailwind Class | Use Case |
|----------|-------------------------|----------|
| `--radius-sm` | `rounded-sm` | Small radius (4px) |
| `--radius-md` | `rounded-md` | Medium radius (6px) |
| `--radius-lg` | `rounded-lg` | Large radius (8px) |
| `--radius-xl` | `rounded-xl` | Extra large radius (12px) |
| `--radius-button` | `rounded-[var(--radius-button)]` | Button-specific (20px) |
| `--radius-card` | `rounded-[var(--radius-card)]` | Card-specific (12px) |
| `--radius-input` | `rounded-[var(--radius-input)]` | Input-specific (22px) |

##### Shadow

| Variable | Generates Tailwind Class | Use Case |
|----------|-------------------------|----------|
| `--shadow-xs` | `shadow-sm` | Small elevation shadow |

---

### Priority 2: Foundation Variables (`:root`) 🟡

**When to use**: 
- For special effects (transparency, gradients, overlays)
- When you need a specific step from the 12-step color scale
- For precise spacing/sizing that doesn't have a semantic equivalent

#### Color System (12-Step Scales)

All color scales go from darkest (1) to lightest (12).

##### Neutral Gray

- `--neutral-1` to `--neutral-12` - Pure grayscale without color bias

##### Semantic Gray

- `--gray-1` to `--gray-12` - Gray with blue tint, used for UI elements

##### Brand Blue

- `--blue-1` to `--blue-12` - Solid blue scale
- `--blue-alpha-1` to `--blue-alpha-12` - Blue with transparency

##### State Colors

- **Red** (Error/Danger): `--red-1` to `--red-12` + `--red-alpha-1` to `--red-alpha-12`
- **Orange** (Warning): `--orange-1` to `--orange-12` + `--orange-alpha-1` to `--orange-alpha-12`
- **Green** (Success): `--green-1` to `--green-12` + `--green-alpha-1` to `--green-alpha-12`
- **Yellow** (Caution): `--yellow-1` to `--yellow-12` + `--yellow-alpha-1` to `--yellow-alpha-12`

##### Black & White with Alpha

- `--black-alpha-0` to `--black-alpha-12` - Black with opacity (0% to 98%)
- `--white-alpha-0` to `--white-alpha-12` - White with opacity (0% to 98%)
- `--white` - Pure white `rgb(255, 255, 255)`
- `--black` - Pure black `rgb(0, 0, 0)`

#### Spacing System

Consistent spacing scale from 0 to 160px:

```
--space-0: 0px
--space-50: 2px
--space-100: 4px
--space-150: 6px
--space-200: 8px
--space-250: 10px
--space-300: 12px
--space-350: 14px
--space-400: 16px
--space-500: 20px
--space-600: 24px
--space-700: 28px
--space-800: 32px
--space-900: 36px
--space-1000: 40px
--space-1200: 48px
--space-1600: 64px
--space-4000: 160px
```

#### Radius System

Consistent radius scale from 0 to 64px + full:

```
--radius-none: 0px
--radius-50: 2px
--radius-100: 4px
--radius-150: 6px
--radius-200: 8px
--radius-250: 10px
--radius-300: 12px
--radius-400: 16px
--radius-500: 20px
--radius-600: 24px
--radius-800: 32px
--radius-900: 36px
--radius-1000: 40px
--radius-1200: 48px
--radius-1600: 64px
--radius-full: 9999px
```

#### Typography System

##### Font Sizes

```
--font-size-xxs: 10px
--font-size-xs: 12px
--font-size-base: 14px
--font-size-md: 16px
--font-size-lg: 18px
--font-size-xl: 20px
--font-size-2xl: 24px
--font-size-3xl: 28px
--font-size-4xl: 32px
--font-size-5xl: 36px
--font-size-6xl: 40px
```

##### Font Weights

```
--font-weight-thin: 100
--font-weight-extra-light: 200
--font-weight-light: 300
--font-weight-regular: 400
--font-weight-medium: 500
--font-weight-semi-bold: 600
--font-weight-bold: 700
--font-weight-extra-bold: 800
--font-weight-heavy: 900
```

##### Line Heights

```
--line-height-4xs: 14px
--line-height-3xs: 16px
--line-height-2xs: 18px
--line-height-xs: 20px
--line-height-sm: 22px
--line-height-md: 24px
--line-height-base: 26px
--line-height-lg: 28px
--line-height-xl: 32px
--line-height-2xl: 36px
--line-height-3xl: 42px
--line-height-4xl: 48px
--line-height-5xl: 68px
```

##### Letter Spacing

```
--letter-spacing-xs: -0.4px
--letter-spacing-base: 0px
--letter-spacing-sm: 0.6px
--letter-spacing-md: 1.2px
--letter-spacing-lg: 2px
--letter-spacing-xl: 3px
```

#### Shadow System

```
--shadow-xs: 0px 4px 16px rgba(15, 24, 30, 0.05)
--shadow-sm: 0px 8px 32px rgba(26, 24, 30, 0.1)
--shadow-md: 0px 12px 48px rgba(0,0,0,0.1)
```

---

## Usage Rules & Best Practices

### ✅ DO: Recommended Patterns

#### 1. Theme Components (Buttons, Badges, Cards, etc.)

**Priority 1**: Use Tailwind classes generated from semantic variables

```tsx
// ✅ BEST: Use Tailwind generated classes
<button className="bg-primary text-primary-foreground hover:bg-primary-hover">
  Primary Button
</button>

<div className="bg-bg-secondary border border-border rounded-lg">
  Card Content
</div>

<span className="text-text-secondary">
  Secondary text
</span>
```

**Priority 2**: Use arbitrary values with semantic variables (when Tailwind class doesn't work)

```tsx
// ✅ GOOD: When Tailwind class is not generated or doesn't work
<button className="bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
  Primary Button
</button>

// ✅ GOOD: Using color type annotation for clarity
<button className="text-[color:var(--color-white)]">
  White text
</button>
```

#### 2. Special Effects & Transparency

Use foundation layer alpha variables:

```tsx
// ✅ CORRECT: Semi-transparent blue overlay
<div className="bg-[var(--blue-alpha-11)]">
  Hover overlay
</div>

// ✅ CORRECT: Black modal overlay
<div className="bg-[var(--black-alpha-4)]">
  Modal backdrop
</div>

// ✅ CORRECT: White shadow with transparency
<div className="shadow-[0_0_20px_var(--white-alpha-6)]">
  Glowing effect
</div>
```

#### 3. Custom Spacing & Sizing

```tsx
// ✅ CORRECT: Using spacing variables
<div className="p-[var(--space-400)] gap-[var(--space-200)] m-[var(--space-600)]">
  Content with consistent spacing
</div>

// ✅ CORRECT: Using custom radius
<div className="rounded-[var(--radius-300)]">
  Custom rounded element
</div>

// ✅ CORRECT: Using font size variables
<p className="text-[length:var(--font-size-lg)]">
  Larger text
</p>
```

#### 4. State Variants

```tsx
// ✅ CORRECT: Complete state management
<button className="
  bg-primary 
  hover:bg-primary-hover 
  active:bg-primary-active 
  disabled:bg-primary-disabled
  text-primary-foreground
">
  Interactive Button
</button>

// ✅ CORRECT: Success state
<div className="bg-success text-success-foreground hover:bg-success-hover">
  Success message
</div>
```

---

### ❌ DON'T: Anti-patterns

```tsx
// ❌ WRONG: Hardcoded hex colors
<button className="bg-[#5590F6] text-white">
  Button
</button>

// ❌ WRONG: Hardcoded RGB colors
<div style={{ backgroundColor: 'rgb(85, 144, 246)' }}>
  Content
</div>

// ❌ WRONG: Using Tailwind default colors (not from theme)
<button className="bg-blue-500 text-white">
  Button
</button>

// ❌ WRONG: Hardcoded spacing values
<div className="p-4 gap-2 m-6">
  Should use --space-* variables
</div>

// ❌ WRONG: Hardcoded radius
<div className="rounded-[8px]">
  Should use --radius-200 or rounded-lg
</div>

// ❌ WRONG: Skipping semantic layer (direct use of foundation scale)
<button className="bg-[var(--blue-6)]">
  Should use bg-primary or bg-[var(--color-primary)]
</button>

// ❌ WRONG: Hardcoded font sizes
<p className="text-lg">
  Should use text-[length:var(--font-size-lg)]
</p>
```

---

## Common Patterns

### Pattern 1: Button Component

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base styles - explicitly set text color to avoid inheritance issues
  "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-button)] transition-colors disabled:pointer-events-none text-[var(--color-text)]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-[var(--color-white)] hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled",
        secondary: "bg-[var(--black-alpha-11)] text-text hover:bg-[var(--black-alpha-9)] border border-border",
        destructive: "bg-error text-[var(--color-white)] hover:bg-error-hover",
        ghost: "hover:bg-[var(--black-alpha-11)] text-text",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-[var(--space-700)] px-[var(--space-300)] gap-[var(--space-100)] text-[length:var(--font-size-xs)]",
        md: "h-[var(--space-800)] px-[var(--space-400)] gap-[var(--space-150)] text-[length:var(--font-size-base)]",
        lg: "h-[var(--space-1000)] px-[var(--space-600)] gap-[var(--space-200)] text-[length:var(--font-size-md)]",
        icon: "h-[var(--space-800)] w-[var(--space-800)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      className={buttonVariants({ variant, size, className })}
      {...props}
    />
  );
}
```

### Pattern 2: Card Component

```tsx
export function Card({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`bg-bg-secondary border border-border rounded-[var(--radius-card)] p-[var(--space-600)] shadow-elevation-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Pattern 3: Input Component

```tsx
export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`
        w-full h-[var(--space-1000)] px-[var(--space-400)]
        bg-[var(--color-input-background)] 
        border border-border 
        rounded-[var(--radius-input)]
        text-text text-[length:var(--font-size-base)]
        placeholder:text-[var(--color-input-placeholder)]
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
}
```

### Pattern 4: Badge Component

```tsx
const badgeVariants = cva(
  "inline-flex items-center rounded-[var(--radius-100)] px-[var(--space-200)] py-[var(--space-50)] text-[length:var(--font-size-xs)] font-[var(--font-weight-medium)]",
  {
    variants: {
      variant: {
        default: "bg-primary text-[var(--color-white)]",
        success: "bg-success text-[var(--color-white)]",
        warning: "bg-warning text-[var(--color-white)]",
        error: "bg-error text-[var(--color-white)]",
        outline: "border border-border text-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);
```

### Pattern 5: Modal Overlay

```tsx
export function Modal({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[var(--color-overlay)]" />
      
      {/* Content */}
      <div className="relative bg-bg-secondary border border-border rounded-[var(--radius-card)] p-[var(--space-600)] shadow-md max-w-md w-full">
        {children}
      </div>
    </div>
  );
}
```

---

## Troubleshooting

### Issue 1: Tailwind Class Not Working

**Problem**: Class like `text-primary-foreground` or `bg-white` is not applying styles

**Solution 1**: Use arbitrary value syntax with explicit type annotation

```tsx
// If this doesn't work:
<div className="text-primary-foreground">Text</div>

// Try this:
<div className="text-[color:var(--color-primary-foreground)]">Text</div>

// Or this (simpler):
<div className="text-[var(--color-primary-foreground)]">Text</div>
```

**Solution 2**: For colors with hyphens (like `white-contrast`), always use arbitrary values

```tsx
// These won't work due to Tailwind v4 parsing issues:
<div className="text-white-contrast">Text</div>
<div className="bg-black-contrast">Background</div>

// Use these instead:
<div className="text-[var(--color-white)]">Text</div>
<div className="bg-[var(--color-black)]">Background</div>
```

### Issue 2: Inherited Text Color

**Problem**: Component inherits `text-text` from `body`, causing wrong color

**Solution**: Explicitly set text color in base styles

```tsx
const buttonVariants = cva(
  // Add explicit text color in base to reset inheritance
  "inline-flex items-center text-[var(--color-text)] ...",
  {
    variants: {
      variant: {
        // Override with specific color for this variant
        primary: "bg-primary text-[var(--color-white)]",
      }
    }
  }
);
```

### Issue 3: Arbitrary Value Not Working

**Problem**: Arbitrary value like `text-[var(--font-size-md)]` causes type ambiguity

**Solution**: Add explicit type annotation

```tsx
// ❌ WRONG: Ambiguous, could be color or length
<p className="text-[var(--font-size-md)]">Text</p>

// ✅ CORRECT: Explicitly specify it's a length value
<p className="text-[length:var(--font-size-md)]">Text</p>

// Other type annotations:
<div className="bg-[color:var(--color-primary)]">Background</div>
<div className="w-[length:var(--space-600)]">Width</div>
```

### Issue 4: Dark Mode Not Working

**Problem**: Colors don't change in dark mode

**Reason**: The `.dark` class in `:root` redefines all color variables for dark mode. Make sure:

1. Your component uses variables from `@theme` or `:root` (not hardcoded values)
2. The `.dark` class is applied to a parent element (usually `<html>` or `<body>`)

```tsx
// ✅ CORRECT: Will adapt to dark mode automatically
<div className="bg-bg text-text">Content</div>

// ❌ WRONG: Hardcoded, won't change in dark mode
<div className="bg-white text-black">Content</div>
```

### Issue 5: Inconsistent Spacing

**Problem**: Spacing looks different across components

**Solution**: Always use spacing variables, never hardcoded values

```tsx
// ❌ WRONG: Mixing Tailwind defaults and hardcoded values
<div className="p-4 gap-2 m-6">Content</div>

// ✅ CORRECT: Using consistent spacing system
<div className="p-[var(--space-400)] gap-[var(--space-200)] m-[var(--space-600)]">Content</div>
```

---

## AI Chat Message Layout Rules

To ensure a consistent responsive design across all AI chat messages, follow these specific layout rules:

### Mobile (< 768px)
- **Avatar Size**: 28px (`w-[28px] h-[28px]`)
- **Structure**: Top-to-bottom (vertical alignment between avatar and message, e.g., `flex-col`)
- **Spacing**: 6px vertical gap between avatar and message (e.g., `gap-[6px]`)
- **Data-Heavy Cards (e.g., Forms, Tables)**: The **outer wrapper** (containing both avatar and card) must be `w-full`. The **inner wrapper** (containing just the card) must be `w-full`.

### Desktop (>= 768px)
- **Avatar Size**: 36px (`md:w-[36px] md:h-[36px]`)
- **Structure**: Left-to-right (horizontal alignment between avatar and message, e.g., `md:flex-row`)
- **Spacing**: 8px horizontal gap between avatar and message (e.g., `md:gap-[8px]`)
- **Data-Heavy Cards (e.g., Forms, Tables)**: The **outer wrapper** (containing both avatar and card) must be `md:w-[calc(100%-44px)]` to accurately account for message bubble constraints. The **inner wrapper** (containing just the card) must remain `w-full` so it stretches to fill the constrained outer wrapper.

### Chat Cards
- **Default AI Message Cards**: Prioritize the use of `<GenericCard>` component.
- **Form/Input AI Message Cards**: Prioritize the use of `<GenericFormCard>` component.
- **卡片内禁止滚动条（强制）**：凡属**对话流中的会话卡片**（`GenericCard`、`GenericFormCard`、任务/邮箱等会话内卡片，以卡片边框/圆角为界的**内容区**），**不得出现任何滚动条**，也**不得**形成「仅在卡片内滑动」的阅读区：**纵向**禁止 `max-height` / `max-h-*` 与 `overflow-y-auto` / `overflow-scroll` / `overflow-auto` 等组合；**横向**禁止在卡片内容区使用 `overflow-x-auto` / `overflow-x-scroll` 等产生横向滚动条或内部横向滑动。内容随数据**自然撑开**，宽表/长文通过**换行、列压缩、摘要**等方式消化；**整页纵向滚动只由外层聊天列表容器**承担。**例外**：**浮在卡片之上**的 **Popover / Dropdown / Select 面板、Dialog、Drawer** 等独立层（不属于卡片内容区 DOM 内的滚动区）可按交互需要自带滚动；地图等第三方嵌入控件若自带控件内滚动，须在 PR/评审中单独说明。
- **Enforcement**: No `overflow-*-auto|scroll` (or `max-h-*` + overflow) on in-chat **card bodies** that create internal scrollbars or in-card scroll regions; no relying on `scrollbar-hide` to “paper over” in-card scrolling—fix layout/content instead. Outer chat list handles vertical scroll.
- **新卡片视口定位（强制）**：在对话中**每追加一条含卡片的消息**（`GenericCard`、任务表/详情/表单、组织切换器等任意会话内卡片），**必须**在布局提交后让用户看到该内容。滚动策略与常见 AI 对话一致：**将新卡片所在消息行的顶部对齐到聊天列表滚动容器的顶部**（`block: start` 语义），而不是把列表滚到底部使卡片刚好贴底。若卡片高度不足一屏，**下方允许留白**，不要求铺满视口。**任何入口**（欢迎区按钮、表格行点击、`patchMessages`、发送后回推等）打开新卡片时均须满足。
- **实现要点**：为当前会话列表**最后一条消息**外层包一层可挂 `ref` 的容器；在 `useLayoutEffect`（随 `messages` / 分应用消息状态变化）中判断：若最后一条为卡片类消息，则根据 `getBoundingClientRect` 计算与最近 `.overflow-y-auto` 祖先的偏移并 `scrollTo`，或使用等价的 `scrollIntoView({ block: "start" })`；**大卡片**在首帧高度未稳定时，用 **`requestAnimationFrame` 连续两帧**或 **~150ms 延时再对齐一次**。最后一条为**非卡片**（纯气泡等）时，仍使用**滚至列表底部锚点**（`scrollToBottom`），保证常规对话跟读到底。
- **独立浮窗会话**：若存在与主会话分离的滚动区域（如独立教育浮窗），须使用**独立 ref**，避免与主列表锚点互相覆盖。
- **参考实现**：`MainAIChatWindow` 的 `messageContentIsInChatSurfaceCard`、`latestMessageRowRef` / `floatingEducationRowRef`、`scrollLatestCardRowToTop` 与消息变更时的 `useLayoutEffect`。
- **Enforcement**: On new in-chat card messages, align the **top of the new message row** to the **top of the scroll container**; allow whitespace below short cards. On plain text bubbles as the last message, keep scrolling to the **bottom anchor**. Retry alignment after layout (`rAF` ×2 or `setTimeout` ~150ms) for tall cards.


### Application Frame & Consistency

1. **Secondary Page Architecture**: 
   When creating new primary applications (e.g., "Finance", "HR") accessed from the main app launcher.
   - **Menu Interactions**: Use the exact same `<SecondaryAppButton>` pattern with hover-triggered popper menus for sub-navigation.

2. **Chat Component Priority**: 
   - **对话分组语义（强制）**：实现前须判断控件是否属**同一对话组**。**同一组**指**同一次助手侧操作**在会话流中生成、且应视觉上连成一块的内容，包含：**交互卡片**（`GenericCard` / 邮箱列表卡 / 任务卡等）、卡片**外下方**的 **`ChatPromptButton` 行动建议**、**操作来源**（`OperationSourceBar`，与卡片同属一条 `TaskChatMessageRow` 时）、以及同一条助手消息内的**文本气泡 / 欢迎气泡**等与上述元素的纵向堆叠。**用户发送的消息**与**系统/助手发送的消息**分属**不同组**（不同角色、不同 `Message` 边界），二者之间**不得**按「同组 6px」处理，应遵循**组与组之间 25px**（及时间线规则）。凡属**同一助手侧组**内，**纵向间距一律 6px**（`gap-[var(--space-150)]`）。**不同组**指不同 `Message` 边界、或用户与助手轮次切换、或用户分步操作产生的**下一条独立块**：**组与组之间 25px**（`gap-[var(--space-625)]`，如 `MailChatLayer` 根列表）。**禁止**把应属两组的卡片放在同一 6px 链内；也**禁止**把同组内元素误用 25px 隔开。
   - **卡片 ↔ 行动建议（强制，6px）**：助手侧同组内，**白底卡片下缘**到**首行行动建议按钮**的纵向间距必须为 **6px**，实现为卡片与按钮容器同属父级 `flex flex-col gap-[var(--space-150)]`；**禁止**使用 `gap-[var(--space-100)]`（4px）等更小值。行动建议按钮横排与组内刻度一致时优先 **`gap-[var(--space-150)]`**；避免在「卡片—行动建议」同一列上误用更大刻度造成与 6px 不一致。
   - **同组对话块间距（强制，6px）**：同一组内**纵向**堆叠（**时间线 → 气泡/卡片**、**欢迎气泡 → 卡片 → 行动建议** 等）**一律 6px**，父级使用 `flex flex-col gap-[var(--space-150)]`。**时间线** `TimestampSeparator` 默认带 `my-[var(--space-200)]`，在同组内须加 **`className="!my-0"`**，只由父级 `gap` 控制与下一条的 6px。**行动建议**横排与卡片的纵向间距为 6px；按钮之间也用 `gap-[var(--space-150)]`。
   - **不同组对话块间距（强制，25px）**：相邻两条独立会话/消息块之间使用 **`gap-[var(--space-625)]`（25px）**；与同组 6px 不得混用。
   - **会话区底部留白（强制，16px）**：主滚动对话容器（含邮箱等子应用）与底栏（输入区 / 快捷指令）之间须有 **`pb-[var(--space-400)]`（16px）**，避免末条内容与底栏「贴太紧」、视觉仓促；与组内 6、组间 25 独立计数。
   - **新卡片滚动定位（强制，对齐视口顶部）**：会话流中每追加一条**对话区卡片类**消息（任务/邮箱/通用卡等，判定同 `messageContentIsInChatSurfaceCard`），滚动策略须使**该条消息行（含头像列与卡片）的顶部对齐主滚动区可视区域顶部**（实现：`scrollLatestCardRowToTop` + 最后一条消息行 `ref`）。卡片较矮时**下方留白**为预期，与 ChatGPT、Claude 等主流产品一致。**禁止**在推送卡片后额外调用 `scrollToBottom()` 把视图钉在列表最底端，以免拥挤、与顶对齐逻辑冲突；纯文本等非卡片末条仍可使用底部锚点滚至最新。
   - **新一轮对话空屏槽位（强制，`beginNewUserChatRound`）**：判定「新一轮对话」的唯一标准 = **用户操作** 且 **在会话流末尾追加新消息 / 新卡片**。凡满足此条件的入口（输入框发送、欢迎/底栏 `ChatPromptButton` / `SecondaryAppButton` 点击、组织切换 / 创建 / 加入/ 确认加入、邮件底栏菜单、邮箱快捷「我的/业务邮箱/写邮件」、「继续创建」等），须在对应 `setMessages / setEducationMessages / setTaskMessages / updateMailMessages(…append…)` **之前** 调用 **`beginNewUserChatRound(surface)`**（`surface` ∈ `"main" | "education" | "task" | "mail"`）；`surface` 须与当前 `activeApp` / 0419 语境一致，**禁止**自行计算 `priorLen` 或直接调用底层 `armNewRoundForUserSend`。同时**禁止**在新一轮路径再手动 `scrollToBottom()` / `scrollLatestCardRowToTop`，本轮内抑制由 `sameRoundScrollSuppressRef` 统一处理。
   - **原位置切换 / 数据更新（强制，`scrollInPlaceMutatedCardToTop`）**：以下情形 **不属于新一轮对话**，**禁止** `beginNewUserChatRound`：① 同一条消息内的卡片形态切换（如任务「浏览 ↔ 编辑」内联、表单提交后转只读）；② 仅修改已有卡片 `content / snapshot / isReadonly / formData` 等的数据更新。实现须 `patchMessages((p) => p.map(m => m.id === id ? {...} : m))`，并在 **map 之前或相邻位置**调用 **`scrollInPlaceMutatedCardToTop(id)`**（内部 `skipNextChatLayoutScrollRef` + 两帧 rAF + `scrollToMessageById`），将该卡片顶对齐可视顶；**不得**自行再写 `skipNextChatLayoutScrollRef = true` / `requestAnimationFrame × scrollToMessageById` 的等价重复。
   - **卡片内无滚动条（强制）**：与 **Chat Cards · 卡片内禁止滚动条** 一致——会话卡片**内容区内**不得出现纵向/横向滚动条或独立滑动区；勿用 `scrollbar-hide` 掩盖卡片内滚动。
   - **行动建议点击后不消失（强制）**：任意消息中，凡与卡片同组、置于卡片**外侧下方**的 **`ChatPromptButton` 行动建议**（欢迎区、任务详情跟进语、邮箱、通用卡等**一切场景**），在用户**点击其中任意一条之后**，该组行动建议仍须**完整保留、不得因点击而整组隐藏或逐条移除**。禁止用「一点击就卸载/收起行动建议区」来回应操作；需要反馈时**追加**助手气泡或新卡片/新步骤，**不得**以消失行动建议作为主要状态表达。若同一卡片后续迭代新的建议文案，须通过**新消息块**或明确的产品规则追加，而非悄悄删掉用户曾看到的按钮行。
   - **Message Wrappers**: Always use `ChatMessageBubble` with correct state flags (`isMe`, `hideAvatar`, `isAfterPrompt`).
   - **Display Cards**: Use `<GenericCard>` for informational or actionable AI responses.
   - **Form Cards**: Use `<GenericFormCard>` for data collection.
   - **Card Prompts**: Whenever the AI outputs any card structure (like `<GenericCard>` or `<GenericFormCard>`), it **must** provide follow-up prompt options. These prompt buttons **must** use the `<ChatPromptButton>` component and **must be placed below/outside the card**, not inside it. **Interaction**: 须遵守上文 **「行动建议点击后不消失」**；点击仅触发发送/分支逻辑，不删除该行 `ChatPromptButton`。
   - **卡片表单底栏（强制）**：会话内**带表单的卡片**（含 `GenericFormCard`、任务 `ChatTaskFormFooter`、邮箱「新建/编辑签名」等自建表单底栏）须统一：
     - **布局**：**左侧**一般为「重置」等次要操作（取消、保存草稿等亦属左侧次要区，除非产品文档明确要求其它排布）；**右侧**为主要操作（提交、确定、保存等）。
     - **样式（与 `Button` 语义对应）**：**重置 / 取消类等次要操作**使用 **`variant="chat-reset"`**；**主操作**使用 **`variant="chat-submit"`**。主按钮须在底栏横向布局中**占满右侧剩余空间**（例如与左侧组并列时主按钮 `className` 含 **`flex-1 min-w-0`**，外层使用 `flex w-full …` 保证可伸展）。实现时以本仓库 `button.tsx` 中上述 variant 为准。
     - **特例**：**写邮件**会话卡片（`MailComposeCard` / `MailComposeCardV2`）底栏为「存草稿 / 发送邮件」等产品既定样式，**不适用**本条 variant 与主按钮伸展规则，保持现有实现。
   - **从卡片再推送的助手卡片须带头像（强制）**：用户在会话流中从某张助手卡片操作而**追加**的下一助手消息（新 marker 卡片，如邮箱「新建/编辑签名」）视为**新一块助手回复**：须在 **`TaskChatMessageRow` 展示左侧对话头像**；不得对该类消息设 **`suppressAvatar: true`**，也不得在全宽卡分支里把 **`hideAvatarForRow`** 写死为始终隐藏头像（除非产品明确要求本条与上一条共用头像且无 `isAfterPrompt` 等既有例外）。
   - **操作来源与 `sourceMessageId`（强制）**：`resolveOperationSourceLabel`（`operationSource.ts`）：若**紧挨着的上一条消息**的 `id` 等于 **`operationSource.sourceMessageId`**，则不展示 `OperationSourceBar`（来源卡与子卡之间无其它对话）。由**来源卡片**上按钮直接推入的子卡片，写入 **`operationSource` 时须将 `sourceMessageId` 设为该来源卡片对应消息的 `Message.id`**，勿沿用仅指向用户气泡的旧 id，否则会出现「紧挨却仍显示操作来源」的错误。
   - **表单固化后的连续反馈（强制）**：当用户在同一会话流中**提交会话内编辑表单**（如任务编辑卡「确定」）后，若叙事上**上一条已是固化表单卡**、本条为**短文案 + 详情/结果卡**的**同一助手回复**，须**合并为单条 `Message`**（单一 marker 负载，如 `<<<RENDER_TASK_EDIT_FEEDBACK_DETAIL>>>`），在**同一 `TaskChatMessageRow` 内**纵向排列：**短反馈气泡**与**详情/结果卡**之间 **`gap-[var(--space-150)]`（6px）**；**只展示一个左侧助手头像**，**禁止**拆成两条助手消息导致双头像。此类「紧跟表单、语义连续」的反馈**不得**写入 **`operationSource`**（避免 `OperationSourceBar`）；由详情卡内再推入的子卡仍按上文 **`sourceMessageId` 指向本条合并消息的 `Message.id`**。
   - **Dynamic Avatar Logic**: Maintain the smart avatar hiding logic (grouping messages within 10s without timestamps, but forcing avatar display when `isAfterPrompt` is true).

3. **Task Application · CUI Session Rules**（任务应用与主对话流）:
   - **主流程在当前会话流中展开**：任务列表、新建任务完整表单等，以 **`GenericCard` + 对话消息块**（如 `<<<RENDER_TASK_TABLE>>>`、`<<<RENDER_CREATE_TASK_FORM>>>`）在**当前组织上下文**的对话中追加；**不得**用切换侧栏会话或新开对话来承载主流程。
   - **蒙层弹窗例外**：仅 **沟通**、**选择人员**、**需二次确认** 等使用带蒙层 `Dialog` / `AlertDialog`。
   - **行动建议按钮常驻**：与 **Chat Component Priority · 行动建议点击后不消失** 一致：各应用欢迎区（如任务模式下「打开任务列表」「新建任务」「切换组织」等 **`ChatPromptButton`**）在**用户点击后仍保留显示**，不因已产生对话或后续卡片而隐藏；便于重复触发与演示。
   - **列表数据与入口语义一致**：底部二级入口（任务总览 / 我的 等）用于「按条件查看任务列表」时，表格行数据应使用 **`getTaskRowsForFilter` 类逻辑**按入口含义生成**高保真演示数据**（字段、人名、逾期/完成态与筛选标签一致），提升 Demo 可信度。
   - **筛选任务 / 设置**：**不设二级菜单**；底栏主按钮单次点击即推送会话卡片（`<<<RENDER_TASK_FILTER_CARD>>>` / `<<<RENDER_TASK_SETTINGS_CARD>>>`），使用 `SecondaryAppButton` 的 `directClick` 模式。
   - **任务详情（会话内高保真卡片）**：
     - **入口**：任务管理表格 **整行可点击**（`cursor-pointer` + 键盘 Enter/Space），追加 `<<<RENDER_TASK_DETAIL_CARD>>>:{"id":"..."}`，由 `getTaskDetailOrFallback` 组装详情。
     - **信息架构（自上而下）**：任务编号与协作视角标签 → 标题行 → 状态 / 优先级 / 风险关注 → 元信息区（执行人、负责人、截止、类型·阶段）→ **实际进度**与预计工时、创建/更新时间 → **任务描述** → **子任务**清单 → **动态**时间线（演示）。
     - **跟进**：卡片底部 **`ChatPromptButton`** 快捷短语（如已跟进、延期说明、提醒负责人），点击后作为助手短消息追加，保持在卡片**外侧/下方**，符合全局卡片提示按钮规则。
     - **0417 原位置编辑（`task0417InlineEdit`）**：从 **`<<<RENDER_TASK_DETAIL_CARD>>>`** 消息点「编辑」时**不追加**独立编辑卡；在同一条消息的 JSON 中置 **`inlineEditing: true`**，渲染 **`EditTaskFormCard`**（`cardTitle="任务详情"`）替代详情体；确定后写回 **`inlineEditing: false`**、合并 **`snapshot`**（与 `applyTaskEditSnapshotToDetail` 字段一致），并置 **`justUpdated: true`**；**「（已更新）」**须出现在 **`GenericCard` 首行标题**「任务详情」右侧（`titleSuffix` / `showTitleUpdatedSuffix`），**不得**接在任务名标题后。同条 `patchMessages` 后须 **`scrollToMessageById(该条 Message.id)`** 顶对齐本条，并跳过一次按「末条是否卡片」触发的 **`scrollToBottom`**。再次进入编辑时清除 **`justUpdated`**（与 `inlineEditing` 一并由 `patchMessages` 更新）。
     - **样式**：与现有 `GenericCard`、间距与 `Button variant="chat-*"` 一致；禁止为详情单独新开路由或侧栏会话。

4. **邮箱应用 · CUI（Mail CUI）**：
   - **草稿箱 vs 读信抽屉（强制）**：**草稿箱**列表行点击须推入会话内 **`<<<MAIL_COMPOSE_ENTRY_CARD>>>`（`MailComposeCard`）** 预填编辑，**不得**打开 **`EmailReadDrawer`**。**抽屉**仅用于**查看**收件箱/发件箱/未读摘要等**已收发的邮件正文**（`openMail`）；编辑草稿始终在对话流卡片内完成。
   - **分组与间距**：与 **Chat Component Priority** 中「对话分组语义」一致：**用户消息与助手消息不同组**；助手侧同一次操作内的卡片、操作来源、行动建议、同条内的气泡/欢迎语=**同组 6px**；不同 `Message`/轮次=**组间 25px**；主容器 **`pb-[var(--space-400)]`（16px）** 与底栏留白。
   - **新消息/卡片滚动锚点**：与上文「新卡片滚动定位」一致：`MailChatLayer` 将 **`lastMessageRowRef` 挂至最后一条消息外层**，由主窗 **`scrollLatestCardRowToTop`** 顶对齐；**勿**在 `appendMail*`、底栏菜单回调等处再 **`scrollToBottom()`**。
   - **组内 6px / 组间 25px**：实现须与上文 **Chat Component Priority** 完全一致：`MailChatLayer` 根列表 **组间 `gap-[var(--space-625)]`（25px）**；单条消息包装器内 **时间线、气泡、卡片、行动建议** 等同组 **`gap-[var(--space-150)]`（6px）**，且本条内 `TimestampSeparator` 一律 **`!my-0`**。含 `BusinessMailHubCard` / `MailComposeCard` / `MailSettingsCuiCard`、普通 `ChatMessageBubble` 等分支，禁止再用 `gap-1`（4px）等与 6px 不一致的值。
   - **可收起分组（通用，卡片级）**：凡卡片内列出**多个分组**且各分组支持**独立收起/展开**的，**仅第一个分组默认展开，其余分组默认收起**（用户可点击分组标题切换）。适用于「签名设置」等按邮箱分块列表。实现约定：`isOpen = expanded[id] ?? (index === 0)` 在**全卡分组序列**上仅首项 `index === 0` 为 `true`；后续分组初始均为 `false`。
   - **分账号折叠默认态（邮箱列表）**：
     - **「收到新邮件」`ReceivedNewMailCard`**：同一卡片内同时含「我的邮箱」「业务邮箱」两段时，按 **全卡顺序**（先个人有未读账号，再业务有未读账号）**仅第一个邮箱**默认展开；若个人侧已有展开块，则 **业务邮箱段内首个邮箱默认收起**（用户可点开）。初始态 `expanded` 按 `[...personal, ...business]` 仅 `globalIndex === 0` 为 `true`。
     - **聚合列表 `MailMailboxListCard`**（收件箱/发件箱等）：**每个一级分组（「我的邮箱」「业务邮箱」）各自**仅默认展开该段内排序第一的邮箱区块，其余收起。示例：个人侧仅 `zhangsan.work@…`、业务侧仅 `product@…` 等各自首块展开。
   - **实现约定（列表类）**：`isOpen = expanded[id] ?? defaultOpen`（`defaultOpen` 依卡片取全卡首项或段内首项）；切换时用 `const cur = prev[id] ?? defaultOpen; return { ...prev, [id]: !cur }`。
   - **行动建议**：`ChatPromptButton` 置于卡片外下方，与卡片同属一组对话块，但不包在 `GenericCard` 内（见上文 Card Prompts）；点击后**不消失**（见上文 **行动建议点击后不消失**）。
   - **卡片表单底栏**：与 **Chat Component Priority · 卡片表单底栏** 一致；**写邮件**（`MailComposeCard` / `MailComposeCardV2`）为**特例**，不适用该条的 variant 与主按钮伸展约定。
   - **签名编辑等子卡**：与 **Chat Component Priority** 中「从卡片再推送的助手卡片须带头像」「操作来源与 `sourceMessageId`」一致；推卡见 `MailChatLayer`（`MAIL_SIGNATURE_EDITOR_MARKER`）。

---

## 0421 · VV 壳层与主 AI 应用分类（个人 / 工作台 / 教育）

> 用于 `0421-新用户-受邀加入组织`、`0421-新用户-受邀加入教育空间-学生` 等**无组织壳**演示；实现上对齐 `src/constants/invite0421Workbench.ts`（`INVITE0421_PERSONAL_APP_IDS`、`INVITE0421_WORKBENCH_APP_IDS`）、`VVAppShell` 底栏与「更多」分组、`MainAIChatWindow` 主底栏 pill 与门闩逻辑。

### 1. 个人应用（不依赖组织）

- **行为**：无组织时仍展示；**不**收入「未添加」。
- **范围**：日历、待办、微盘、邮箱。
- **壳层映射**：左侧底栏在无组织演示下展示 `教育` + `日历` + `待办` + `docs`（**文案作「微盘」**，与 Figma「文档」图标占位）；**电话**仅在「更多 → 已添加」中占位；**邮箱**由主 AI 底栏 pill 承载（邮箱方案页另插入邮箱 pill）。
- **应用内顶栏**：一般可切「全部 / 组织 / 个人」等作用域（与数据域一致）。

### 2. 工作台应用（依赖组织）

- **行为**：无组织时**不**出现在左侧底栏与主 AI 主底栏；收入「更多 → **未添加**」并带绿色加号角标；点击后主 AI 插入无组织门闩（创建/加入组织）。
- **范围**：任务、财务、薪酬、公司、我的、组织、员工、招聘（与 `INVITE0421_WORKBENCH_APP_IDS` 一致）。
- **应用内顶栏**：进入后**必须**选中一个组织（不可长期停留在未选组织的空态）。

### 3. 教育应用（特殊）

- **行为**：不依赖组织；无组织时壳上仍保留教育入口。
- **教育应用内**：若当前**没有任何教育空间**，底部**不**展示业务快捷 pill（**仅「返回」与「全部应用 / 应用切换」**）；有空间时，**家庭空间**展示家庭快捷入口集（`FAMILY_EDUCATION_APPS`），**机构空间**展示机构快捷入口集（`EDUCATION_APPS`）。无空间且需「前三个一级入口」演示时使用 `educationNoSpaceDockTeaser`（见 0421-有组织无教育空间-2）。

---

## Variable Mapping Quick Reference

### Color Mapping

| Use Case | Semantic Variable | Foundation Variable | Tailwind Class |
|----------|------------------|---------------------|----------------|
| Brand primary | `--color-primary` | `--blue-6` | `bg-primary` |
| Primary hover | `--color-primary-hover` | `--blue-7` | `hover:bg-primary-hover` |
| White text | `--color-white` | `--white` | `text-[var(--color-white)]` |
| Black text | `--color-black` | `--black` | `text-[var(--color-black)]` |
| Primary text | `--color-text` | `--gray-2` | `text-text` |
| Secondary text | `--color-text-secondary` | `--gray-3` | `text-text-secondary` |
| Error | `--color-error` | `--red-6` | `bg-error` |
| Success | `--color-success` | `--green-6` | `bg-success` |
| Warning | `--color-warning` | `--orange-6` | `bg-warning` |
| Semi-transparent blue | - | `--blue-alpha-11` | `bg-[var(--blue-alpha-11)]` |
| Modal overlay | `--color-overlay` | `--black-alpha-4` | `bg-overlay` |

### Spacing Mapping

| Size | Variable | Value | Common Use |
|------|----------|-------|------------|
| XXS | `--space-100` | 4px | Icon margins, very tight spacing |
| **组内对话** | **`--space-150`** | **6px** | **同组纵向：欢迎气泡 / 卡片 / 行动建议（`gap-[var(--space-150)]`）** |
| **相邻消息块（邮箱等）** | **`--space-625`** | **25px** | **不同消息/卡片组之间纵向分段（`MailChatLayer` 根列表 `gap-[var(--space-625)]`）** |
| **会话列表底部** | **`--space-400`** | **16px** | **对话滚动区与底栏之间 `pb-[var(--space-400)]`，与末条内容缓冲** |
| S | `--space-200` | 8px | Element gaps, small padding |
| M | `--space-400` | 16px | Standard padding |
| L | `--space-600` | 24px | Card padding, sections |
| XL | `--space-800` | 32px | Large sections |

### Radius Mapping

| Size | Variable | Value | Common Use |
|------|----------|-------|------------|
| SM | `--radius-sm` / `--radius-100` | 4px | Small elements |
| MD | `--radius-md` / `--radius-150` | 6px | Default rounded |
| LG | `--radius-lg` / `--radius-200` | 8px | Cards, containers |
| Button | `--radius-button` | 20px | Buttons |
| Input | `--radius-input` | 22px | Input fields |

---

## Summary

### Decision Tree

1. **Is it a theme-related UI component?**
   - YES → Use semantic variables from `@theme` (Priority 1)
   - NO → Continue to step 2

2. **Do you need transparency or special effect?**
   - YES → Use alpha variables from `:root` (Priority 2)
   - NO → Continue to step 3

3. **Do you need precise control from 12-step scale?**
   - YES → Use specific step from `:root` color scale (Priority 2)
   - NO → Go back to step 1, you probably need semantic variables

4. **Never hardcode values** - There's always a variable for your use case

### Key Reminders

- ✅ Semantic variables first → Foundation variables second → Never hardcode
- ✅ Use generated Tailwind classes when possible
- ✅ Use arbitrary values with type annotations when needed: `text-[length:var(--font-size-md)]`
- ✅ For hyphenated color names, use: `text-[var(--color-white)]`
- ✅ Explicitly set base text color in components to avoid inheritance issues
- ✅ Same use case across components = same variable pattern
- ✅ Dark mode support is automatic if you use variables correctly

---

**Last Updated**: Based on `/styles/globals.css` current state  
**Maintained By**: Design System Team  
**Questions?**: Refer to this document first, then consult the team
