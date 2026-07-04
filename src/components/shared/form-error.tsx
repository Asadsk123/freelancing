import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type FormErrorProps = {
  message: string;
  className?: string;
};

export function FormError({ message, className }: FormErrorProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-[var(--radius-md)]",
        "bg-red-50 px-3 py-2 text-sm text-red-700",
        className,
      )}
      role="alert"
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
