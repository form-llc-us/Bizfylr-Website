import type { AnchorHTMLAttributes } from "react";
import Link from "next/link";

import { Button, type ButtonProps } from "@/components/ui/button";

type GradientButtonProps = ButtonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    href?: string;
  };

export function GradientButton({ href, children, ...props }: GradientButtonProps) {
  if (href) {
    return (
      <Button asChild {...props}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return <Button {...props}>{children}</Button>;
}
