export const emailConfig = {
  from: {
    default: "ROYAL-ASAD AI & Digital Solutions <hello@royalasad.com>",
    noreply: "ROYAL-ASAD AI & Digital Solutions <noreply@royalasad.com>",
  },

  throttle: {
    conversationWindowMs: 30 * 60 * 1000,
  },

  retry: {
    maxAttempts: 3,
    backoffMs: [5000, 30000, 120000],
  },
} as const;
