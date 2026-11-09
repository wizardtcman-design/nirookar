import type { AuthRepository } from "@/services/contracts/auth-repository";
import type {
  ApiError,
  AuthUser,
  InstallerDocuments,
  OtpRequestResult,
  OtpVerifyResult,
  OwnProfileResult,
  RegistrationData,
  ShopDocuments,
} from "@/types/auth";

/**
 * پیاده‌سازی واقعی قرارداد AuthRepository روی API Routes + SQLite (Prisma).
 *
 * نشست با کوکی httpOnly سمت سرور مدیریت می‌شود؛ این کلاس فقط JSON تمیز را
 * به لایه UI برمی‌گرداند و خطاها را به شکل صادقانه propagate می‌کند.
 * تعویض دیتابیس (مثلاً PostgreSQL) هیچ تغییری در این فایل یا UI نمی‌خواهد.
 */

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
    credentials: "same-origin",
  });

  const data = (await response.json().catch(() => null)) as (T & ApiError) | null;
  if (!response.ok || !data || data.ok === false) {
    const message = data && typeof data.error === "string" ? data.error : "خطای ارتباط با سرور. دوباره تلاش کنید.";
    throw new Error(message);
  }
  return data;
}

export class HttpAuthRepository implements AuthRepository {
  async requestOtp(phone: string): Promise<OtpRequestResult> {
    return requestJson<OtpRequestResult>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "request", phone }),
    });
  }

  async verifyOtp(phone: string, code: string, role?: string): Promise<OtpVerifyResult> {
    return requestJson<OtpVerifyResult>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "verify", phone, code, role }),
    });
  }

  async loginWithPassword(phone: string, password: string, role?: string): Promise<AuthUser> {
    const result = await requestJson<{ ok: true; user: AuthUser }>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "login-password", phone, password, role }),
    });
    return result.user;
  }

  async register(data: RegistrationData): Promise<AuthUser> {
    const result = await requestJson<{ ok: true; user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result.user;
  }

  async getMyProfile(): Promise<OwnProfileResult> {
    return requestJson<OwnProfileResult>("/api/profile");
  }

  async submitInstallerDocuments(documents: InstallerDocuments): Promise<{ status: string }> {
    return requestJson<{ ok: true; status: string }>("/api/profile/documents", {
      method: "PUT",
      body: JSON.stringify(documents),
    });
  }

  async submitShopDocuments(documents: ShopDocuments): Promise<{ status: string }> {
    return requestJson<{ ok: true; status: string }>("/api/profile/documents", {
      method: "PUT",
      body: JSON.stringify(documents),
    });
  }

  async me(): Promise<AuthUser | null> {
    const data = await requestJson<{ ok: true; user: AuthUser | null }>("/api/auth");
    return data.user;
  }

  async logout(): Promise<void> {
    await requestJson<{ ok: true }>("/api/auth", { method: "DELETE" });
  }
}
