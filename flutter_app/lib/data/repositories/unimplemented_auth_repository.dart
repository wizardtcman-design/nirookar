import '../../core/error/failures.dart';
import '../../core/strings/app_strings.dart';
import '../../domain/models/auth_session.dart';
import '../../domain/models/login_credentials.dart';
import '../../domain/repositories/auth_repository.dart';

/// پیاده‌سازی موقت و صادقانهٔ `AuthRepository` برای فاز ۱.
///
/// هیچ تماس شبکه‌ای جعلی، تأخیر مصنوعی یا پیام موفقیت جعلی وجود ندارد؛
/// این کلاس همیشه [PhaseNotImplementedFailure] پرتاب می‌کند تا رابط کاربری
/// پیام صادقانهٔ «فاز ۱» را نمایش دهد. جایگزینی آن با پیاده‌سازی واقعی
/// تنها از طریق `service_locator.dart` انجام می‌شود.
class UnimplementedAuthRepository implements AuthRepository {
  const UnimplementedAuthRepository();

  @override
  Future<AuthSession> login(LoginCredentials credentials) async {
    throw const PhaseNotImplementedFailure(AppStrings.loginServiceDisabled);
  }
}
