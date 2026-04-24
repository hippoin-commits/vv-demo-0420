import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "./utils"
import { X } from "lucide-react"

const TabsContext = React.createContext<{ variant: "line" | "card" }>({ variant: "line" })

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root> & {
    variant?: "line" | "card"
  }
>(({ className, variant = "line", ...props }, ref) => (
  <TabsContext.Provider value={{ variant }}>
    <TabsPrimitive.Root
      ref={ref}
      className={cn("flex flex-col", className)}
      {...props}
    />
  </TabsContext.Provider>
))
Tabs.displayName = TabsPrimitive.Root.displayName

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { variant } = React.useContext(TabsContext)
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        "flex items-center",
        variant === "line" ? "gap-[32px]" : "gap-0",
        className
      )}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-[length:var(--font-size-base)] transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        line: "relative py-[var(--space-150)] gap-[var(--space-100)] data-[state=active]:font-[var(--font-weight-medium)] data-[state=active]:text-text data-[state=inactive]:font-[var(--font-weight-regular)] data-[state=inactive]:text-text-secondary after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-[24px] after:bg-primary after:content-[''] data-[state=inactive]:after:hidden hover:text-primary",
        card: "relative px-[var(--space-300)] py-[var(--space-150)] border gap-[var(--space-100)] first:rounded-l-[var(--radius-md)] last:rounded-r-[var(--radius-md)] -ml-[1px] first:ml-0 data-[state=active]:bg-blue-11 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:z-30 data-[state=inactive]:bg-bg data-[state=inactive]:text-text-secondary data-[state=inactive]:border-border hover:text-primary hover:z-20",
      },
    },
    defaultVariants: {
      variant: "line",
    },
  }
)

interface TabsTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    VariantProps<typeof tabsTriggerVariants> {
  icon?: React.ReactNode
  closable?: boolean
  onClose?: (value: string) => void
}

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, children, icon, closable, onClose, value, ...props }, ref) => {
  const { variant } = React.useContext(TabsContext)

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose?.(value)
  }

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      value={value}
      className={cn(tabsTriggerVariants({ variant }), className)}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {closable && (
        <div
          role="button"
          tabIndex={0}
          className={cn(
            "ml-1 rounded-[3px] p-[1px] hover:bg-[rgba(29,33,45,0.08)] transition-colors",
            variant === "line" ? "text-[#666f86]" : "text-current"
          )}
          onClick={handleClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleClose(e as any)
            }
          }}
        >
          <X className="h-[14px] w-[14px]" />
        </div>
      )}
    </TabsPrimitive.Trigger>
  )
})
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsTriggerVariants }
