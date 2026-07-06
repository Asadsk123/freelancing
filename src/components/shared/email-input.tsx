"use client";

import { forwardRef, useRef, useCallback, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

/**
 * Common email domains, matched by prefix against whatever the user has typed
 * after the "@". First match wins. Extend this list freely — the feature stays
 * lightweight (pure string work, no network, no permissions).
 */
const COMMON_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "icloud.com",
  "me.com",
  "proton.me",
  "protonmail.com",
  "aol.com",
  "gmx.com",
  "mail.com",
  "zoho.com",
  "yandex.com",
];

/** Returns the full suggested email, or null if there is nothing to suggest. */
function suggestEmail(value: string): string | null {
  const at = value.indexOf("@");
  if (at === -1) return null;
  // Only one "@" and something typed after it.
  if (value.indexOf("@", at + 1) !== -1) return null;
  const local = value.slice(0, at);
  const domainPart = value.slice(at + 1).toLowerCase();
  if (!local || domainPart.length < 1) return null;

  const match = COMMON_DOMAINS.find(
    (domain) => domain.startsWith(domainPart) && domain !== domainPart,
  );
  if (!match) return null;
  return `${local}@${match}`;
}

type EmailInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  required?: boolean;
  "aria-describedby"?: string;
  className?: string;
};

/**
 * Email field with inline "ghost" autocomplete for common domains.
 * The suggested completion renders in a muted color after the caret; the user
 * accepts it with Tab, Right Arrow (caret at end), or a click. It never
 * overwrites typed text and never triggers a network request.
 */
export const EmailInput = forwardRef<HTMLInputElement, EmailInputProps>(
  function EmailInput(
    { id, name, value, onChange, placeholder, disabled, autoFocus, required, className, ...rest },
    forwardedRef,
  ) {
    const innerRef = useRef<HTMLInputElement | null>(null);
    const suggestion = suggestEmail(value);
    const completion = suggestion ? suggestion.slice(value.length) : "";

    const setRefs = useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node;
        if (typeof forwardedRef === "function") forwardedRef(node);
        else if (forwardedRef) forwardedRef.current = node;
      },
      [forwardedRef],
    );

    const accept = useCallback(() => {
      if (suggestion) {
        onChange(suggestion);
        // Keep focus and place the caret at the end.
        requestAnimationFrame(() => {
          const el = innerRef.current;
          if (el) {
            el.focus();
            const end = el.value.length;
            el.setSelectionRange(end, end);
          }
        });
      }
    }, [suggestion, onChange]);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (!completion) return;
        const el = e.currentTarget;
        const caretAtEnd = el.selectionStart === value.length && el.selectionEnd === value.length;
        if (e.key === "Tab" || (e.key === "ArrowRight" && caretAtEnd)) {
          e.preventDefault();
          accept();
        }
      },
      [completion, value.length, accept],
    );

    return (
      <div className={cn("relative", className)}>
        {/* Ghost layer: invisible copy of the typed text reserves the exact
            width so the muted completion aligns right after the caret. */}
        {completion && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center overflow-hidden px-3 text-sm"
          >
            <span className="invisible whitespace-pre">{value}</span>
            <button
              type="button"
              tabIndex={-1}
              onClick={accept}
              className="pointer-events-auto whitespace-pre text-[var(--muted-foreground)]/70"
              aria-label={`Accept suggestion ${suggestion}`}
            >
              {completion}
            </button>
          </div>
        )}
        <Input
          ref={setRefs}
          id={id}
          name={name}
          // Use type="text" (with an email input mode) so caret APIs work and
          // Right-Arrow accept can detect the caret being at the end. Email
          // validity is enforced by Zod on submit.
          type="text"
          inputMode="email"
          autoComplete="email"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          required={required}
          className="bg-transparent"
          aria-describedby={rest["aria-describedby"]}
        />
      </div>
    );
  },
);
