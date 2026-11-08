/// نشست کاربر پس از ورود موفق.
///
/// در فاز ۱ هیچ نمونهٔ واقعی از این مدل ساخته نمی‌شود (سرویس ورود فعال
/// نیست)؛ ساختار آن از همین حالا قرارداد فازهای بعدی را تثبیت می‌کند.
class AuthSession {
  /// شناسهٔ نقش کاربر.
  final String role;

  /// نام نمایشی کاربر برای نمایش در پنل.
  final String displayName;

  /// توکن نشست برای فراخوانی‌های بعدی.
  final String token;

  const AuthSession({
    required this.role,
    required this.displayName,
    required this.token,
  });
}
