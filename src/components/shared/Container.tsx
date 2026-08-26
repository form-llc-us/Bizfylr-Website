import { cn } from "@/lib/utils";

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export function Container({ className, ...props }: ContainerProps) {
  return <div className={cn("container relative px-4 sm:px-6 lg:px-8", className)} {...props} />;
}
