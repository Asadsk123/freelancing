import { eq, and, gt, isNull, desc } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { otpCodes } from "@/db/schema";

export const OTP_EXPIRY_MINUTES = 10;
/** Minimum seconds between OTP requests for the same email (rate limiting). */
export const OTP_RESEND_COOLDOWN_SECONDS = 30;

function generateOtpCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const digits = array[0]! % 1000000;
  return String(digits).padStart(6, "0");
}

export class OtpRepository extends BaseRepository {
  /**
   * Returns the number of seconds the caller must wait before another OTP can be
   * requested for this email, or 0 if a new code may be sent now. Used for
   * server-side rate limiting so clients cannot spam OTP requests.
   */
  async secondsUntilResend(email: string): Promise<number> {
    const [latest] = await this.db
      .select({ createdAt: otpCodes.createdAt })
      .from(otpCodes)
      .where(eq(otpCodes.email, email))
      .orderBy(desc(otpCodes.createdAt))
      .limit(1);

    if (!latest) return 0;

    const elapsedSeconds = Math.floor(
      (Date.now() - latest.createdAt.getTime()) / 1000,
    );
    const remaining = OTP_RESEND_COOLDOWN_SECONDS - elapsedSeconds;
    return remaining > 0 ? remaining : 0;
  }

  async create(email: string): Promise<string> {
    await this.db
      .update(otpCodes)
      .set({ usedAt: new Date() })
      .where(and(eq(otpCodes.email, email), isNull(otpCodes.usedAt)));

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await this.db.insert(otpCodes).values({ email, code, expiresAt });
    return code;
  }

  async verify(email: string, code: string): Promise<boolean> {
    const [row] = await this.db
      .select()
      .from(otpCodes)
      .where(
        and(
          eq(otpCodes.email, email),
          eq(otpCodes.code, code),
          gt(otpCodes.expiresAt, new Date()),
          isNull(otpCodes.usedAt),
        ),
      )
      .limit(1);

    if (!row) return false;

    await this.db
      .update(otpCodes)
      .set({ usedAt: new Date() })
      .where(eq(otpCodes.id, row.id));

    return true;
  }
}

export const otpRepository = new OtpRepository();
