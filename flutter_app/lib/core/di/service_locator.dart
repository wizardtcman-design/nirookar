import '../../data/repositories/unimplemented_auth_repository.dart';
import '../../domain/repositories/auth_repository.dart';

/// نقطهٔ واحد تزریق وابستگی در فاز ۱.
///
/// برای اتصال به بک‌اند واقعی در فازهای بعدی، تنها کافی است این متغیر سراسری
/// با یک پیاده‌سازی واقعی از [AuthRepository] (مثلاً `RestAuthRepository`)
/// جایگزین شود؛ هیچ صفحه یا ویجتی نیازی به تغییر ندارد.
AuthRepository authRepository = UnimplementedAuthRepository();
