import 'package:flutter/material.dart';

import '../../core/strings/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../widgets/bottom_nav_bar.dart';

/// دادهٔ نمایشی یک دسته‌بندی به‌زودی.
class _UpcomingCategory {
  final IconData icon;
  final String title;

  const _UpcomingCategory(this.icon, this.title);
}

/// صفحهٔ راهنما؛ توضیح صادقانهٔ وضعیت فاز ۱ و دسته‌بندی‌های آینده.
class GuideView extends StatelessWidget {
  const GuideView({super.key});

  static const List<_UpcomingCategory> _upcomingCategories =
      <_UpcomingCategory>[
    _UpcomingCategory(Icons.chair, AppStrings.categoryDecorTitle),
    _UpcomingCategory(Icons.engineering, AppStrings.categoryBuilderTitle),
    _UpcomingCategory(Icons.storefront, AppStrings.categoryShopTitle),
    _UpcomingCategory(Icons.local_shipping, AppStrings.categoryLogisticsTitle),
    _UpcomingCategory(Icons.home_repair_service, AppStrings.categoryRepairTitle),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(title: const Text(AppStrings.guideTitle)),
      bottomNavigationBar: const BottomNavBar(current: NavDestination.guide),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(20, 16, 20, 24),
          children: <Widget>[
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  const Text(
                    AppStrings.guideWhatTitle,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.navy,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    AppStrings.guideIntro,
                    style: const TextStyle(
                      fontSize: 13,
                      height: 1.9,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: AppColors.card,
                borderRadius: BorderRadius.circular(20),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: <Widget>[
                  const Text(
                    AppStrings.guideUpcomingTitle,
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.navy,
                    ),
                  ),
                  const SizedBox(height: 14),
                  ..._upcomingCategories.map(_categoryRow),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _categoryRow(_UpcomingCategory category) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        children: <Widget>[
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: AppColors.tealContainer,
              borderRadius: BorderRadius.circular(10),
            ),
            alignment: Alignment.center,
            child: Icon(category.icon, size: 18, color: AppColors.teal),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Text(
              category.title,
              style: const TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w600,
                color: AppColors.navy,
              ),
            ),
          ),
          const SizedBox(width: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: AppColors.tealContainer,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Text(
              AppStrings.comingSoonChip,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: AppColors.tealDark,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
