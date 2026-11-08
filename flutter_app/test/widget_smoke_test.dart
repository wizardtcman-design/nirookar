import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:nirookar/app.dart';

void main() {
  Future<void> setUpViewport(WidgetTester tester) async {
    tester.view.physicalSize = const Size(800, 1800);
    tester.view.devicePixelRatio = 2.0;
    addTearDown(tester.view.reset);
  }

  testWidgets('خانه نقش‌ها را نشان می‌دهد و به ورود مشتری می‌رود',
      (WidgetTester tester) async {
    await setUpViewport(tester);

    await tester.pumpWidget(const NirooKarApp());
    await tester.pumpAndSettle();

    expect(find.text('خوش آمدید'), findsWidgets);
    expect(find.text('ورود مشتری'), findsOneWidget);
    expect(find.text('ورود نصاب'), findsOneWidget);
    expect(find.text('ورود فروشگاه'), findsOneWidget);

    await tester.tap(find.text('ورود مشتری'));
    await tester.pumpAndSettle();

    expect(find.text('ورود به حساب مشتری'), findsOneWidget);
  });

  testWidgets('ورود حرفه‌ای‌ها هر دو کارت نصاب و فروشگاه را دارد',
      (WidgetTester tester) async {
    await setUpViewport(tester);

    await tester.pumpWidget(const NirooKarApp());
    await tester.pumpAndSettle();

    await tester.tap(find.text('ورود نصاب'));
    await tester.pumpAndSettle();

    expect(find.text('ورود به پنل نصاب'), findsOneWidget);
    expect(find.text('ورود به پنل فروشگاه'), findsOneWidget);
  });
}
