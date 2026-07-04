import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  OTP_EXPIRY_MINUTES: z.coerce.number().int().positive().default(10),
  SESSION_DURATION_DAYS: z.coerce.number().int().positive().default(30),

  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_NAME: z.string().default("royal-asad"),
  R2_PUBLIC_URL: z.string().url().optional(),

  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM_DEFAULT: z.string().email().default("hello@royalasad.com"),
  EMAIL_FROM_SUPPORT: z.string().email().default("support@royalasad.com"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(60000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function validateEnv<T>(schema: z.ZodSchema<T>, data: Record<string, unknown>, label: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    console.error(`Invalid ${label} environment variables:`, errors);
    throw new Error(`Invalid ${label} environment variables`);
  }
  return result.data;
}

let _serverEnv: ServerEnv | undefined;
let _clientEnv: ClientEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (_serverEnv) return _serverEnv;
  _serverEnv = validateEnv(serverSchema, process.env, "server");
  return _serverEnv;
}

export function getClientEnv(): ClientEnv {
  if (_clientEnv) return _clientEnv;
  _clientEnv = validateEnv(clientSchema, {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  }, "client");
  return _clientEnv;
}
