import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("rounded-md shimmer-bg", className)}
      {...props}
    />
  );
}

export { Skeleton };
