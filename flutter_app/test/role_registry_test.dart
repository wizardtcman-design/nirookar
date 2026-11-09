import 'package:flutter_test/flutter_test.dart';
import 'package:nirookar/domain/models/role_registry.dart';

void main() {
  test('رجیستری دقیقاً سه نقش فعال با شناسهٔ یکتا دارد', () {
    expect(RoleRegistry.roles.length, 3);

    final Set<String> ids = RoleRegistry.roles.map((r) => r.id).toSet();
    expect(ids.length, 3);

    for (final role in RoleRegistry.roles) {
      expect(role.enabled, isTrue);
      expect(role.title, isNotEmpty);
      expect(role.submitLabel, isNotEmpty);
      expect(role.identifierLabel, isNotEmpty);
    }
  });

  test('byId نقش ثبت‌شده را پیدا و ناشناخته را null برمی‌گرداند', () {
    expect(RoleRegistry.byId('customer')?.id, 'customer');
    expect(RoleRegistry.byId('installer')?.id, 'installer');
    expect(RoleRegistry.byId('shop')?.id, 'shop');
    expect(RoleRegistry.byId('nope'), isNull);
  });
}
