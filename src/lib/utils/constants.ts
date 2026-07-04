export const FILE_STATUS = {
  DRAFT: "draft",
  PREVIEW: "preview",
  REVISION_REQUESTED: "revision_requested",
  APPROVED: "approved",
  FINAL: "final",
} as const;

export const PROJECT_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  ON_HOLD: "on_hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export const MILESTONE_STATUS = {
  UPCOMING: "upcoming",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export const INQUIRY_STATUS = {
  NEW: "new",
  RESPONDED: "responded",
  IN_DISCUSSION: "in_discussion",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  PROJECT_CREATED: "project_created",
} as const;

export const NOTIFICATION_PREFERENCE = {
  ALL: "all",
  PORTAL_ONLY: "portal_only",
  CRITICAL_ONLY: "critical_only",
} as const;

export const USER_ROLE = {
  ADMIN: "admin",
  CLIENT: "client",
} as const;

export const BLOG_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export const OTP_EXPIRY_MINUTES = 10;
export const SESSION_DURATION_DAYS = 30;
export const ADMIN_SESSION_DURATION_HOURS = 8;
export const SIGNED_URL_EXPIRY_SECONDS = 3600;
export const MAX_OTP_REQUESTS_PER_HOUR = 5;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
} as const;
