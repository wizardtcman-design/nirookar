import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * هش و صحت‌سنجی رمز عبور — فاز ۲ گام ۲ (نسخه 0.1.2).
 *
 * الگوریتم: scrypt استاندارد Node.js با salt تصادفی ۱۶ بایتی به‌ازای هر کاربر
 * و کلید ۶۴ بایتی. قالب ذخیره: «scrypt$salt$hash» (hex).
 * هیچ رمز خام در هیچ نقطه‌ای ذخیره یا لاگ نمی‌شود.
 * مقایسه با timingSafeEqual برای جلوگیری از حمله زمان‌سنجی انجام می‌شود.
 */

const KEY_LENGTH_BYTES = 64;
const SALT_LENGTH_BYTES = 16;
const SCRYPT_SCHEME = "scrypt";

export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH_BYTES).toString("hex");
  const derived = scryptSync(password, salt, KEY_LENGTH_BYTES).toString("hex");
  return `${SCRYPT_SCHEME}$${salt}$${derived}`;
}

export function verifyPassword(password: string, storedHash: string | null | undefined): boolean {
  if (!storedHash) return false;
  const [scheme, salt, hash] = storedHash.split("$");
  if (scheme !== SCRYPT_SCHEME || !salt || !hash) return false;

  try {
    const derived = scryptSync(password, salt, KEY_LENGTH_BYTES);
    const expected = Buffer.from(hash, "hex");
    if (derived.length !== expected.length) return false;
    return timingSafeEqual(derived, expected);
  } catch {
    return false;
  }
}
