import * as React from "react";
import {
  cva,
  type VariantProps,
} from "class-variance-authority";
import { cn } from "./utils";
import { Slot } from "@radix-ui/react-slot";

const svgPaths = {
  p15efae00:
    "M11.75 8C11.75 8.69036 12.3096 9.25 13 9.25C13.6904 9.25 14.25 8.69036 14.25 8H13H11.75ZM11.9334 12.8573C12.4697 12.4225 12.552 11.6354 12.1173 11.0991C11.6826 10.5628 10.8954 10.4805 10.3591 10.9152L11.1463 11.8862L11.9334 12.8573ZM13 8H14.25C14.25 4.54822 11.4518 1.75 8 1.75V3V4.25C10.0711 4.25 11.75 5.92893 11.75 8H13ZM8 3V1.75C4.54822 1.75 1.75 4.54822 1.75 8H3H4.25C4.25 5.92893 5.92893 4.25 8 4.25V3ZM3 8H1.75C1.75 11.4518 4.54822 14.25 8 14.25V13V11.75C5.92893 11.75 4.25 10.0711 4.25 8H3ZM8 13V14.25C9.48913 14.25 10.8596 13.7276 11.9334 12.8573L11.1463 11.8862L10.3591 10.9152C9.71441 11.4378 8.89536 11.75 8 11.75V13Z",
};

const ButtonSpinner = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative shrink-0 size-[var(--space-400)]",
        className,
      )}
    >
      <svg
        className="block size-full animate-spin"
        fill="none"
        viewBox="0 0 16 16"
      >
        <rect
          fill="currentColor"
          fillOpacity="0.01"
          height="16"
          width="16"
        />
        <path
          d={svgPaths.p15efae00}
          className="fill-current opacity-100"
        />
      </svg>
    </div>
  );
};

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-normal transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 gap-[var(--space-100)] rounded-full",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active disabled:bg-primary-disabled border border-transparent",
        secondary:
          "bg-bg text-primary border border-primary hover:bg-[var(--blue-alpha-11)] active:bg-[var(--blue-alpha-10)] active:text-primary-active active:border-primary-active disabled:text-primary-disabled disabled:border-primary-disabled",
        outline:
          "bg-bg text-text border border-border hover:text-primary hover:border-primary active:bg-[var(--blue-alpha-11)] active:text-primary-active active:border-primary-active disabled:text-disabled disabled:border-border-divider",
        ghost:
          "bg-[var(--black-alpha-11)] text-text hover:bg-[var(--black-alpha-9)] active:bg-[var(--black-alpha-8)] disabled:text-disabled",
        dashed:
          "bg-bg text-text border border-dashed border-border hover:text-primary hover:border-primary active:bg-[var(--blue-alpha-11)] active:text-primary-active active:border-primary-active disabled:text-disabled disabled:border-border-divider",
        dashedBlue:
          "bg-bg text-primary border border-dashed border-primary hover:bg-[var(--blue-alpha-11)] active:bg-[var(--blue-alpha-10)] active:text-primary-active active:border-primary-active disabled:text-primary-disabled disabled:border-primary-disabled",
        text: "bg-transparent text-text hover:bg-[var(--black-alpha-11)] active:bg-[var(--black-alpha-8)] disabled:text-disabled",
        default:
          "bg-primary text-primary-foreground hover:bg-primary-hover",
        destructive:
          "bg-error text-error-foreground hover:bg-error-hover active:bg-error-active",
        link: "text-primary underline-offset-4 hover:underline",
        "chat-submit":
          "!h-auto !rounded-full !px-[var(--space-400)] !py-[var(--space-250)] border border-[var(--blue-alpha-8)] bg-[var(--blue-alpha-11)] text-primary hover:text-primary hover:border-primary-hover hover:bg-[var(--blue-alpha-11)] active:bg-[var(--blue-alpha-10)] transition-colors shadow-none font-normal",
        "chat-reset":
          "!h-auto !rounded-full !px-[var(--space-400)] !py-[var(--space-250)] border border-border bg-[var(--black-alpha-11)] text-text hover:text-primary hover:border-primary-hover hover:bg-[var(--blue-alpha-11)] active:bg-[var(--blue-alpha-10)] transition-colors shadow-none font-normal",
      },
      size: {
        xl: "h-[var(--space-1000)] px-[var(--space-400)] text-[length:var(--font-size-md)]",
        lg: "h-[var(--space-900)] px-[var(--space-350)] text-[length:var(--font-size-base)]",
        default:
          "h-[var(--space-800)] px-[var(--space-350)] text-[length:var(--font-size-base)]",
        sm: "h-[var(--space-700)] px-[var(--space-300)] text-[length:var(--font-size-xs)]",
        xs: "h-[var(--space-600)] px-[var(--space-250)] text-[length:var(--font-size-xs)]",
        mini: "h-[var(--space-500)] px-[var(--space-200)] text-[length:var(--font-size-xs)]",

        "icon-xl":
          "h-[var(--space-1000)] w-[var(--space-1000)] p-0",
        "icon-lg":
          "h-[var(--space-900)] w-[var(--space-900)] p-0",
        icon: "h-[var(--space-800)] w-[var(--space-800)] p-0",
        "icon-sm":
          "h-[var(--space-700)] w-[var(--space-700)] p-0",
        "icon-xs":
          "h-[var(--space-600)] w-[var(--space-600)] p-0",
        "icon-mini":
          "h-[var(--space-500)] w-[var(--space-500)] p-0",

        circle:
          "h-[var(--space-800)] w-[var(--space-800)] p-0 rounded-[var(--radius-full)]",
      },
      rounded: {
        true: "!rounded-[var(--radius-200)]",
        false: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      rounded: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      rounded,
      loading,
      asChild = false,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, rounded, className }),
        )}
        ref={ref}
        disabled={props.disabled || loading}
        {...props}
      >
        {loading && <ButtonSpinner />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };