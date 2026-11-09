import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';

/// نمایش پیام‌های صادقانهٔ «فاز ۱» و اعلان‌های خنثی.
///
/// این اسنک‌بار فقط برای اطلاع‌رسانی واقعی استفاده می‌شود (بخش‌های
/// پیاده‌نشده، خطاها) و هیچ‌گاه موفقیت جعلی نشان نمی‌دهد.
void showHonestSnackBar(
  BuildContext context,
  String message, {
  String? title,
  String? detail,
}) {
  ScaffoldMessenger.of(context)
    ..hideCurrentSnackBar()
    ..showSnackBar(
      SnackBar(
        behavior: SnackBarBehavior.floating,
        backgroundColor: AppColors.amberContainer,
        duration: const Duration(seconds: 4),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        content: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            const Icon(
              Icons.info_outline,
              size: 22,
              color: AppColors.amberIcon,
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisSize: MainAxisSize.min,
                children: <Widget>[
                  if (title != null)
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w800,
                        color: AppColors.amberInk,
                      ),
                    ),
                  Text(
                    message,
                    style: const TextStyle(
                      fontSize: 12.5,
                      fontWeight: FontWeight.w500,
                      color: AppColors.amberInk,
                    ),
                  ),
                  if (detail != null)
                    Text(
                      detail,
                      style: TextStyle(
                        fontSize: 11,
                        height: 1.5,
                        color: AppColors.amberInk.withAlpha(216),
                      ),
                    ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
}
