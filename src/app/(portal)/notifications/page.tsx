import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, FileText, MessageSquare, CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your recent notifications.",
};

const iconMap: Record<string, LucideIcon> = {
  file: FileText,
  message: MessageSquare,
  milestone: CheckCircle,
};

const mockNotifications = [
  {
    id: "1",
    type: "file",
    title: "New file uploaded",
    message: "Logo_v3_Final.png was uploaded to Brand Identity Design.",
    time: "2 hours ago",
    isRead: false,
    link: "/projects/1",
  },
  {
    id: "2",
    type: "milestone",
    title: "Milestone completed",
    message: "Logo Design milestone has been marked as completed.",
    time: "1 day ago",
    isRead: false,
    link: "/projects/1",
  },
  {
    id: "3",
    type: "message",
    title: "New message from the team",
    message: "We've prepared the initial brand collateral concepts for your review.",
    time: "2 days ago",
    isRead: true,
    link: "/projects/1",
  },
  {
    id: "4",
    type: "milestone",
    title: "Project scope confirmed",
    message: "E-commerce Website project scope has been confirmed.",
    time: "3 days ago",
    isRead: true,
    link: "/projects/2",
  },
];

export default function NotificationsPage() {
  const unreadCount = mockNotifications.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "You're all caught up."}
      >
        {unreadCount > 0 && (
          <Button variant="outline" size="sm">
            Mark all as read
          </Button>
        )}
      </PageHeader>

      <div className="mt-8 space-y-3">
        {mockNotifications.map((notification) => {
          const Icon = iconMap[notification.type] ?? Bell;
          return (
            <Card key={notification.id} className={notification.isRead ? "opacity-70" : ""}>
              <CardContent className="flex items-start gap-4 py-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]">
                  <Icon className="h-4 w-4 text-[var(--primary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium text-[var(--foreground)]">
                      {notification.title}
                    </p>
                    {!notification.isRead && <Badge variant="default" className="shrink-0">New</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-[var(--muted-foreground)]">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-xs text-[var(--muted-foreground)]">{notification.time}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
