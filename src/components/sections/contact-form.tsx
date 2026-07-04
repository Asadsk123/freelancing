"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { FormSuccess } from "@/components/shared/form-success";
import { FormError } from "@/components/shared/form-error";
import { Spinner } from "@/components/ui/spinner";
import { Send } from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage("Please fill in all required fields.");
      setFormState("error");
      return;
    }

    // API endpoint will be connected in a future module
    setFormState("success");
  }

  if (formState === "success") {
    return (
      <Card>
        <CardContent className="pt-6">
          <FormSuccess
            title="Message received"
            description="Thank you for reaching out. We'll respond within 24 business hours."
          >
            <Button variant="link" onClick={() => setFormState("idle")}>
              Send another message
            </Button>
          </FormSuccess>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {formState === "error" && <FormError message={errorMessage} />}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">
                Name <span className="text-[var(--color-error)]">*</span>
              </Label>
              <Input
                id="contact-name"
                name="name"
                placeholder="How should we address you?"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">
                Email <span className="text-[var(--color-error)]">*</span>
              </Label>
              <Input
                id="contact-email"
                name="email"
                type="email"
                placeholder="name@company.com"
                required
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Phone</Label>
              <Input
                id="contact-phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-company">Company</Label>
              <Input
                id="contact-company"
                name="company"
                placeholder="Your company name"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-service">Service of interest</Label>
            <Select id="contact-service" name="service" defaultValue="">
              <option value="" disabled>Select a service</option>
              <option value="web-development">Web Development</option>
              <option value="graphic-design">Graphic Design</option>
              <option value="digital-marketing">Digital Marketing</option>
              <option value="seo">SEO Optimization</option>
              <option value="mobile-apps">Mobile Apps</option>
              <option value="maintenance">Maintenance & Support</option>
              <option value="other">Other</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-budget">Budget range</Label>
            <Select id="contact-budget" name="budget" defaultValue="">
              <option value="" disabled>Select a range</option>
              <option value="under-5k">Under $5,000</option>
              <option value="5k-15k">$5,000 – $15,000</option>
              <option value="15k-50k">$15,000 – $50,000</option>
              <option value="50k-plus">$50,000+</option>
              <option value="not-sure">Not sure yet</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-message">
              Message <span className="text-[var(--color-error)]">*</span>
            </Label>
            <Textarea
              id="contact-message"
              name="message"
              placeholder="Tell us about your project, goals, and timeline..."
              className="min-h-[120px]"
              required
            />
          </div>

          <Button type="submit" disabled={formState === "submitting"} className="w-full sm:w-auto">
            {formState === "submitting" ? (
              <>
                <Spinner className="mr-2 h-4 w-4" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
