"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/shared/form-error";
import { Spinner } from "@/components/ui/spinner";
import { Mail, ShieldCheck } from "lucide-react";
import { loginSchema } from "@/lib/validations/auth";
import { requestOtp } from "@/lib/auth/actions";

type FormState = "idle" | "submitting" | "error";

const LAST_EMAIL_KEY = "ra_last_email";

export function LoginForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Remember the previous email so returning users don't have to retype it.
  // The email input carries the native `autoFocus` attribute for new users;
  // when an email is remembered we instead move focus to the submit button so
  // signing in is effectively a single click.
  useEffect(() => {
    const stored = localStorage.getItem(LAST_EMAIL_KEY);
    if (stored) {
      setEmail(stored);
      requestAnimationFrame(() => submitButtonRef.current?.focus());
    }
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formState === "submitting") return; // prevent duplicate submissions
    setFormState("submitting");
    setErrorMessage("");

    const result = loginSchema.safeParse({ email });
    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0];
      setErrorMessage(firstError?.[0] ?? "Please check your input.");
      setFormState("error");
      return;
    }

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

    setErrorMessage(response.error ?? "Something went wrong.");
    setFormState("error");
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
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              disabled={formState === "submitting"}
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
