"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/shared/form-error";
import { Spinner } from "@/components/ui/spinner";
import { Mail } from "lucide-react";
import { loginSchema } from "@/lib/validations/auth";
import { requestOtp } from "@/lib/auth/actions";

type FormState = "idle" | "submitting" | "error";

export function LoginForm() {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;

    const result = loginSchema.safeParse({ email });
    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0];
      setErrorMessage(firstError?.[0] ?? "Please check your input.");
      setFormState("error");
      return;
    }

    const response = await requestOtp(formData);
    if (!response.success) {
      setErrorMessage(response.error ?? "Something went wrong.");
      setFormState("error");
      return;
    }

    const params = new URLSearchParams({ email: result.data.email });
    router.push(`/login/verify?${params.toString()}`);
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
              placeholder="name@company.com"
              autoFocus
              required
              disabled={formState === "submitting"}
            />
          </div>

          <Button
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

        <p className="mt-6 text-center text-sm text-[var(--muted-foreground)]">
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
