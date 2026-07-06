"use client";

import * as React from "react";
import { cn } from "@/lib/utils/cn";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  /** Grow the textarea to fit its content instead of showing a scrollbar. */
  autoResize?: boolean;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, autoResize = false, onChange, value, defaultValue, ...props }, ref) => {
    const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

    const setRefs = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const resize = React.useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    React.useEffect(() => {
      resize();
    }, [resize, value, defaultValue]);

    return (
      <textarea
        ref={setRefs}
        value={value}
        defaultValue={defaultValue}
        onChange={(e) => {
          resize();
          onChange?.(e);
        }}
        className={cn(
          "flex min-h-[80px] w-full rounded-[var(--radius-md)] border border-[var(--input)]",
          "bg-[var(--card)] px-3 py-2 text-sm text-[var(--foreground)]",
          "placeholder:text-[var(--muted-foreground)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          autoResize ? "resize-none overflow-hidden" : "resize-y",
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
