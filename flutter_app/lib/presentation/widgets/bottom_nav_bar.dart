import 'package:flutter/material.dart';

import '../../core/strings/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../routes/app_router.dart';

/// مقصدهای نوار پایینی در فاز ۱.
enum NavDestination { home, guide, about }

/// نوار ناوبری شناور پایین صفحه (کپسول سفید گرد با سایه).
///
/// ناوبری همیشه از طریق مسیرهای نامی [AppRoutes] انجام می‌شود و پشتهٔ
/// صفحات حداکثر دو سطح می‌ماند (خانه + صفحهٔ فعلی) تا رفتار برگشت پیش‌بینی‌پذیر باشد.
class BottomNavBar extends StatelessWidget {
  const BottomNavBar({super.key, required this.current});

  final NavDestination current;

  void _go(BuildContext context, NavDestination destination) {
    if (destination == current) {
      return;
    }
    if (destination == NavDestination.home) {
      Navigator.popUntil(context, (Route<dynamic> route) => route.isFirst);
      return;
    }
    Navigator.pushNamedAndRemoveUntil(
      context,
      _routeOf(destination),
      (Route<dynamic> route) => route.isFirst,
    );
  }

  String _routeOf(NavDestination destination) {
    return switch (destination) {
      NavDestination.home => AppRoutes.home,
      NavDestination.guide => AppRoutes.guide,
      NavDestination.about => AppRoutes.about,
    };
  }

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      top: false,
      child: Container(
        margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(24),
          boxShadow: const <BoxShadow>[
            BoxShadow(
              color: Color(0x140F2A43),
              blurRadius: 18,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: <Widget>[
            _item(
              context,
              NavDestination.home,
              AppStrings.navHome,
              Icons.home_outlined,
              Icons.home,
            ),
            _item(
              context,
              NavDestination.guide,
              AppStrings.navGuide,
              Icons.help_outline,
              Icons.help,
            ),
            _item(
              context,
              NavDestination.about,
              AppStrings.navAbout,
              Icons.info_outline,
              Icons.info,
            ),
          ],
        ),
      ),
    );
  }

  Widget _item(
    BuildContext context,
    NavDestination destination,
    String label,
    IconData inactiveIcon,
    IconData activeIcon,
  ) {
    final bool active = destination == current;
    return Expanded(
      child: Semantics(
        button: true,
        selected: active,
        label: label,
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: () => _go(context, destination),
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 9),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: <Widget>[
                Icon(
                  active ? activeIcon : inactiveIcon,
                  size: 22,
                  color: active ? AppColors.navy : AppColors.textMuted,
                ),
                const SizedBox(height: 3),
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight:
                        active ? FontWeight.w800 : FontWeight.w500,
                    color: active ? AppColors.navy : AppColors.textMuted,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
