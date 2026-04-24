# 模型选择功能 - 使用说明

## 功能概述

已为模型选择功能增加了**分类管理**，采用二级折叠结构，让用户可以在同一模型家族（如 ChatGPT）下选择不同的版本。

## 核心特性

### 1. **模型家族分类**
- **ChatGPT 家族**: GPT-4 Turbo、GPT-4、GPT-3.5 Turbo
- **Claude 家族**: Claude 3 Opus、Sonnet、Haiku
- **Gemini 家族**: Gemini Ultra、Pro

### 2. **版本详细信息**
每个版本包含：
- **名称**: 如 "GPT-4 Turbo"
- **描述**: 说明该版本的特点和适用场景
- **擅长领域标签**: 如"复杂推理"、"代码生成"、"快速响应"等
- **推荐标签**: 标记推荐使用的版本

### 3. **智能交互**
- **默认展开**: 当前选中模型所在的家族自动展开
- **折叠/展开**: 点击家族名称可以切换展开状态
- **折叠箭头**: ChevronRight 图标指示展开状态
- **版本数量**: 显示每个家族包含的版本数量

### 4. **选中状态**
- **背景高亮**: 选中版本显示蓝色背景
- **打勾图标**: SVG 打勾图标标记当前选中
- **深度思考开关**: 每个版本独立的深度思考模式

## 使用方式

### 在 ChatNavBar 中使用

```tsx
import { ChatNavBar } from "../chat/ChatNavBar"
import { AVAILABLE_MODEL_FAMILIES } from "./modelData"

<ChatNavBar 
  showModelSelect={true}
  currentModel={currentModel}
  modelFamilies={AVAILABLE_MODEL_FAMILIES}
  onModelSelect={handleModelSwitch}
/>
```

### 自定义模型数据

编辑 `/components/main-ai/modelData.ts`:

```typescript
export const AVAILABLE_MODEL_FAMILIES: ModelFamily[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    versions: [
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: '最新、最强大的模型',
        strengths: ['复杂推理', '代码生成', '多语言翻译'],
        isRecommended: true
      },
      // 更多版本...
    ]
  },
  // 更多家族...
];
```

## 设计系统

所有样式严格遵循 `/styles/globals.css` 和 Guidelines.md 中定义的设计系统：

- **间距**: 使用 `var(--space-*)` 变量
- **颜色**: 使用语义颜色变量（`--color-text`, `--color-primary` 等）
- **圆角**: 使用 `var(--radius-*)` 变量
- **字体**: 使用 `var(--font-size-*)` 和 `var(--font-weight-*)` 变量

## 文件结构

```
/components
  /chat
    ChatNavBar.tsx          # 导航栏组件（包含模型选择器）
  /main-ai
    MainAIChatWindow.tsx    # 主聊天窗口（使用模型选择器）
    modelData.ts            # 模型家族数据定义
```

## 向后兼容

组件保留了对旧 `models` 属性的支持：
- 如果传入 `modelFamilies`，使用新的分类结构
- 如果传入 `models`，自动转换为默认家族格式
- 两者可以混用，优先使用 `modelFamilies`
