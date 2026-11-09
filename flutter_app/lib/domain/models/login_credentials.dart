/// داده‌های ارسالی به سرویس ورود.
///
/// مدل مستقل از UI؛ نقش به‌صورت شناسهٔ رشته‌ای ارسال می‌شود تا نقش‌های
/// آینده بدون تغییر این قرارداد اضافه شوند.
class LoginCredentials {
  /// شناسهٔ نقش (مثل `customer` یا `installer`).
  final String role;

  /// ایمیل یا شماره موبایل (پس از trim).
  final String identifier;

  /// رمز عبور خام.
  final String password;

  const LoginCredentials({
    required this.role,
    required this.identifier,
    required this.password,
  });
}
