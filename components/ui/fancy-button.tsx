"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const FANCY_BUTTON_ROOT_NAME = "FancyButtonRoot"
const FANCY_BUTTON_ICON_NAME = "FancyButtonIcon"

export const fancyButtonVariants = {
  root: [
    // base
    "group relative inline-flex items-center justify-center whitespace-nowrap text-sm font-medium outline-none",
    "transition duration-200 ease-out",
    // focus
    "focus:outline-none",
    // disabled
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  icon: "relative z-10 size-5 shrink-0",
}

const variantStyles = {
  neutral: {
    root: "bg-neutral-950 text-white shadow-lg",
  },
  primary: {
    root: "bg-blue-600 text-white shadow-lg",
  },
}

const sizeStyles = {
  medium: {
    root: "h-10 gap-3 rounded-xl px-4",
    icon: "-mx-1",
  },
  large: {
    root: "h-12 gap-3 rounded-xl px-6",
    icon: "-mx-1",
  },
}

const fancyStyles = [
  // before - top highlight
  "before:pointer-events-none before:absolute before:inset-0 before:z-10 before:rounded-[inherit]",
  "before:bg-gradient-to-b before:p-px",
  "before:from-white/20 before:to-transparent",
  // before mask
  "before:[mask-clip:content-box,border-box] before:[mask-composite:exclude] before:[mask-image:linear-gradient(#fff_0_0),linear-gradient(#fff_0_0)]",
  // after - hover overlay
  "after:absolute after:inset-0 after:rounded-[inherit] after:bg-gradient-to-b after:from-white after:to-transparent",
  "after:pointer-events-none after:opacity-[.16] after:transition after:duration-200 after:ease-out",
  // hover
  "hover:after:opacity-[.24]",
]

type FancyButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean
  variant?: "neutral" | "primary"
  size?: "medium" | "large"
}

const FancyButton = React.forwardRef<HTMLButtonElement, FancyButtonProps>(
  ({ asChild, children, variant = "neutral", size = "medium", className, ...rest }, forwardedRef) => {
    const Component = asChild ? Slot : "button"

    const rootClasses = cn(
      fancyButtonVariants.root,
      variantStyles[variant].root,
      sizeStyles[size].root,
      fancyStyles,
      className,
    )

    return (
      <Component ref={forwardedRef} className={rootClasses} {...rest}>
        {children}
      </Component>
    )
  },
)
FancyButton.displayName = FANCY_BUTTON_ROOT_NAME

export { FancyButton }
