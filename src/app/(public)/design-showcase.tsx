"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Toaster, toast } from "@/components/ui/toast";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { TrackingId } from "@/components/shared/tracking-id";
import { FormSuccess } from "@/components/shared/form-success";
import { FormError } from "@/components/shared/form-error";
import { FileIcon } from "@/components/shared/file-icon";
import { Inbox } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-4 text-lg font-semibold text-[var(--foreground)]">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function DesignSystemShowcase() {
  return (
    <>
      <Toaster />

      <div className="mb-6 flex justify-end">
        <ThemeToggle />
      </div>

      <Section title="Buttons">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button disabled>Disabled</Button>
          <Button>
            <Spinner className="h-4 w-4" /> Loading
          </Button>
        </div>
      </Section>

      <Separator className="my-8" />

      <Section title="Form Controls">
        <div className="grid max-w-md gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="How should we address you?" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="service">Service</Label>
            <Select id="service" defaultValue="">
              <option value="" disabled>Select a service</option>
              <option value="web">Web Development</option>
              <option value="design">Graphic Design</option>
              <option value="seo">SEO</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" placeholder="Tell us about your project..." />
          </div>
          <div className="flex items-center gap-2">
            <Switch id="notify" />
            <Label htmlFor="notify">Email notifications</Label>
          </div>
        </div>
      </Section>

      <Separator className="my-8" />

      <Section title="Cards">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Brand Identity Design</CardTitle>
              <CardDescription>
                <TrackingId id="RA-2026-000034" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={60} />
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">3 of 5 milestones</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">View Project</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>E-commerce Website</CardTitle>
              <CardDescription>
                <TrackingId id="RA-2026-000035" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={20} />
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">1 of 5 milestones</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">View Project</Button>
            </CardFooter>
          </Card>
        </div>
      </Section>

      <Separator className="my-8" />

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="success">Completed</Badge>
          <Badge variant="warning">In Progress</Badge>
          <Badge variant="error">Overdue</Badge>
          <Badge variant="outline">Draft</Badge>
        </div>
      </Section>

      <Separator className="my-8" />

      <Section title="Avatars & File Icons">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>RA</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-center gap-3">
          <FileIcon mimeType="image/png" />
          <FileIcon mimeType="application/pdf" />
          <FileIcon mimeType="video/mp4" />
          <FileIcon mimeType="application/zip" />
          <FileIcon />
        </div>
      </Section>

      <Separator className="my-8" />

      <Section title="Tabs">
        <Tabs defaultValue="timeline">
          <TabsList>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="conversation">Conversation</TabsTrigger>
            <TabsTrigger value="scope">Scope</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--muted-foreground)]">Project timeline will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="files">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--muted-foreground)]">Project files will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="conversation">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--muted-foreground)]">Conversation thread will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="scope">
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-[var(--muted-foreground)]">Scope document will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Section>

      <Separator className="my-8" />

      <Section title="Skeleton Loading">
        <div className="max-w-md space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-32 w-full" />
        </div>
      </Section>

      <Separator className="my-8" />

      <Section title="Page Header">
        <PageHeader title="Projects" description="Manage all client projects">
          <Button size="sm">New Project</Button>
        </PageHeader>
      </Section>

      <Separator className="my-8" />

      <Section title="Empty State">
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={Inbox}
              title="No inquiries yet"
              description="New contact form and quote submissions will appear here."
            />
          </CardContent>
        </Card>
      </Section>

      <Separator className="my-8" />

      <Section title="Form Feedback">
        <FormError message="Please enter your email address, like name@company.com" />
        <FormSuccess
          title="Message received"
          description="We'll respond within 24 business hours to your email."
        >
          <Button variant="link">Submit another inquiry</Button>
        </FormSuccess>
      </Section>

      <Separator className="my-8" />

      <Section title="Toast Notifications">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => toast.success("File uploaded successfully")}
          >
            Success Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error("Upload failed — please try again")}
          >
            Error Toast
          </Button>
          <Button
            variant="outline"
            onClick={() => toast("New message from the team")}
          >
            Info Toast
          </Button>
        </div>
      </Section>
    </>
  );
}
