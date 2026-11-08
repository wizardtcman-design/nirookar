import { Info } from "lucide-react";

interface HonestNoticeProps {
  title: string;
  body: string;
}

/**
 * اعلان شفافیت: وقتی قابلیتی در فاز جاری فعال نیست، رابط کاربری صادقانه
 * وضعیت واقعی را توضیح می‌دهد و هیچ موفقیتی جعلی نمایش داده نمی‌شود.
 */
export function HonestNotice({ title, body }: HonestNoticeProps) {
  return (
    <div role="status" className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5">
      <Info className="mt-0.5 size-4 shrink-0 text-amber-600" aria-hidden="true" />
      <p className="text-xs leading-6 text-amber-900">
        <span className="font-extrabold">{title}: </span>
        {body}
      </p>
    </div>
  );
}
