import type { ModelFamily } from "../chat/ChatNavBar";

/**
 * 模型家族数据
 * 按家族分组，每个家族包含多个版本
 */
export const AVAILABLE_MODEL_FAMILIES: ModelFamily[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    versions: [
      {
        id: 'gpt-4-turbo',
        name: 'GPT-4 Turbo',
        description: '最新、最强大的模型，擅长复杂推理和创造性任务',
        isRecommended: true
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        description: '高质量输出，适合需要深度理解的复杂任务'
      },
      {
        id: 'gpt-3.5-turbo',
        name: 'GPT-3.5 Turbo',
        description: '快速响应，适合日常对话和简单任务'
      }
    ]
  },
  {
    id: 'claude',
    name: 'Claude',
    versions: [
      {
        id: 'claude-3-opus',
        name: 'Claude 3 Opus',
        description: 'Anthropic最强大的模型，擅长复杂任务和长文本处理',
        isRecommended: true
      },
      {
        id: 'claude-3-sonnet',
        name: 'Claude 3 Sonnet',
        description: '平衡性能和速度，适合大多数工作场景'
      },
      {
        id: 'claude-3-haiku',
        name: 'Claude 3 Haiku',
        description: '最快速的模型，适合实时交互和快速响应'
      }
    ]
  },
  {
    id: 'gemini',
    name: 'Gemini',
    versions: [
      {
        id: 'gemini-ultra',
        name: 'Gemini Ultra',
        description: 'Google最先进的多模态模型，处理文字、图像和音频',
        isRecommended: true
      },
      {
        id: 'gemini-pro',
        name: 'Gemini Pro',
        description: '高性能的通用模型，适合各类任务'
      }
    ]
  }
];
