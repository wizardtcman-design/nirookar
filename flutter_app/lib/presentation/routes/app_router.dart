import 'package:flutter/material.dart';

import '../views/about_view.dart';
import '../views/customer_login_view.dart';
import '../views/guide_view.dart';
import '../views/home_view.dart';
import '../views/professional_login_view.dart';

/// مسیرهای نامی برنامه.
abstract final class AppRoutes {
  static const String home = '/';
  static const String loginCustomer = '/login/customer';
  static const String loginProfessional = '/login/professional';
  static const String guide = '/guide';
  static const String about = '/about';
}

/// کانون ورود در صفحهٔ حرفه‌ای‌ها.
enum ProfessionalFocus { installer, shop }

/// آرگومان‌های صفحهٔ ورود حرفه‌ای‌ها؛ تعیین می‌کند کدام کارت پس از ورود
/// به‌صورت خودکار اسکرول و با حلقهٔ رنگی نقش برجسته شود.
class ProfessionalLoginArgs {
  final ProfessionalFocus focus;

  const ProfessionalLoginArgs({this.focus = ProfessionalFocus.installer});
}

/// مولد مرکزی مسیرهای برنامه.
///
/// نقش‌های آینده فقط با افزودن مسیر تازه به [AppRoutes] و یک case به
/// [onGenerateRoute] پشتیبانی می‌شوند؛ مسیرهای ناشناخته به خانه برمی‌گردند.
abstract final class AppRouter {
  static Route<dynamic> onGenerateRoute(RouteSettings settings) {
    final Object? arguments = settings.arguments;
    switch (settings.name) {
      case AppRoutes.loginCustomer:
        return _page(const CustomerLoginView(), settings);
      case AppRoutes.loginProfessional:
        final ProfessionalLoginArgs args = arguments is ProfessionalLoginArgs
            ? arguments
            : const ProfessionalLoginArgs();
        return _page(ProfessionalLoginView(args: args), settings);
      case AppRoutes.guide:
        return _page(const GuideView(), settings);
      case AppRoutes.about:
        return _page(const AboutView(), settings);
      default:
        return _page(const HomeView(), settings);
    }
  }

  static Route<dynamic> _page(Widget page, RouteSettings settings) {
    return MaterialPageRoute<dynamic>(
      builder: (BuildContext context) => page,
      settings: settings,
    );
  }
}
