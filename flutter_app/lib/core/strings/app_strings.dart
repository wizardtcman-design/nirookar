/// تمام رشته‌های فارسی برنامه در یک نقطه متمرکز شده‌اند.
///
/// هیچ ویجتی نباید متن فارسی را inline بنویسد؛ برای افزودن زبان تازه در
/// آینده کافی است این کلاس به‌سادگی به یک delegate/ARB تبدیل شود.
abstract final class AppStrings {
  // ——— برند ———
  static const String appName = 'نیروکار';
  static const String appTagline = 'بازار خدمات فنی و نصب';

  // ——— خانه ———
  static const String homeWelcome = 'خوش آمدید';
  static const String homeSubtitle = 'لطفاً نقش خود را برای ورود انتخاب کنید';

  // ——— نقش مشتری ———
  static const String roleCustomerTitle = 'ورود مشتری';
  static const String roleCustomerSubtitle = 'دسترسی به خدمات و سفارش‌ها';
  static const String roleCustomerSubmit = 'ورود به حساب مشتری';
  static const String roleCustomerIdentifierLabel = 'ایمیل یا شماره موبایل';
  static const String roleCustomerIdentifierHint =
      'example@email.com یا 09xxxxxxxxx';
  static const String customerLoginIntro =
      'برای ورود لطفاً اطلاعات خود را وارد کنید.';

  // ——— نقش نصاب ———
  static const String roleInstallerTitle = 'ورود نصاب';
  static const String roleInstallerSubtitle = 'برای متخصصان و نصابان';
  static const String roleInstallerSubmit = 'ورود به پنل نصاب';
  static const String roleInstallerIdentifierLabel = 'شماره موبایل';
  static const String roleInstallerIdentifierHint = '09xxxxxxxxx';

  // ——— نقش فروشگاه ———
  static const String roleShopTitle = 'ورود فروشگاه';
  static const String roleShopSubtitle = 'مدیریت فروشگاه و محصولات';
  static const String roleShopSubmit = 'ورود به پنل فروشگاه';
  static const String roleShopIdentifierLabel = 'شماره موبایل';
  static const String roleShopIdentifierHint = '09xxxxxxxxx';

  // ——— فرم ———
  static const String passwordLabel = 'رمز عبور';
  static const String passwordHint = 'رمز عبور خود را وارد کنید';
  static const String togglePasswordVisibility =
      'نمایش یا پنهان‌سازی رمز عبور';
  static const String back = 'بازگشت';
  static const String notifications = 'اعلان‌ها';

  // ——— خطاهای اعتبارسنجی ———
  static const String errRequired = 'این فیلد الزامی است';
  static const String errMobile = 'شماره موبایل معتبر نیست (مثال: 09123456789)';
  static const String errEmail = 'ایمیل معتبر نیست';
  static const String errIdentifier = 'ایمیل یا شماره موبایل معتبر وارد کنید';
  static const String errShortPassword = 'رمز عبور باید حداقل ۶ کاراکتر باشد';
  static const String unexpectedError = 'خطای غیرمنتظره رخ داد';

  // ——— پیام‌های صادقانهٔ فاز ۱ ———
  static const String honestNoticeTitle = 'نسخه اولیه (فاز ۱)';
  static const String honestNoticeBody =
      'اتصال به سرور هنوز فعال نیست. اعتبارسنجی فرم با موفقیت انجام شد و معماری اتصال به سرویس ورود آماده است.';
  static const String loginServiceDisabled =
      'اتصال به سرویس ورود در فاز ۱ فعال نیست';
  static const String comingSoon = 'این بخش در فازهای بعدی فعال می‌شود';
  static const String notifDisabled =
      'اعلان‌ها در نسخه‌های بعدی فعال می‌شود';

  // ——— ناوبری ———
  static const String navHome = 'خانه';
  static const String navGuide = 'راهنما';
  static const String navAbout = 'درباره ما';

  // ——— ورود حرفه‌ای‌ها ———
  static const String professionalWelcome = 'به اپلیکیشن خوش آمدید';
  static const String professionalSubtitle =
      'لطفاً نوع ورود خود را انتخاب کنید';
  static const String forgotPassword = 'رمز عبور خود را فراموش کردید؟';
  static const String forgotPasswordShort = 'فراموشی رمز عبور';
  static const String registerNew = 'ثبت‌نام مشتری جدید';
  static const String securityNote =
      'امن و مطمئن | حریم خصوصی شما برای ما مهم است';

  // ——— چیپ‌های ویژگی صفحهٔ حرفه‌ای‌ها ———
  static const String chip1SupportTitle = 'پشتیبانی تخصصی';
  static const String chip1SupportSub = 'همراه شما در هر زمان';
  static const String chip2Title = 'طراحی حرفه‌ای';
  static const String chip2Sub = 'تجربه کاری بهتر';
  static const String chip3Title = 'امن و مطمئن';
  static const String chip3Sub = 'ارتباط امن با سرور';

  // ——— راهنما ———
  static const String guideTitle = 'راهنما';
  static const String guideWhatTitle = 'نیروکار چیست؟';
  static const String guideIntro =
      'نیروکار یک بازار چندخدمتی فنی و نصب است که مرحله‌به‌مرحله و با شفافیت توسعه می‌یابد. در فاز نخست تنها ورود سه نقش مشتری، نصاب و فروشگاه فعال است و اتصال به سرویس‌های واقعی هنوز برقرار نشده است.';
  static const String guideUpcomingTitle = 'دسته‌بندی‌های پیش‌رو';
  static const String comingSoonChip = 'به‌زودی';
  static const String categoryDecorTitle = 'دکوراسیون داخلی و نصب';
  static const String categoryBuilderTitle = 'نصاب‌ها و متخصصان ساختمان';
  static const String categoryShopTitle = 'فروشگاه‌های محصولات ساختمانی';
  static const String categoryLogisticsTitle = 'وانت‌بار و حمل‌ونقل';
  static const String categoryRepairTitle = 'تعمیرات و خدمات منزل';

  // ——— درباره ما ———
  static const String aboutTitle = 'درباره ما';
  static const String aboutIntro =
      'نیروکار یک بازارگاه چندخدمتی برای خدمات فنی و نصب است که مرحله‌به‌مرحله توسعه می‌یابد؛ در این نسخه فقط جریان ورود نقش‌ها در دسترس است.';
  static const String aboutVersionLabel = 'نسخه محصول';
  static const String aboutPhaseLabel = 'فاز جاری';
  static const String aboutPlatformsLabel = 'پلتفرم‌ها';
  static const String aboutPlatformsValue = 'اندروید، iOS و وب';
}
