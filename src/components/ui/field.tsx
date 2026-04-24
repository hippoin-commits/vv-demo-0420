import * as React from "react"
import { cn } from "./utils"
import { Label } from "./label"

interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string
  required?: boolean
  error?: string
  children: React.ReactNode
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, label, required, error, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col gap-[6px] w-full", className)} {...props}>
        {label && (
           <div className="flex gap-[4px] items-center relative shrink-0">
              <Label className="font-['PingFang_SC:Regular',sans-serif] leading-[20px] text-[#858b9b] text-[14px] font-normal">
                {label}
              </Label>
              {required && (
                <span className="text-[#f55656] text-[14px] leading-[22px]">*</span>
              )}
           </div>
        )}
        {children}
        {error && (
            <p className="font-['PingFang_SC:Regular',sans-serif] leading-[16px] text-[#f55656] text-[12px] mt-[4px]">
              {error}
            </p>
        )}
      </div>
    )
  }
)
Field.displayName = "Field"

export { Field }
