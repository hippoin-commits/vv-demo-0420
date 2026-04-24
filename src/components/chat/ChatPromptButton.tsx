import * as React from "react"
import { cn } from "../ui/utils"

export interface ChatPromptButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function ChatPromptButton({ className, children, ...props }: ChatPromptButtonProps) {
  return (
    <button
      className={cn(
        "bg-bg/50 flex gap-[var(--space-100)] items-center px-[var(--space-300)] py-[var(--space-150)] rounded-full shrink-0",
        "border border-solid border-bg shadow-xs",
        "text-primary hover:text-primary-hover text-[length:var(--font-size-xs)] leading-[18px] whitespace-nowrap hover:bg-bg transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
