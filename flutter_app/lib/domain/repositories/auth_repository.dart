import '../models/auth_session.dart';
import '../models/login_credentials.dart';

/// قرارداد سرویس احراز هویت نیروکار.
///
/// فاز ۱ فقط قرارداد را تعریف می‌کند؛ پیاده‌سازی فعلی
/// (`UnimplementedAuthRepository`) عمداً خطای صادقانه پرتاب می‌کند. در
/// فازهای بعدی، پیاده‌سازی واقعی (REST و…) بدون هیچ تغییری در رابط کاربری
/// جایگزین می‌شود.
abstract class AuthRepository {
  /// اعتبارسنجی نهایی روی سرور و دریافت نشست کاربر.
  ///
  /// پیاده‌سازی‌ها باید در صورت عدم آمادگی سرویس،
  /// [PhaseNotImplementedFailure] پرتاب کنند تا UI پیام صادقانه نشان دهد.
  Future<AuthSession> login(LoginCredentials credentials);
}
