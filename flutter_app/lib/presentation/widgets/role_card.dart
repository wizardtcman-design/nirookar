import 'package:flutter/material.dart';

import '../../core/theme/app_colors.dart';
import '../../domain/models/role_definition.dart';

/// کارت انتخاب نقش در صفحهٔ خانه.
///
/// کاملاً داده‌محور است و از [RoleDefinition] تغذیه می‌شود؛ افزودن نقش
/// تازه به رجیستری، بدون تغییر این ویجت نمایش داده می‌شود.
class RoleCard extends StatelessWidget {
  const RoleCard({
    super.key,
    required this.role,
    required this.onTap,
  });

  final RoleDefinition role;
  final VoidCallback onTap;

  IconData get _icon {
    return switch (role.id) {
      'customer' => Icons.person_outline,
      'installer' => Icons.handyman_outlined,
      'shop' => Icons.storefront_outlined,
      _ => Icons.widgets_outlined,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Semantics(
      button: true,
      label: '${role.title} — ${role.subtitle}',
      child: Material(
        color: AppColors.card,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: AppColors.slate200),
        ),
        child: InkWell(
          borderRadius: BorderRadius.circular(20),
          onTap: role.enabled ? onTap : null,
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: <Widget>[
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    color: role.accentContainer,
                    shape: BoxShape.circle,
                  ),
                  alignment: Alignment.center,
                  child: Icon(_icon, size: 26, color: role.accent),
                ),
                const SizedBox(width: 14),
                Container(
                  width: 1,
                  height: 44,
                  color: role.accent.withAlpha(90),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        role.title,
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: role.accent,
                        ),
                      ),
                      const SizedBox(height: 3),
                      Text(
                        role.subtitle,
                        style: const TextStyle(
                          fontSize: 13,
                          color: AppColors.textMuted,
                        ),
                      ),
                      const SizedBox(height: 8),
                      Container(
                        width: 34,
                        height: 3,
                        decoration: BoxDecoration(
                          color: role.accent,
                          borderRadius: BorderRadius.circular(2),
                        ),
                      ),
                    ],
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
