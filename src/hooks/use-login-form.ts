"use client";

import { useCallback, useState, type FormEvent } from "react";
import { toast } from "sonner";

import { PhaseNotImplementedError } from "@/lib/errors";
import { validateIdentifier, validatePassword, type FieldValidation, type IdentifierValidationType } from "@/lib/validation";
import { authRepository } from "@/services";
import type { LoginCredentials, UserRole } from "@/types/auth";

/** پیام‌های صادقانه مشترک فرم‌ها — هیچ موفقیتی جعلی نمایش داده نمی‌شود */
export const HONEST_NOTICE_TITLE = "نسخه اولیه (فاز ۱)";
export const HONEST_NOTICE_BODY =
  "اتصال به سرور هنوز فعال نیست. اعتبارسنجی فرم با موفقیت انجام شد و معماری اتصال به سرویس ورود آماده است.";

const COMING_SOON_MESSAGE = "این بخش در فازهای بعدی فعال می‌شود";
const UNEXPECTED_ERROR_MESSAGE = "خطای غیرمنتظره‌ای رخ داد. لطفاً دوباره تلاش کنید.";

export function showComingSoon(): void {
  toast.info(COMING_SOON_MESSAGE);
}

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
}

export interface LoginFormApi {
  identifier: string;
  password: string;
  showPassword: boolean;
  errors: LoginFormErrors;
  submitting: boolean;
  notice: "info" | null;
  setIdentifier: (value: string) => void;
  setPassword: (value: string) => void;
  toggleShowPassword: () => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * منطق مشترک فرم‌های ورود (مشتری/نصاب/فروشگاه).
 *
 * جریان ارسال: اعتبارسنجی UI → فراخوانی authRepository (قرارداد لایه سرویس)
 * → در فاز ۱ عمداً PhaseNotImplementedError دریافت و پیام صادقانه نمایش داده می‌شود.
 */
export function useLoginForm(role: UserRole, identifierType: IdentifierValidationType): LoginFormApi {
  const [identifier, setIdentifierState] = useState("");
  const [password, setPasswordState] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<"info" | null>(null);

  const setIdentifier = useCallback((value: string) => {
    setIdentifierState(value);
    setErrors((prev) => (prev.identifier ? { ...prev, identifier: undefined } : prev));
    setNotice(null);
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setErrors((prev) => (prev.password ? { ...prev, password: undefined } : prev));
    setNotice(null);
  }, []);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((visible) => !visible);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (submitting) return;

      const identifierCheck: FieldValidation = validateIdentifier(identifier, identifierType);
      const passwordCheck: FieldValidation = validatePassword(password);

      const nextErrors: LoginFormErrors = {};
      if (!identifierCheck.ok) nextErrors.identifier = identifierCheck.message;
      if (!passwordCheck.ok) nextErrors.password = passwordCheck.message;
      setErrors(nextErrors);

      if (!identifierCheck.ok || !passwordCheck.ok) {
        setNotice(null);
        return;
      }

      setSubmitting(true);
      try {
        const credentials: LoginCredentials = {
          role,
          identifier: identifier.trim(),
          password,
        };
        await authRepository.login(credentials);
        setNotice(null);
      } catch (error) {
        if (error instanceof PhaseNotImplementedError) {
          setNotice("info");
          toast.info(`${HONEST_NOTICE_TITLE} — ${HONEST_NOTICE_BODY}`);
        } else {
          toast.error(UNEXPECTED_ERROR_MESSAGE);
        }
      } finally {
        setSubmitting(false);
      }
    },
    [identifier, password, identifierType, role, submitting],
  );

  return {
    identifier,
    password,
    showPassword,
    errors,
    submitting,
    notice,
    setIdentifier,
    setPassword,
    toggleShowPassword,
    handleSubmit,
  };
}
