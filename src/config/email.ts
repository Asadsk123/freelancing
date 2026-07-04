export const emailConfig = {
  from: {
    default: "Royal Asad <hello@royalasad.com>",
    noreply: "Royal Asad <noreply@royalasad.com>",
  },

  throttle: {
    conversationWindowMs: 30 * 60 * 1000,
  },

  retry: {
    maxAttempts: 3,
    backoffMs: [5000, 30000, 120000],
  },
} as const;
