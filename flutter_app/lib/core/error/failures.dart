/// خطاهای دامنهٔ برنامه.
///
/// خطاها قرارداد مشترک لایهٔ data و presentation هستند؛ رابط کاربری موظف است
/// [PhaseNotImplementedFailure] را به‌صورت صادقانه و بدون وانمود کردن به
/// موفقیت به کاربر نمایش دهد.
class PhaseNotImplementedFailure implements Exception {
  /// پیام فارسی و قابل‌نمایش به کاربر.
  final String message;

  const PhaseNotImplementedFailure(this.message);

  @override
  String toString() => 'PhaseNotImplementedFailure: $message';
}
