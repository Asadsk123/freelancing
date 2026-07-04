import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type FormSuccessProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function FormSuccess({ title, description, children, className }: FormSuccessProps) {
  return (
    <div className={cn("flex flex-col items-center py-8 text-center", className)}>
      <div className="mb-4 rounded-[var(--radius-full)] bg-emerald-100 p-3">
        <CheckCircle className="h-6 w-6 text-emerald-600" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm text-[var(--muted-foreground)]">{description}</p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
