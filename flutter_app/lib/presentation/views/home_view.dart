import 'package:flutter/material.dart';

import '../../core/strings/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../domain/models/role_definition.dart';
import '../../domain/models/role_registry.dart';
import '../routes/app_router.dart';
import '../widgets/bottom_nav_bar.dart';
import '../widgets/honest_snackbar.dart';
import '../widgets/role_card.dart';

/// صفحهٔ خانه و انتخاب نقش ورود.
///
/// کارت‌ها مستقیماً از [RoleRegistry.roles] تغذیه می‌شوند؛ نقش‌های آینده
/// بدون تغییر این صفحه اضافه می‌شوند (نقش بدون مسیر → پیام صادقانه).
class HomeView extends StatelessWidget {
  const HomeView({super.key});

  void _openRole(BuildContext context, RoleDefinition role) {
    switch (role.id) {
      case 'customer':
        Navigator.pushNamed(context, AppRoutes.loginCustomer);
      case 'installer':
        Navigator.pushNamed(
          context,
          AppRoutes.loginProfessional,
          arguments:
              const ProfessionalLoginArgs(focus: ProfessionalFocus.installer),
        );
      case 'shop':
        Navigator.pushNamed(
          context,
          AppRoutes.loginProfessional,
          arguments:
              const ProfessionalLoginArgs(focus: ProfessionalFocus.shop),
        );
      default:
        showHonestSnackBar(context, AppStrings.comingSoon);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      bottomNavigationBar: const BottomNavBar(current: NavDestination.home),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 28),
          children: <Widget>[
            _header(context),
            const SizedBox(height: 30),
            const Column(
              children: <Widget>[
                Text(
                  AppStrings.homeWelcome,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.w800,
                    color: AppColors.navy,
                  ),
                ),
                SizedBox(height: 8),
                Text(
                  AppStrings.homeSubtitle,
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    fontSize: 14,
                    color: AppColors.textMuted,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 26),
            ...RoleRegistry.roles.map(
              (RoleDefinition role) => Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: RoleCard(
                  role: role,
                  onTap: () => _openRole(context, role),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _header(BuildContext context) {
    return Row(
      children: <Widget>[
        Container(
          width: 44,
          height: 44,
          decoration: BoxDecoration(
            color: AppColors.navy,
            borderRadius: BorderRadius.circular(14),
          ),
          alignment: Alignment.center,
          child: const Text(
            'N',
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: AppColors.card,
            ),
          ),
        ),
        const SizedBox(width: 10),
        const Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Text(
                AppStrings.appName,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.w800,
                  color: AppColors.navy,
                ),
              ),
              SizedBox(height: 2),
              Text(
                AppStrings.appTagline,
                style: TextStyle(
                  fontSize: 11,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
        ),
        IconButton(
          tooltip: AppStrings.notifications,
          onPressed: () =>
              showHonestSnackBar(context, AppStrings.notifDisabled),
          icon: const Icon(Icons.notifications_none, color: AppColors.navy),
        ),
      ],
    );
  }
}
