"use client"

import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "./utils"
import { cva, type VariantProps } from "class-variance-authority"

const SelectContext = React.createContext<{
  allowClear?: boolean
  onClear?: () => void
  value?: string
}>({})

const Select = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Root> & {
    allowClear?: boolean
  }
>(({ children, allowClear, value, onValueChange, ...props }, ref) => {
  const handleClear = () => {
    onValueChange?.("")
  }

  return (
    <SelectContext.Provider value={{ allowClear, onClear: handleClear, value }}>
      <div ref={ref}>
        <SelectPrimitive.Root value={value} onValueChange={onValueChange} {...props}>
          {children}
        </SelectPrimitive.Root>
      </div>
    </SelectContext.Provider>
  )
})
// Select.displayName = SelectPrimitive.Root.displayName 
// SelectPrimitive.Root is not a component that has a displayName usually unless forwarded, 
// but Select is our component.
Select.displayName = "Select"

const SelectGroup = SelectPrimitive.Group

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Value>
>(({ placeholder = "请选择", ...props }, ref) => (
  <span ref={ref}>
    <SelectPrimitive.Value placeholder={placeholder} {...props} />
  </span>
))
SelectValue.displayName = SelectPrimitive.Value.displayName

const selectTriggerVariants = cva(
  "flex h-[var(--space-900)] w-full items-center justify-between rounded-md border border-border bg-bg px-[var(--space-300)] py-[var(--space-200)] text-[length:var(--font-size-base)] placeholder:text-text-tertiary focus:outline-none disabled:cursor-not-allowed disabled:bg-bg-tertiary disabled:text-text-tertiary [&>span]:line-clamp-1 transition-all group data-[placeholder]:text-text-muted",
  {
    variants: {
      status: {
        default: "focus:border-ring focus:ring-[2px] focus:ring-[var(--blue-alpha-3)]",
        error: "border-error shadow-[0px_0px_0px_2px_var(--red-alpha-3)] focus:border-error",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
)

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> &
    VariantProps<typeof selectTriggerVariants> & {
      error?: boolean
    }
>(({ className, children, status, error, ...props }, ref) => {
  const { allowClear, onClear, value } = React.useContext(SelectContext)
  const computedStatus = error ? "error" : status

  return (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(selectTriggerVariants({ status: computedStatus }), className)}
      {...props}
    >
      {children}
      <div className="flex items-center gap-2">
        {allowClear && value && (
          <div
            role="button"
            className="hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            onClick={(e) => {
              e.stopPropagation()
              onClear?.()
            }}
          >
            <X className="h-3 w-3" />
          </div>
        )}
        <SelectPrimitive.Icon asChild>
          <ChevronDown className={cn("h-4 w-4 opacity-50 transition-transform duration-200", allowClear && value && "group-hover:hidden", "group-data-[state=open]:rotate-180 group-data-[state=open]:text-[var(--color-primary)]")} />
        </SelectPrimitive.Icon>
      </div>
    </SelectPrimitive.Trigger>
  )
})
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-border bg-bg text-text shadow-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 p-[var(--space-150)]",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      )}
      position={position}
      {...props}
    >
      <SelectPrimitive.Viewport
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-[var(--space-200)] px-[var(--space-250)] text-[length:var(--font-size-base)] text-text-secondary font-[var(--font-weight-regular)] pb-0", className)}
    {...props}
  />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-input py-[var(--space-200)] px-[var(--space-250)] text-[length:var(--font-size-base)] outline-none transition-colors focus:bg-bg-tertiary focus:text-text data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[state=checked]:text-primary h-[var(--space-900)]",
      className
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <span className="absolute right-[var(--space-250)] flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-[var(--space-100)] h-[1px] bg-border-divider", className)}
    {...props}
  />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
}