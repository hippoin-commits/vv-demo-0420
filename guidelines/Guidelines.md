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

All CSS variables are defined in `src/styles/globals.css`:
- **Foundation layer**: `:root` and `.dark` blocks under `@layer base`
- **Semantic layer**: `@theme { ... }` (Tailwind v4 theme tokens)

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

### Pattern 6: 教育无空间时的底栏受限提示（0421-有组织无教育空间-2）

**场景**：用户有组织、但**尚未创建教育空间**（`educationNoSpaceDockTeaser`）时，教育 AI 底栏仍展示若干一级能力入口，用于引导创建空间。

**底栏形态**：

- 仅保留 **一级 pill 按钮**（与常规底栏 pill 视觉一致：`bg-bg`、`border-border`、`rounded-full` 等），**不要**使用带 hover 展开二级菜单的控件（无 Popper / 无子菜单）。
- 具体数量与数据由场景决定（当前为机构快捷入口前 3 项）。

**交互与文案**：

1. **第一次**点击任意一个一级按钮：在**教育对话流**中插入一条 **AI 对话气泡**（`senderId` 与助手一致），正文为：`创建您的教育空间，开启教育服务`。可配合 `beginNewUserChatRound("education")` 保持与发消息一致的轮次/滚动行为。
2. **第二次及以后**点击：使用 **Sonner `toast.custom`** 展示短提示 `请先创建教育空间`，**不要用**默认 toast 图标容器（避免出现图标外一圈白色描边）；自定义行内布局：`Info` 图标（`text-primary`、无额外圆形底）+ 文案，`duration` 约 3s。
3. 用户**成功创建教育空间**后（`effectiveHasEducationSpace` 变为 `true`），应恢复常规带二级菜单的底栏，并重置「首次点击」计数逻辑。

**实现参考**：`MainAIChatWindow` 中 `educationNoSpaceDockTeaser`、`handleEducationTeaserFlatButtonClick`、`toast.custom` 分支。

**可选组件**：`TopCenterInfoNudgeBubble.tsx` 为早期中上胶囊方案占位，本场景以「对话气泡 + toast」为准。

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

### Application Frame & Consistency

1. **Secondary Page Architecture**: 
   When creating new primary applications (e.g., "Finance", "HR") accessed from the main app launcher.
   - **Menu Interactions**: Use the exact same `<SecondaryAppButton>` pattern with hover-triggered popper menus for sub-navigation.

2. **Chat Component Priority**: 
   - **Message Wrappers**: Always use `ChatMessageBubble` with correct state flags (`isMe`, `hideAvatar`, `isAfterPrompt`).
   - **Display Cards**: Use `<GenericCard>` for informational or actionable AI responses.
   - **Form Cards**: Use `<GenericFormCard>` for data collection.
   - **Card Prompts**: Whenever the AI outputs any card structure (like `<GenericCard>` or `<GenericFormCard>`), it **must** provide follow-up prompt options. These prompt buttons **must** use the `<ChatPromptButton>` component and **must be placed below/outside the card**, not inside it.
   - **Action Buttons**: Apply `variant="chat-submit"` or `variant="chat-reset"` to standard `<Button>` components strictly for actions inside forms.
   - **Dynamic Avatar Logic**: Maintain the smart avatar hiding logic (grouping messages within 10s without timestamps, but forcing avatar display when `isAfterPrompt` is true).

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
| XS | `--space-100` | 4px | Icon margins, tight spacing |
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

**Last Updated**: Based on `src/styles/globals.css` current state  
**Maintained By**: Design System Team  
**Questions?**: Refer to this document first, then consult the team
