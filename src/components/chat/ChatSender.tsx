import * as React from "react"
import { Input } from "../ui/input"
import { AddIcon, AudioIcon, SendIcon } from "./ChatComponents"

interface ChatSenderProps {
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSendMessage: () => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** 主输入框 id，便于外部 focus（如规范文档演示预填） */
  inputId?: string;
}

export function ChatSender({
  inputValue,
  setInputValue,
  handleSendMessage,
  handleKeyDown,
  placeholder = "我可以帮您做什么？",
  inputId,
}: ChatSenderProps) {
  const canSend = Boolean(inputValue.trim())
  return (
    <div className="flex gap-[var(--space-300)] items-center w-full m-[0px]">
      <div className="bg-bg flex-1 flex items-center gap-[var(--space-150)] px-[var(--space-300)] py-[var(--space-250)] rounded-cui-input shadow-xs border border-border">
        <AddIcon />
        <Input 
          id={inputId}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="border-none shadow-none focus-visible:ring-0 h-auto p-0 text-[length:var(--font-size-base)] placeholder:text-text-muted rounded-none bg-transparent"
        />
        <AudioIcon />
      </div>
      <button 
        type="button"
        disabled={!canSend}
        onClick={handleSendMessage}
        aria-disabled={!canSend}
        title={canSend ? "发送" : "请输入内容"}
        className={`border-none bg-transparent p-0 flex-shrink-0 transition-opacity focus:outline-none ${
          canSend ? "cursor-pointer hover:opacity-80" : "cursor-not-allowed opacity-40"
        }`}
      >
        <SendIcon />
      </button>
    </div>
  )
}
