import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon: Icon, title, description, children, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      {Icon && (
        <div className="mb-4 rounded-[var(--radius-full)] bg-[var(--muted)] p-3">
          <Icon className="h-6 w-6 text-[var(--muted-foreground)]" />
        </div>
      )}
      <h3 className="text-sm font-medium text-[var(--foreground)]">{title}</h3>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-[var(--muted-foreground)]">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
