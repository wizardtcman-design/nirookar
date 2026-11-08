import 'package:flutter/material.dart';

import '../../core/di/service_locator.dart';
import '../../core/error/failures.dart';
import '../../core/strings/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../core/utils/validators.dart';
import '../../domain/models/identifier_type.dart';
import '../../domain/models/login_credentials.dart';
import '../routes/app_router.dart';
import '../widgets/app_text_field.dart';
import '../widgets/honest_snackbar.dart';
import '../widgets/primary_button.dart';

/// صفحهٔ ورود حرفه‌ای‌ها (نصاب و فروشگاه).
///
/// بسته به [ProfessionalLoginArgs.focus]، کارت متناظر پس از ورود به صفحه
/// اسکرول و با حلقهٔ رنگی نقش برجسته می‌شود. هر فرم کلید و کنترلرهای
/// مستقل دارد؛ ارسال فرم = اعتبارسنجی → فراخوانی `authRepository.login`
/// → پیام صادقانهٔ «فاز ۱».
class ProfessionalLoginView extends StatefulWidget {
  const ProfessionalLoginView({super.key, required this.args});

  final ProfessionalLoginArgs args;

  @override
  State<ProfessionalLoginView> createState() => _ProfessionalLoginViewState();
}

class _ProfessionalLoginViewState extends State<ProfessionalLoginView> {
  final GlobalKey<FormState> _installerFormKey = GlobalKey<FormState>();
  final GlobalKey<FormState> _shopFormKey = GlobalKey<FormState>();
  final GlobalKey<StatefulWidget> _installerCardKey = GlobalKey<StatefulWidget>();
  final GlobalKey<StatefulWidget> _shopCardKey = GlobalKey<StatefulWidget>();
  final ScrollController _scrollController = ScrollController();
  final TextEditingController _installerPhoneController =
      TextEditingController();
  final TextEditingController _installerPasswordController =
      TextEditingController();
  final TextEditingController _shopPhoneController = TextEditingController();
  final TextEditingController _shopPasswordController =
      TextEditingController();

  bool _installerFocused = false;
  bool _shopFocused = false;
  bool _submittingInstaller = false;
  bool _submittingShop = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) => _applyInitialFocus());
  }

  void _applyInitialFocus() {
    if (!mounted) {
      return;
    }
    final bool focusInstaller =
        widget.args.focus == ProfessionalFocus.installer;
    final BuildContext? cardContext =
        (focusInstaller ? _installerCardKey : _shopCardKey).currentContext;
    if (cardContext != null) {
      Scrollable.ensureVisible(
        cardContext,
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeOutCubic,
      );
    }
    setState(() {
      if (focusInstaller) {
        _installerFocused = true;
      } else {
        _shopFocused = true;
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    _installerPhoneController.dispose();
    _installerPasswordController.dispose();
    _shopPhoneController.dispose();
    _shopPasswordController.dispose();
    super.dispose();
  }

  Future<void> _submit({required ProfessionalFocus focus}) async {
    final bool installer = focus == ProfessionalFocus.installer;
    final GlobalKey<FormState> formKey =
        installer ? _installerFormKey : _shopFormKey;
    final bool isValid = formKey.currentState?.validate() ?? false;
    if (!isValid) {
      return;
    }
    final TextEditingController phoneController =
        installer ? _installerPhoneController : _shopPhoneController;
    final TextEditingController passwordController =
        installer ? _installerPasswordController : _shopPasswordController;
    FocusManager.instance.primaryFocus?.unfocus();
    _setSubmitting(installer, true);
    try {
      await authRepository.login(
        LoginCredentials(
          role: installer ? 'installer' : 'shop',
          identifier: phoneController.text.trim(),
          password: passwordController.text,
        ),
      );
      // در فازهای بعدی: دریافت AuthSession و ناوبری به پنل نقش.
    } on PhaseNotImplementedFailure catch (failure) {
      if (!mounted) {
        return;
      }
      showHonestSnackBar(
        context,
        failure.message,
        title: AppStrings.honestNoticeTitle,
        detail: AppStrings.honestNoticeBody,
      );
    } catch (_) {
      if (!mounted) {
        return;
      }
      showHonestSnackBar(
        context,
        AppStrings.unexpectedError,
        title: AppStrings.honestNoticeTitle,
      );
    } finally {
      _setSubmitting(installer, false);
    }
  }

  void _setSubmitting(bool installer, bool value) {
    if (!mounted) {
      return;
    }
    setState(() {
      if (installer) {
        _submittingInstaller = value;
      } else {
        _submittingShop = value;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          controller: _scrollController,
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              _topBar(),
              const SizedBox(height: 20),
              _installerCard(),
              const SizedBox(height: 12),
              _cardsDivider(),
              const SizedBox(height: 6),
              _shopCard(),
              const SizedBox(height: 24),
              _featureChips(),
            ],
          ),
        ),
      ),
    );
  }

  Widget _topBar() {
    return Row(
      children: <Widget>[
        IconButton(
          tooltip: AppStrings.back,
          onPressed: () => Navigator.maybePop(context),
          icon: const Icon(Icons.arrow_forward, color: AppColors.navy),
        ),
        const Expanded(
          child: Column(
            children: <Widget>[
              Text(
                AppStrings.professionalWelcome,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.w800,
                  color: AppColors.navy,
                ),
              ),
              SizedBox(height: 4),
              Text(
                AppStrings.professionalSubtitle,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.textMuted,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 48),
      ],
    );
  }

  Widget _installerCard() {
    return Container(
      key: _installerCardKey,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.navy,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: _installerFocused ? AppColors.teal : Colors.transparent,
          width: 2,
        ),
      ),
      child: Form(
        key: _installerFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Row(
              children: <Widget>[
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        AppStrings.roleInstallerTitle,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: AppColors.card,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        AppStrings.roleInstallerSubtitle,
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.slate300,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.teal, width: 1.5),
                  ),
                  alignment: Alignment.center,
                  child: const Icon(
                    Icons.handyman_outlined,
                    size: 26,
                    color: AppColors.teal,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _cardDivider(isDark: true),
            const SizedBox(height: 18),
            AppTextField(
              controller: _installerPhoneController,
              label: AppStrings.roleInstallerIdentifierLabel,
              hint: AppStrings.roleInstallerIdentifierHint,
              icon: Icons.phone_iphone,
              iconColor: AppColors.teal,
              labelColor: AppColors.card,
              validator: (String? value) =>
                  validateIdentifier(value, IdentifierType.phoneOnly),
              textInputAction: TextInputAction.next,
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 14),
            AppTextField(
              controller: _installerPasswordController,
              label: AppStrings.passwordLabel,
              hint: AppStrings.passwordHint,
              icon: Icons.lock_outline,
              iconColor: AppColors.teal,
              labelColor: AppColors.card,
              isPassword: true,
              validator: validatePassword,
              textInputAction: TextInputAction.done,
            ),
            const SizedBox(height: 20),
            PrimaryButton(
              label: AppStrings.roleInstallerSubmit,
              icon: Icons.arrow_back,
              onPressed: _submittingInstaller
                  ? null
                  : () => _submit(focus: ProfessionalFocus.installer),
            ),
            const SizedBox(height: 4),
            Center(
              child: TextButton(
                onPressed: () =>
                    showHonestSnackBar(context, AppStrings.comingSoon),
                style: TextButton.styleFrom(
                  minimumSize: const Size(44, 44),
                ),
                child: const Text(
                  AppStrings.forgotPassword,
                  style: TextStyle(fontSize: 12, color: AppColors.slate300),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _cardsDivider() {
    return Center(
      child: Transform.translate(
        offset: const Offset(0, -18),
        child: Container(
          width: 46,
          height: 46,
          decoration: BoxDecoration(
            color: AppColors.card,
            shape: BoxShape.circle,
            border: Border.all(color: AppColors.slate200),
            boxShadow: const <BoxShadow>[
              BoxShadow(
                color: Color(0x140F2A43),
                blurRadius: 12,
                offset: Offset(0, 4),
              ),
            ],
          ),
          alignment: Alignment.center,
          child: const Text(
            '/',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: AppColors.textMuted,
            ),
          ),
        ),
      ),
    );
  }

  Widget _shopCard() {
    return Container(
      key: _shopCardKey,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
          color: _shopFocused ? AppColors.coral : AppColors.coral.withAlpha(77),
          width: _shopFocused ? 2 : 1,
        ),
      ),
      child: Form(
        key: _shopFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: <Widget>[
            Row(
              children: <Widget>[
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        AppStrings.roleShopTitle,
                        style: TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w800,
                          color: AppColors.coral,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        AppStrings.roleShopSubtitle,
                        style: TextStyle(
                          fontSize: 12,
                          color: AppColors.textMuted,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  width: 56,
                  height: 56,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    border: Border.all(color: AppColors.coral, width: 1.5),
                  ),
                  alignment: Alignment.center,
                  child: const Icon(
                    Icons.storefront_outlined,
                    size: 26,
                    color: AppColors.coral,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            _cardDivider(isDark: false),
            const SizedBox(height: 18),
            AppTextField(
              controller: _shopPhoneController,
              label: AppStrings.roleShopIdentifierLabel,
              hint: AppStrings.roleShopIdentifierHint,
              icon: Icons.phone_iphone,
              iconColor: AppColors.coral,
              validator: (String? value) =>
                  validateIdentifier(value, IdentifierType.phoneOnly),
              textInputAction: TextInputAction.next,
              keyboardType: TextInputType.phone,
            ),
            const SizedBox(height: 14),
            AppTextField(
              controller: _shopPasswordController,
              label: AppStrings.passwordLabel,
              hint: AppStrings.passwordHint,
              icon: Icons.lock_outline,
              iconColor: AppColors.coral,
              isPassword: true,
              validator: validatePassword,
              textInputAction: TextInputAction.done,
            ),
            const SizedBox(height: 20),
            PrimaryButton(
              label: AppStrings.roleShopSubmit,
              icon: Icons.arrow_back,
              color: AppColors.coral,
              onPressed: _submittingShop
                  ? null
                  : () => _submit(focus: ProfessionalFocus.shop),
            ),
            const SizedBox(height: 4),
            Center(
              child: TextButton(
                onPressed: () =>
                    showHonestSnackBar(context, AppStrings.comingSoon),
                style: TextButton.styleFrom(
                  minimumSize: const Size(44, 44),
                ),
                child: const Text(
                  AppStrings.forgotPassword,
                  style: TextStyle(
                    fontSize: 12,
                    color: AppColors.textMuted,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _cardDivider({required bool isDark}) {
    final Color lineColor =
        isDark ? const Color(0x26FFFFFF) : AppColors.slate200;
    return Row(
      children: <Widget>[
        Expanded(child: Container(height: 1, color: lineColor)),
        Container(
          width: 6,
          height: 6,
          decoration: const BoxDecoration(
            color: AppColors.teal,
            shape: BoxShape.circle,
          ),
        ),
        Expanded(child: Container(height: 1, color: lineColor)),
      ],
    );
  }

  Widget _featureChips() {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Row(
        children: <Widget>[
          _chip(
            AppStrings.chip1SupportTitle,
            AppStrings.chip1SupportSub,
            Icons.support_agent,
            AppColors.teal,
          ),
          _verticalDivider(),
          _chip(
            AppStrings.chip2Title,
            AppStrings.chip2Sub,
            Icons.phone_android,
            AppColors.navy,
          ),
          _verticalDivider(),
          _chip(
            AppStrings.chip3Title,
            AppStrings.chip3Sub,
            Icons.verified_user,
            AppColors.teal,
          ),
        ],
      ),
    );
  }

  Widget _chip(String title, String subtitle, IconData icon, Color color) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 6),
        child: Column(
          children: <Widget>[
            Icon(icon, size: 22, color: color),
            const SizedBox(height: 6),
            Text(
              title,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                color: AppColors.navy,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              subtitle,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                fontSize: 10,
                color: AppColors.textMuted,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _verticalDivider() {
    return Container(width: 1, height: 36, color: AppColors.slate200);
  }
}
