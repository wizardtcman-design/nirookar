import 'package:flutter/material.dart';

import '../../core/config/app_config.dart';
import '../../core/strings/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../widgets/bottom_nav_bar.dart';

/// صفحهٔ درباره ما؛ اطلاعات صادقانهٔ محصول در فاز ۱.
class AboutView extends StatelessWidget {
  const AboutView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.aboutTitle)),
      bottomNavigationBar: const BottomNavBar(current: NavDestination.about),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          children: <Widget>[
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                children: <Widget>[
                  Container(
                    width: 56,
                    height: 56,
                    decoration: BoxDecoration(
                      color: AppColors.navy,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    alignment: Alignment.center,
                    child: const Text(
                      'N',
                      style: TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: AppColors.card,
                      ),
                    ),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    AppStrings.appName,
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w800,
                      color: AppColors.navy,
                    ),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    AppStrings.appTagline,
                    style: TextStyle(
                      fontSize: 12,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  Text(
                    AppStrings.aboutIntro,
                    style: const TextStyle(
                      fontSize: 13,
                      height: 1.9,
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 16),
                  _infoRow(AppStrings.aboutVersionLabel, AppConfig.appVersion),
                  const _ThinDivider(),
                  _infoRow(AppStrings.aboutPhaseLabel, AppConfig.phaseLabel),
                  const _ThinDivider(),
                  _infoRow(
                    AppStrings.aboutPlatformsLabel,
                    AppStrings.aboutPlatformsValue,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _infoRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: <Widget>[
          Expanded(
            child: Text(
              label,
              style: const TextStyle(
                fontSize: 13,
                color: AppColors.textMuted,
              ),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w700,
              color: AppColors.navy,
            ),
          ),
        ],
      ),
    );
  }
}

class _ThinDivider extends StatelessWidget {
  const _ThinDivider();

  @override
  Widget build(BuildContext context) {
    return Container(height: 1, color: AppColors.slate200);
  }
}
