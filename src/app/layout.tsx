import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

/** فونت فارسی وزیرمتن — self-host شده توسط next/font */
const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نیروکار | بازار خدمات فنی و نصب",
  description:
    "نیروکار؛ بازارگاه چندخدمتی خدمات فنی، نصب، فروشگاه‌های محصولات ساختمانی و دکوراسیون. نسخه ۱.۰.۰ — فاز اول: ورود نقش‌های مشتری، نصاب و فروشگاه.",
  keywords: ["نیروکار", "خدمات فنی", "نصاب", "فروشگاه ساختمانی", "دکوراسیون داخلی", "وانت‌بار"],
  authors: [{ name: "تیم نیروکار" }],
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0F2A43",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} bg-brand-bg font-sans antialiased text-foreground`}>
        {children}
        <Toaster position="top-center" dir="rtl" richColors />
      </body>
    </html>
  );
}
