import '../../core/strings/app_strings.dart';
import '../../core/theme/app_colors.dart';
import 'identifier_type.dart';
import 'role_definition.dart';

/// فهرست مرکزی نقش‌های نیروکار.
///
/// برای افزودن نقش‌های آینده — راننده وانت‌بار، شرکت حمل‌ونقل، متخصص
/// تعمیرات و… — فقط یک [RoleDefinition] به [roles] اضافه کنید. هنگام
/// آماده شدن سرویس آن نقش، مسیر ناوبری و پیاده‌سازی واقعی `AuthRepository`
/// در لایه‌های بالاتر متصل می‌شود و صفحات فعلی بدون تغییر می‌مانند.
abstract final class RoleRegistry {
  /// نقش مشتری — ورود با ایمیل یا موبایل.
  static const RoleDefinition customer = RoleDefinition(
    id: 'customer',
    title: AppStrings.roleCustomerTitle,
    subtitle: AppStrings.roleCustomerSubtitle,
    submitLabel: AppStrings.roleCustomerSubmit,
    identifierLabel: AppStrings.roleCustomerIdentifierLabel,
    identifierHint: AppStrings.roleCustomerIdentifierHint,
    identifierType: IdentifierType.emailOrPhone,
    accent: AppColors.teal,
    accentContainer: AppColors.tealContainer,
    onAccent: AppColors.card,
    enabled: true,
  );

  /// نقش نصاب — ورود با شماره موبایل.
  static const RoleDefinition installer = RoleDefinition(
    id: 'installer',
    title: AppStrings.roleInstallerTitle,
    subtitle: AppStrings.roleInstallerSubtitle,
    submitLabel: AppStrings.roleInstallerSubmit,
    identifierLabel: AppStrings.roleInstallerIdentifierLabel,
    identifierHint: AppStrings.roleInstallerIdentifierHint,
    identifierType: IdentifierType.phoneOnly,
    accent: AppColors.navy,
    accentContainer: AppColors.slate200,
    onAccent: AppColors.card,
    enabled: true,
  );

  /// نقش فروشگاه — ورود با شماره موبایل.
  static const RoleDefinition shop = RoleDefinition(
    id: 'shop',
    title: AppStrings.roleShopTitle,
    subtitle: AppStrings.roleShopSubtitle,
    submitLabel: AppStrings.roleShopSubmit,
    identifierLabel: AppStrings.roleShopIdentifierLabel,
    identifierHint: AppStrings.roleShopIdentifierHint,
    identifierType: IdentifierType.phoneOnly,
    accent: AppColors.coral,
    accentContainer: AppColors.coralContainer,
    onAccent: AppColors.card,
    enabled: true,
  );

  /// تمام نقش‌های ثبت‌شده؛ ترتیب نمایش در صفحهٔ خانه.
  static const List<RoleDefinition> roles = <RoleDefinition>[
    customer,
    installer,
    shop,
  ];

  /// یافتن نقش با شناسه؛ برای شناسه‌های ثبت‌نشده null برمی‌گرداند.
  static RoleDefinition? byId(String id) {
    for (final RoleDefinition role in roles) {
      if (role.id == id) {
        return role;
      }
    }
    return null;
  }
}
