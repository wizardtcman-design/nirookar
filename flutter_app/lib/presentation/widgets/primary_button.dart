import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../core/theme/app_theme.dart';

/// دکمهٔ اصلی برنامه؛ تمام‌عرض، ارتفاع ۵۲ و گوشهٔ گرد ۱۴.
///
/// حالت غیرفعال (onPressed == null) صادقانه رنگ کم‌رنگ می‌گیرد و هیچ
/// رفتار جعلی شبیه‌سازی نمی‌شود.
class PrimaryButton extends StatelessWidget {
  const PrimaryButton({
    super.key,
    required this.label,
    required this.onPressed,
    this.color = AppColors.teal,
    this.icon,
  });

  final String label;
  final VoidCallback? onPressed;

  /// رنگ تأکیدی نقش (teal برای مشتری/نصاب، coral برای فروشگاه).
  final Color color;

  /// آیکون اختیاری در ابتدای ردیف دکمه (در RTL سمت راست).
  final IconData? icon;

  @override
  Widget build(BuildContext context) {
    final IconData? iconData = icon;
    return SizedBox(
      width: double.infinity,
      height: 52,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: color,
          foregroundColor: AppColors.card,
          disabledBackgroundColor: color.withAlpha(120),
          disabledForegroundColor: AppColors.card.withAlpha(200),
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          textStyle: const TextStyle(
            fontFamily: AppTheme.fontFamily,
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            if (iconData != null) ...<Widget>[
              Icon(iconData, size: 20),
              const SizedBox(width: 8),
            ],
            Text(label),
          ],
        ),
      ),
    );
  }
}
