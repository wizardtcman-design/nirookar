import 'package:flutter/material.dart';

import '../../core/strings/app_strings.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_theme.dart';

/// فیلد ورودی استاندارد نیروکار.
///
/// برچسب بالای فیلد قرار می‌گیرد (نه شناور)، محتوای فیلد LTR است (مناسب
/// ایمیل، شماره موبایل و رمز عبور) و برای رمز عبور کلید نمایش/پنهان‌سازی
/// دارد. پارامترهای رنگی امکان استفاده روی سطوح تیره (کارت نصاب) را می‌دهند.
class AppTextField extends StatefulWidget {
  const AppTextField({
    super.key,
    required this.controller,
    required this.label,
    this.hint,
    this.icon,
    this.isPassword = false,
    this.validator,
    this.textInputAction,
    this.keyboardType,
    this.fillColor = AppColors.card,
    this.labelColor = AppColors.textPrimary,
    this.textColor = AppColors.textPrimary,
    this.hintColor = AppColors.textMuted,
    this.iconColor = AppColors.textMuted,
    this.borderColor = AppColors.slate200,
  });

  final TextEditingController controller;
  final String label;
  final String? hint;
  final IconData? icon;
  final bool isPassword;
  final FormFieldValidator<String>? validator;
  final TextInputAction? textInputAction;
  final TextInputType? keyboardType;
  final Color fillColor;
  final Color labelColor;
  final Color textColor;
  final Color hintColor;
  final Color iconColor;
  final Color borderColor;

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  bool _obscured = true;

  OutlineInputBorder _border(Color color) {
    return OutlineInputBorder(
      borderRadius: BorderRadius.circular(14),
      borderSide: BorderSide(color: color),
    );
  }

  @override
  Widget build(BuildContext context) {
    final IconData? leadingIcon = widget.icon;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        Text(
          widget.label,
          style: TextStyle(
            fontSize: 13,
            fontWeight: FontWeight.w600,
            color: widget.labelColor,
            fontFamily: AppTheme.fontFamily,
          ),
        ),
        const SizedBox(height: 8),
        TextFormField(
          controller: widget.controller,
          validator: widget.validator,
          obscureText: widget.isPassword && _obscured,
          autocorrect: false,
          textDirection: TextDirection.ltr,
          keyboardType: widget.keyboardType,
          textInputAction: widget.textInputAction,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: widget.textColor,
            fontFamily: AppTheme.fontFamily,
          ),
          cursorColor: AppColors.teal,
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: TextStyle(
              fontSize: 12,
              color: widget.hintColor,
              fontFamily: AppTheme.fontFamily,
            ),
            prefixIcon: leadingIcon == null
                ? null
                : Icon(leadingIcon, size: 20, color: widget.iconColor),
            suffixIcon: widget.isPassword
                ? IconButton(
                    onPressed: () {
                      setState(() {
                        _obscured = !_obscured;
                      });
                    },
                    tooltip: AppStrings.togglePasswordVisibility,
                    icon: Icon(
                      _obscured
                          ? Icons.visibility_outlined
                          : Icons.visibility_off_outlined,
                      size: 20,
                      color: widget.iconColor,
                    ),
                  )
                : null,
            filled: true,
            fillColor: widget.fillColor,
            contentPadding:
                const EdgeInsets.symmetric(horizontal: 14, vertical: 15),
            enabledBorder: _border(widget.borderColor),
            focusedBorder: _border(AppColors.teal),
            errorBorder: _border(AppColors.error),
            focusedErrorBorder: _border(AppColors.error),
            errorStyle: TextStyle(
              fontSize: 11,
              height: 1.3,
              color: AppColors.error,
              fontFamily: AppTheme.fontFamily,
            ),
          ),
        ),
      ],
    );
  }
}
