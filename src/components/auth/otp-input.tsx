"use client";

import { useRef, useCallback, type KeyboardEvent, type ClipboardEvent } from "react";
import { cn } from "@/lib/utils/cn";

type OtpInputProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
};

export function OtpInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const focusInput = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, length - 1));
    inputsRef.current[clamped]?.focus();
  }, [length]);

  const updateValue = useCallback(
    (index: number, digit: string) => {
      const chars = value.padEnd(length, " ").split("");
      chars[index] = digit;
      const newValue = chars.join("").replace(/ /g, "");
      onChange(newValue.slice(0, length));
    },
    [value, length, onChange],
  );

  const handleInput = useCallback(
    (index: number, inputValue: string) => {
      const digit = inputValue.replace(/\D/g, "").slice(-1);
      if (!digit) return;
      updateValue(index, digit);
      if (index < length - 1) {
        focusInput(index + 1);
      }
    },
    [updateValue, focusInput, length],
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (value[index]) {
          updateValue(index, "");
        } else if (index > 0) {
          updateValue(index - 1, "");
          focusInput(index - 1);
        }
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [value, updateValue, focusInput],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (pasted) {
        onChange(pasted);
        focusInput(Math.min(pasted.length, length - 1));
      }
    },
    [length, onChange, focusInput],
  );

  return (
    <div className="flex justify-center gap-2 sm:gap-3" role="group" aria-label="One-time password">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          value={value[i] ?? ""}
          disabled={disabled}
          aria-label={`Digit ${i + 1} of ${length}`}
          className={cn(
            "h-12 w-10 rounded-[var(--radius-md)] border text-center text-lg font-semibold sm:h-14 sm:w-12 sm:text-xl",
            "bg-[var(--card)] text-[var(--foreground)]",
            "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors",
            error
              ? "border-[var(--color-error)]"
              : "border-[var(--input)]",
          )}
          onInput={(e) => handleInput(i, (e.target as HTMLInputElement).value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}
