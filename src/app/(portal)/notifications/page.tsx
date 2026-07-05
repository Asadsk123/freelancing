import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { Bell, FileText, MessageSquare, CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getSession } from "@/lib/auth/session";
import { hasDatabase } from "@/db";
import { notificationRepository } from "@/lib/repositories/notification";
import { formatRelativeTime } from "@/lib/utils/formatting";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Your recent notifications.",
};

const iconMap: Record<string, LucideIcon> = {
  file: FileText,
  message: MessageSquare,
  milestone: CheckCircle,
};

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbAvailable = hasDatabase();
  const notifications = dbAvailable
    ? await notificationRepository.findByUserId(session.userId)
    : [];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="mx-auto max-w-[1280px]">
      <PageHeader
        title="Notifications"
        description={unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}.` : "You're all caught up."}
      />

      {!dbAvailable && (
        <div className="mt-4 rounded-[var(--radius-md)] border border-[var(--warning)] bg-[var(--warning)]/10 px-4 py-3">
          <p className="text-sm text-[var(--foreground)]">
            Database not connected. Set <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">DATABASE_URL</code> in <code className="rounded bg-[var(--muted)] px-1 py-0.5 text-xs">.env.local</code> to view notifications.
          </p>
        </div>
      )}

      {dbAvailable && notifications.length === 0 ? (
        <div className="mt-8">
          <Card>
            <CardContent className="py-12">
              <EmptyState
                icon={Bell}
                title="No notifications"
                description="You're all caught up. Notifications will appear here when there are updates to your projects."
              />
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {notifications.map((notification) => {
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
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {formatRelativeTime(notification.createdAt)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
