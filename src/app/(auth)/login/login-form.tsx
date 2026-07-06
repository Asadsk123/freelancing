"use client";

import { useState, useEffect, useRef, useCallback, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EmailInput } from "@/components/shared/email-input";
import { FormError } from "@/components/shared/form-error";
import { Spinner } from "@/components/ui/spinner";
import { Mail, ShieldCheck } from "lucide-react";
import { loginSchema } from "@/lib/validations/auth";
import { requestOtp } from "@/lib/auth/actions";

type FormState = "idle" | "submitting" | "error";

const LAST_EMAIL_KEY = "ra_last_email";
const AUTO_SEND_SECONDS = 4;

function isValidEmail(value: string): boolean {
  return loginSchema.safeParse({ email: value }).success;
}

export function LoginForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [autoSendIn, setAutoSendIn] = useState<number | null>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  // Guards against ever sending more than one OTP request from this form.
  const sentRef = useRef(false);

  // Remember the previous email so returning users don't have to retype it.
  // New users focus the email field (native autofocus); returning users focus
  // the submit button so signing in is effectively one click.
  useEffect(() => {
    const stored = localStorage.getItem(LAST_EMAIL_KEY);
    if (stored) {
      setEmail(stored);
      requestAnimationFrame(() => submitButtonRef.current?.focus());
    }
  }, []);

  const sendOtp = useCallback(async () => {
    if (sentRef.current) return; // never send twice

    const result = loginSchema.safeParse({ email });
    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0];
      setErrorMessage(firstError?.[0] ?? "Please check your input.");
      setFormState("error");
      return;
    }

    sentRef.current = true;
    setAutoSendIn(null);
    setFormState("submitting");
    setErrorMessage("");

    const formData = new FormData();
    formData.set("email", result.data.email);
    const response = await requestOtp(formData);

    // A fresh code was sent, or a recent one is still valid (rate-limited):
    // either way the user should continue to the verification step.
    if (response.success || response.retryAfter) {
      localStorage.setItem(LAST_EMAIL_KEY, result.data.email);
      const params = new URLSearchParams({ email: result.data.email });
      router.push(`/login/verify?${params.toString()}`);
      return;
    }

    // Genuine failure — allow the user to try again.
    sentRef.current = false;
    setErrorMessage(response.error ?? "Something went wrong.");
    setFormState("error");
  }, [email, router]);

  // Auto-send: once the email is valid and the user has stopped typing for a
  // few seconds, send the code automatically. Any keystroke resets the timer
  // (the effect re-runs on `email` change), and a manual submit cancels it.
  useEffect(() => {
    if (sentRef.current || formState === "submitting") {
      setAutoSendIn(null);
      return;
    }
    if (!isValidEmail(email)) {
      setAutoSendIn(null);
      return;
    }

    let remaining = AUTO_SEND_SECONDS;
    setAutoSendIn(remaining);
    const interval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(interval);
        setAutoSendIn(null);
        void sendOtp();
      } else {
        setAutoSendIn(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [email, formState, sendOtp]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formState === "submitting" || sentRef.current) return; // prevent duplicates
    void sendOtp(); // cancels the auto-send timer and sends immediately
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]">
          <Mail className="h-6 w-6 text-[var(--primary)]" />
        </div>
        <CardTitle>Sign in to your account</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send you a one-time code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {formState === "error" && <FormError message={errorMessage} />}

          <div className="space-y-2">
            <Label htmlFor="login-email">Email address</Label>
            <EmailInput
              id="login-email"
              name="email"
              placeholder="name@company.com"
              value={email}
              onChange={setEmail}
              required
              autoFocus
              disabled={formState === "submitting"}
              aria-describedby={autoSendIn !== null ? "auto-send-status" : undefined}
            />
          </div>

          <Button
            ref={submitButtonRef}
            type="submit"
            className="w-full"
            disabled={formState === "submitting"}
          >
            {formState === "submitting" ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Sending code...
              </>
            ) : (
              "Continue with Email"
            )}
          </Button>

          {autoSendIn !== null && (
            <p
              id="auto-send-status"
              aria-live="polite"
              className="text-center text-xs text-[var(--muted-foreground)]"
            >
              Sending your code automatically in {autoSendIn}s — or press Continue now.
            </p>
          )}
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs text-[var(--muted-foreground)]">
          <ShieldCheck className="h-3.5 w-3.5 text-[var(--success,#16a34a)]" aria-hidden="true" />
          Secure passwordless sign-in
        </p>

        <p className="mt-4 text-center text-sm text-[var(--muted-foreground)]">
          No account needed for your first inquiry.{" "}
          <a
            href="/contact"
            className="text-[var(--primary)] hover:underline"
          >
            Contact us directly
          </a>
        </p>
      </CardContent>
    </Card>
  );
}
