import { cn } from "@/lib/utils/cn";
import { CopyButton } from "./copy-button";

type TrackingIdProps = {
  id: string;
  className?: string;
  /** Show a copy-to-clipboard button beside the ID. Defaults to true. */
  copyable?: boolean;
};

export function TrackingId({ id, className, copyable = true }: TrackingIdProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-mono text-xs text-[var(--muted-foreground)]",
        className,
      )}
    >
      {id}
      {copyable && <CopyButton value={id} label="tracking ID" />}
    </span>
  );
}
