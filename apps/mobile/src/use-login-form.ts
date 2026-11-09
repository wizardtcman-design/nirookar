import { useCallback, useState, type FormEvent } from "react";

import {
  validateIdentifier,
  validatePassword,
  type FieldValidation,
  type IdentifierValidationType,
} from "@shared/validation";

/**
 * منطق مشترک فرم‌های ورود (مشتری/نصاب/فروشگاه) — هماهنگ با وب.
 *
 * جریان ارسال: اعتبارسنجی UI → نمایش پیام صادقانه «اتصال به سرور در فاز ۱
 * فعال نیست». هیچ موفقیتی جعلی نمایش داده نمی‌شود.
 */

export const HONEST_NOTICE_TITLE = "نسخه اولیه (فاز ۱)";
export const HONEST_NOTICE_BODY =
  "اتصال به سرور هنوز فعال نیست. اعتبارسنجی فرم با موفقیت انجام شد و معماری اتصال به سرویس ورود آماده است.";

export interface LoginFormErrors {
  identifier?: string;
  password?: string;
}

export interface LoginFormApi {
  identifier: string;
  password: string;
  errors: LoginFormErrors;
  notice: boolean;
  setIdentifier: (value: string) => void;
  setPassword: (value: string) => void;
  handleSubmit: () => void;
}

export function useLoginForm(identifierType: IdentifierValidationType): LoginFormApi {
  const [identifier, setIdentifierState] = useState("");
  const [password, setPasswordState] = useState("");
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [notice, setNotice] = useState(false);

  const setIdentifier = useCallback((value: string) => {
    setIdentifierState(value);
    setErrors((prev) => (prev.identifier ? { ...prev, identifier: undefined } : prev));
    setNotice(false);
  }, []);

  const setPassword = useCallback((value: string) => {
    setPasswordState(value);
    setErrors((prev) => (prev.password ? { ...prev, password: undefined } : prev));
    setNotice(false);
  }, []);

  const handleSubmit = useCallback(() => {
    const identifierCheck: FieldValidation = validateIdentifier(identifier, identifierType);
    const passwordCheck: FieldValidation = validatePassword(password);

    const nextErrors: LoginFormErrors = {};
    if (!identifierCheck.ok) nextErrors.identifier = identifierCheck.message;
    if (!passwordCheck.ok) nextErrors.password = passwordCheck.message;
    setErrors(nextErrors);

    if (!identifierCheck.ok || !passwordCheck.ok) {
      setNotice(false);
      return;
    }

    // در فاز ۱ به سرور وصل نمی‌شویم؛ پیام صادقانه نمایش داده می‌شود
    setNotice(true);
  }, [identifier, password, identifierType]);

  return {
    identifier,
    password,
    errors,
    notice,
    setIdentifier,
    setPassword,
    handleSubmit,
  };
}

/** برای هم‌خوانی امضای فرم وب (FormEvent) — در موبایل استفاده نمی‌شود */
export type WebFormEvent = FormEvent<unknown>;
