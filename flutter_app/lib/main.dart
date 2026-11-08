import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import 'app.dart';

/// نقطهٔ ورود اپلیکیشن نیروکار.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await SystemChrome.setPreferredOrientations(<DeviceOrientation>[
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  runApp(const NirooKarApp());
}
