import type { Metadata } from "next";
import { Suspense } from "react";
import { VerifyForm } from "./verify-form";

export const metadata: Metadata = {
  title: "Verify Code",
  description: "Enter the verification code sent to your email.",
};

export default function VerifyPage() {
  return (
    <Suspense>
      <VerifyForm />
    </Suspense>
  );
}
