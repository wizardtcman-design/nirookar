import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'core/strings/app_strings.dart';
import 'core/theme/app_theme.dart';
import 'presentation/routes/app_router.dart';
import 'presentation/views/home_view.dart';

/// ویجت ریشهٔ برنامه؛ تنظیم تم متریال ۳، زبان فارسی و مسیریابی.
class NirooKarApp extends StatelessWidget {
  const NirooKarApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppStrings.appName,
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      locale: const Locale('fa'),
      supportedLocales: const <Locale>[
        Locale('fa'),
        Locale('en'),
      ],
      localizationsDelegates: const <LocalizationsDelegate<Object>>[
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      home: const HomeView(),
      onGenerateRoute: AppRouter.onGenerateRoute,
    );
  }
}
