"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { Loader2 } from "lucide-react";

import { cn } from "./utils";

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  loading?: boolean;
}

function Switch({
  className,
  loading,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      disabled={disabled || loading}
      className={cn(
        "group peer inline-flex h-[24px] w-[44px] shrink-0 items-center rounded-full border border-transparent transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50",
        "bg-[var(--color-disabled)] data-[state=checked]:bg-[var(--color-primary)]",
        "disabled:data-[state=unchecked]:bg-[var(--color-bg-secondary)]", 
        "disabled:data-[state=checked]:bg-[var(--color-primary-disabled)]",
        className
      )}
      {...props}
    >
      {/* Text "关" - Visible when Unchecked (opacity-100) */}
      <span className={cn(
          "pointer-events-none absolute right-[7px] text-[12px] font-medium text-white transition-opacity font-['PingFang_SC',sans-serif]",
          "opacity-100 group-data-[state=checked]:opacity-0"
      )}>
        关
      </span>

       {/* Text "开" - Visible when Checked (opacity-100) */}
       <span className={cn(
          "pointer-events-none absolute left-[7px] text-[12px] font-medium text-white transition-opacity font-['PingFang_SC',sans-serif]",
          "opacity-0 group-data-[state=checked]:opacity-100"
      )}>
        开
      </span>

      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none flex items-center justify-center size-[18px] rounded-full bg-white shadow-sm ring-0 transition-transform",
          "data-[state=unchecked]:translate-x-[3px] data-[state=checked]:translate-x-[23px]"
        )}
      >
        {loading && (
            <Loader2 className="size-3 animate-spin text-[var(--color-primary)]" />
        )}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };