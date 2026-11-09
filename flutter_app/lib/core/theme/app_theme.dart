import 'package:flutter/material.dart';

import 'app_colors.dart';

/// تم اصلی برنامه؛ متریال ۳، فونت وزیرمتن و پالت برند نیروکار.
abstract final class AppTheme {
  /// خانوادهٔ فونت برنامه (در pubspec.yaml با ۵ وزن تعریف شده است).
  static const String fontFamily = 'Vazirmatn';

  /// تم روشن برنامه.
  static ThemeData light() {
    final ColorScheme scheme =
        ColorScheme.fromSeed(seedColor: AppColors.teal).copyWith(
      primary: AppColors.teal,
      onPrimary: AppColors.card,
      primaryContainer: AppColors.tealContainer,
      onPrimaryContainer: AppColors.navy,
      secondary: AppColors.navy,
      onSecondary: AppColors.card,
      secondaryContainer: AppColors.slate200,
      onSecondaryContainer: AppColors.navy,
      error: AppColors.error,
      onError: AppColors.card,
      surface: AppColors.card,
      onSurface: AppColors.textPrimary,
      onSurfaceVariant: AppColors.textMuted,
      outline: AppColors.slate300,
      outlineVariant: AppColors.slate200,
    );

    final ThemeData theme = ThemeData(
      useMaterial3: true,
      colorScheme: scheme,
      scaffoldBackgroundColor: AppColors.background,
      fontFamily: fontFamily,
      appBarTheme: const AppBarTheme(
        backgroundColor: AppColors.card,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: true,
        foregroundColor: AppColors.navy,
        iconTheme: IconThemeData(color: AppColors.navy),
        titleTextStyle: TextStyle(
          fontFamily: fontFamily,
          fontSize: 17,
          fontWeight: FontWeight.w700,
          color: AppColors.navy,
        ),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.teal,
          foregroundColor: AppColors.card,
          elevation: 0,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: const TextStyle(
            fontFamily: fontFamily,
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.navy,
        contentTextStyle: const TextStyle(
          fontFamily: fontFamily,
          fontSize: 13,
          color: AppColors.card,
        ),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
      iconTheme: const IconThemeData(color: AppColors.navy),
    );

    // اعمال فونت وزیرمتن و رنگ متن برند روی تمام سبک‌های متنی.
    return theme.copyWith(
      textTheme: theme.textTheme.apply(
        fontFamily: fontFamily,
        bodyColor: AppColors.textPrimary,
        displayColor: AppColors.textPrimary,
      ),
    );
  }
}
