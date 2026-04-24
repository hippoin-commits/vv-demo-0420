import * as React from "react"
import { cn } from "./utils"
import { Search, Eye, EyeOff, X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
  "flex w-full rounded-md border border-border bg-input-background px-[var(--space-300)] py-[var(--space-200)] text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-placeholder focus-visible:outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-bg-tertiary",
  {
    variants: {
      variant: {
        default: "",
        search: "pl-[36px]",
        password: "pr-[36px]",
      },
      status: {
        default: "",
        error: "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
      },
    },
    defaultVariants: {
      variant: "default",
      status: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "prefix">,
    VariantProps<typeof inputVariants> {
  error?: boolean | string
  addonBefore?: React.ReactNode
  addonAfter?: React.ReactNode
  prefix?: React.ReactNode
  suffix?: React.ReactNode
  allowClear?: boolean
  wrapperClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, wrapperClassName, variant, status, error, addonBefore, addonAfter, prefix, suffix, allowClear, type, placeholder = "请输入", ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    
    // Determine input type
    const inputType = variant === "password" && showPassword ? "text" : (variant === "password" ? "password" : type)

    // Handle clear
    const handleClear = (e: React.MouseEvent) => {
      e.stopPropagation()
      // This works best with controlled components. 
      // We assume the parent handles the onChange with empty string if we fire a change event.
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set
      if (nativeInputValueSetter && ref && typeof ref !== 'function' && ref.current) {
         nativeInputValueSetter.call(ref.current, "")
         const event = new Event('input', { bubbles: true })
         ref.current.dispatchEvent(event)
      } else if (props.onChange) {
         // Fallback if we can't hack the ref, just call onChange with a mock event
         // props.onChange({ target: { value: '' } } as any)
      }
    }

    const hasError = !!error
    const computedStatus = hasError ? "error" : status

    // Prefix/Suffix content
    let prefixContent = prefix
    if (variant === "search" && !prefix) {
      prefixContent = <Search className="h-4 w-4 text-[var(--color-text-tertiary)]" />
    }

    let suffixContent = suffix
    if (variant === "password" && !suffix) {
      suffixContent = (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-[var(--color-text-tertiary)] hover:text-foreground focus:outline-none"
        >
          {showPassword ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
      )
    }

    // Main Input Element
    const inputElement = (
      <div className={cn("relative flex-1", wrapperClassName)}>
        {prefixContent && (
          <div className="absolute left-[12px] top-1/2 -translate-y-1/2 pointer-events-none flex items-center justify-center">
             {prefixContent}
          </div>
        )}
        <input
          type={inputType}
          placeholder={placeholder}
          className={cn(
            inputVariants({ variant, status: computedStatus }),
            prefixContent && "pl-[36px]",
            (suffixContent || (allowClear && props.value)) && "pr-[36px]", // Add padding for suffix
            className
          )}
          ref={ref}
          {...props}
        />
        {(suffixContent || (allowClear && props.value)) && (
          <div className="absolute right-[12px] top-1/2 -translate-y-1/2 flex items-center gap-2">
            {allowClear && props.value && (
               <button
                 type="button"
                 onClick={handleClear}
                 className="text-[var(--color-text-muted)] hover:text-foreground transition-colors"
               >
                 <X className="h-4 w-4 rounded-full bg-transparent" />
               </button>
            )}
            {suffixContent}
          </div>
        )}
      </div>
    )

    if (!addonBefore && !addonAfter && !error) {
      return inputElement
    }

    return (
      <div className="w-full">
        <div className={cn("flex w-full group", hasError ? "items-stretch" : "")}>
          {addonBefore && (
            <div className={cn(
              "flex items-center justify-center border border-border bg-bg-tertiary px-[12px] text-sm text-foreground rounded-l-md border-r-0",
              hasError && "border-destructive"
            )}>
              {addonBefore}
            </div>
          )}
          
          <div className={cn(
             "flex-1",
             addonBefore && "[&_input]:rounded-l-none",
             addonAfter && "[&_input]:rounded-r-none"
          )}>
            {inputElement}
          </div>

          {addonAfter && (
            <div className={cn(
              "flex items-center justify-center border border-border bg-bg-tertiary px-[12px] text-sm text-foreground rounded-r-md border-l-0",
              hasError && "border-destructive"
            )}>
              {addonAfter}
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
Input.displayName = "Input"

export { Input }