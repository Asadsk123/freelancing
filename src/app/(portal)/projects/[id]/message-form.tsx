"use client";

import { useActionState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FormError } from "@/components/shared/form-error";
import { sendProjectMessage, type MessageActionState } from "./actions";

export function MessageForm({ projectId }: { projectId: string }) {
  const [state, formAction, isPending] = useActionState<MessageActionState, FormData>(
    sendProjectMessage,
    null,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      <div className="space-y-2">
        <Label htmlFor="message-content">Your message</Label>
        <Textarea
          id="message-content"
          name="content"
          rows={3}
          maxLength={5000}
          required
          placeholder="Ask a question, share feedback, or request an update..."
          disabled={isPending}
        />
      </div>
      {state && !state.success && state.error && (
        <FormError message={state.error} />
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Sending..." : "Send Message"}
        </Button>
      </div>
    </form>
  );
}
