"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/shared/form-error";
import { Spinner } from "@/components/ui/spinner";
import { OtpInput } from "@/components/auth/otp-input";
import { ShieldCheck } from "lucide-react";
import { otpSchema } from "@/lib/validations/auth";
import { verifyOtp, requestOtp } from "@/lib/auth/actions";

type FormState = "idle" | "verifying" | "resending" | "error";

const RESEND_COOLDOWN_SECONDS = 60;

export function VerifyForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN_SECONDS);

  useEffect(() => {
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = useCallback(async () => {
    setErrorMessage("");

    const result = otpSchema.safeParse({ code });
    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0];
      setErrorMessage(firstError?.[0] ?? "Please enter a valid code.");
      setFormState("error");
      return;
    }

    setFormState("verifying");

    const response = await verifyOtp(email, code);
    if (response.success) {
      router.push(response.redirectTo ?? "/dashboard");
      router.refresh();
    } else {
      setErrorMessage(response.error ?? "Verification failed.");
      setFormState("error");
      setCode("");
    }
  }, [code, email, router]);

  useEffect(() => {
    if (code.length === 6) {
      handleVerify();
    }
  }, [code, handleVerify]);

  async function handleResend() {
    if (formState === "resending" || cooldown > 0) return; // prevent duplicate requests
    setFormState("resending");
    setErrorMessage("");
    setCode("");

    const formData = new FormData();
    formData.set("email", email);
    const response = await requestOtp(formData);

    if (!response.success && !response.retryAfter) {
      setErrorMessage(response.error ?? "Could not resend the code. Please try again.");
      setFormState("error");
      return;
    }

    // Honour the server's rate-limit window when it is longer than our default.
    setCooldown(Math.max(RESEND_COOLDOWN_SECONDS, response.retryAfter ?? 0));
    setFormState("idle");
  }

  if (!email) return null;

  const maskedEmail = email.replace(
    /^(.{2})(.*)(@.*)$/,
    (_, start, middle, domain) =>
      start + "*".repeat(Math.min(middle.length, 5)) + domain,
  );

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--accent)]">
          <ShieldCheck className="h-6 w-6 text-[var(--primary)]" />
        </div>
        <CardTitle>Check your email</CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-[var(--foreground)]">
            {maskedEmail}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {formState === "error" && <FormError message={errorMessage} />}

        <OtpInput
          value={code}
          onChange={setCode}
          disabled={formState === "verifying" || formState === "resending"}
          error={formState === "error"}
        />

        {formState === "verifying" && (
          <div className="flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
            <Spinner className="h-4 w-4" />
            Verifying...
          </div>
        )}

        <div className="text-center">
          {cooldown > 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              Resend code in {cooldown}s
            </p>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={formState === "resending"}
            >
              {formState === "resending" ? (
                <>
                  <Spinner className="mr-2 h-3 w-3" />
                  Sending...
                </>
              ) : (
                "Resend code"
              )}
            </Button>
          )}
        </div>

        <div className="text-center">
          <Button
            variant="link"
            size="sm"
            onClick={() => router.push("/login")}
            className="text-[var(--muted-foreground)]"
          >
            Use a different email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
