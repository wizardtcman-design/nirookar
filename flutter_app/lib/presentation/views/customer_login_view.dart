import 'package:flutter/material.dart';

import '../../core/di/service_locator.dart';
import '../../core/error/failures.dart';
import '../../core/strings/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_theme.dart';
import '../../core/utils/validators.dart';
import '../../domain/models/identifier_type.dart';
import '../../domain/models/login_credentials.dart';
import '../widgets/app_text_field.dart';
import '../widgets/honest_snackbar.dart';
import '../widgets/primary_button.dart';

/// صفحهٔ ورود مشتری.
///
/// جریان صادقانهٔ فاز ۱: اعتبارسنجی فرم → فراخوانی `authRepository.login`
/// → نمایش پیام صادقانهٔ «فاز ۱» (چون سرویس واقعی هنوز متصل نیست).
class CustomerLoginView extends StatefulWidget {
  const CustomerLoginView({super.key});

  @override
  State<CustomerLoginView> createState() => _CustomerLoginViewState();
}

class _CustomerLoginViewState extends State<CustomerLoginView> {
  final GlobalKey<FormState> _formKey = GlobalKey<FormState>();
  final TextEditingController _identifierController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();

  bool _submitting = false;

  @override
  void dispose() {
    _identifierController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final bool isValid = _formKey.currentState?.validate() ?? false;
    if (!isValid) {
      return;
    }
    FocusManager.instance.primaryFocus?.unfocus();
    setState(() {
      _submitting = true;
    });
    try {
      await authRepository.login(
        LoginCredentials(
          role: 'customer',
          identifier: _identifierController.text.trim(),
          password: _passwordController.text,
        ),
      );
      // در فازهای بعدی: دریافت AuthSession و ناوبری به پنل مشتری.
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
      if (mounted) {
        setState(() {
          _submitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 8, 20, 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: <Widget>[
              Row(
                children: <Widget>[
                  IconButton(
                    tooltip: AppStrings.back,
                    onPressed: () => Navigator.maybePop(context),
                    icon: const Icon(
                      Icons.arrow_forward,
                      color: AppColors.navy,
                    ),
                  ),
                  const Expanded(
                    child: Text(
                      AppStrings.roleCustomerTitle,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 17,
                        fontWeight: FontWeight.w800,
                        color: AppColors.navy,
                      ),
                    ),
                  ),
                  const SizedBox(width: 48),
                ],
              ),
              const SizedBox(height: 18),
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Form(
                  key: _formKey,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: <Widget>[
                      Center(
                        child: Container(
                          width: 80,
                          height: 80,
                          decoration: const BoxDecoration(
                            color: AppColors.fieldBackground,
                            shape: BoxShape.circle,
                          ),
                          alignment: Alignment.center,
                          child: const Icon(
                            Icons.how_to_reg,
                            size: 40,
                            color: AppColors.navy,
                          ),
                        ),
                      ),
                      const SizedBox(height: 14),
                      const Text(
                        AppStrings.homeWelcome,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w800,
                          color: AppColors.navy,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        AppStrings.customerLoginIntro,
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 13,
                          color: AppColors.textMuted,
                        ),
                      ),
                      const SizedBox(height: 22),
                      AppTextField(
                        controller: _identifierController,
                        label: AppStrings.roleCustomerIdentifierLabel,
                        hint: AppStrings.roleCustomerIdentifierHint,
                        icon: Icons.mail_outline,
                        validator: (String? value) =>
                            validateIdentifier(value, IdentifierType.emailOrPhone),
                        textInputAction: TextInputAction.next,
                        keyboardType: TextInputType.emailAddress,
                      ),
                      const SizedBox(height: 16),
                      AppTextField(
                        controller: _passwordController,
                        label: AppStrings.passwordLabel,
                        hint: AppStrings.passwordHint,
                        icon: Icons.lock_outline,
                        isPassword: true,
                        validator: validatePassword,
                        textInputAction: TextInputAction.done,
                      ),
                      const SizedBox(height: 22),
                      PrimaryButton(
                        label: AppStrings.roleCustomerSubmit,
                        icon: Icons.login,
                        onPressed: _submitting ? null : _submit,
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: <Widget>[
                          Expanded(
                            child: TextButton.icon(
                              onPressed: () => showHonestSnackBar(
                                context,
                                AppStrings.comingSoon,
                              ),
                              style: TextButton.styleFrom(
                                foregroundColor: AppColors.teal,
                                textStyle: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  fontFamily: AppTheme.fontFamily,
                                ),
                              ),
                              icon: const Icon(
                                Icons.person_add_alt_1,
                                size: 18,
                              ),
                              label: const Text(
                                AppStrings.registerNew,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ),
                          Expanded(
                            child: TextButton.icon(
                              onPressed: () => showHonestSnackBar(
                                context,
                                AppStrings.comingSoon,
                              ),
                              style: TextButton.styleFrom(
                                foregroundColor: AppColors.teal,
                                textStyle: const TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  fontFamily: AppTheme.fontFamily,
                                ),
                              ),
                              icon: const Icon(Icons.help_outline, size: 18),
                              label: const Text(
                                AppStrings.forgotPasswordShort,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      // تصویرگذاری کمینه و صادقانهٔ حوزه‌های خدمات (placeholder).
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          _decoIcon(Icons.home_outlined),
                          const SizedBox(width: 12),
                          _decoIcon(Icons.cleaning_services_outlined),
                          const SizedBox(width: 12),
                          _decoIcon(Icons.build_outlined),
                        ],
                      ),
                      const SizedBox(height: 14),
                      const Row(
                        children: <Widget>[
                          Icon(
                            Icons.verified_user,
                            size: 16,
                            color: AppColors.teal,
                          ),
                          SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              AppStrings.securityNote,
                              textAlign: TextAlign.center,
                              style: TextStyle(
                                fontSize: 11,
                                color: AppColors.textMuted,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _decoIcon(IconData icon) {
    return Container(
      width: 40,
      height: 40,
      decoration: const BoxDecoration(
        color: AppColors.fieldBackground,
        shape: BoxShape.circle,
      ),
      alignment: Alignment.center,
      child: Icon(icon, size: 20, color: AppColors.teal.withAlpha(190)),
    );
  }
}
