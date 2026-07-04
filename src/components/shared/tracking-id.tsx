import { cn } from "@/lib/utils/cn";

type TrackingIdProps = {
  id: string;
  className?: string;
};

export function TrackingId({ id, className }: TrackingIdProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-xs text-[var(--muted-foreground)]",
        className,
      )}
    >
      {id}
    </span>
  );
}
