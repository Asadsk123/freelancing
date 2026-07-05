import { eq, and, gt, isNull } from "drizzle-orm";
import { BaseRepository } from "@/db/repository";
import { otpCodes } from "@/db/schema";

const OTP_EXPIRY_MINUTES = 10;

function generateOtpCode(): string {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  const digits = array[0]! % 1000000;
  return String(digits).padStart(6, "0");
}

export class OtpRepository extends BaseRepository {
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
