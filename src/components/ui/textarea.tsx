import * as React from "react"
import { cn } from "./utils"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean | string
  showCount?: boolean
  maxLength?: number
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, showCount, maxLength, value, onChange, ...props }, ref) => {
    
    const count = value ? String(value).length : 0
    const hasError = !!error

    return (
      <div className="w-full relative">
        <div className={cn(
          "flex flex-col w-full rounded-md border border-border bg-input-background overflow-hidden transition-all",
          "focus-within:ring-[3px] focus-within:ring-ring/20 focus-within:border-ring",
          hasError && "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
          props.disabled && "bg-bg-tertiary opacity-50 cursor-not-allowed"
        )}>
          <textarea
            className={cn(
              "flex min-h-[60px] w-full bg-transparent px-[12px] py-[8px] text-base placeholder:text-input-placeholder focus:outline-none resize-none disabled:cursor-not-allowed",
              className
            )}
            ref={ref}
            maxLength={maxLength}
            value={value}
            onChange={onChange}
            {...props}
          />
          {showCount && (
             <div className="px-[12px] pb-[6px] text-right text-[12px] text-input-placeholder font-[Avenir]">
                {count} / {maxLength}
             </div>
          )}
        </div>
        {typeof error === "string" && (
          <p className="mt-1 text-[12px] text-destructive">{error}</p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }