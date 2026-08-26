import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary via-primary-light to-indigo-400 px-5 py-3 text-foreground shadow-blue hover:-translate-y-0.5 hover:brightness-105 hover:shadow-blue",
        outline:
          "border border-white/15 bg-white/5 px-5 py-3 text-foreground backdrop-blur hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:shadow-blue",
        ghost: "px-4 py-2 text-muted hover:text-primary-light"
      },
      size: {
        default: "h-11",
        sm: "h-9 rounded-xl px-4",
        lg: "h-12 rounded-2xl px-6 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
