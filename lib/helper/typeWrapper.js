import { symbolize } from '../util';
import { TypeHandler } from '../proxyHandler';

export default function TypeWrapper(Permissions, permissionListType = 'types') {
  return function(target, type, obj) {
    const targetPermissions = Permissions[symbolize(target)];
    if (!targetPermissions) {
      return new Proxy(obj, TypeHandler());
    }
    const permissionLists = targetPermissions[symbolize(permissionListType)];
    const permissionList = permissionLists[symbolize(type)];
    if (!permissionList) {
      return new Proxy(obj, TypeHandler());
    } else {
      return new Proxy(obj, TypeHandler(permissionList));
    }
  };
}
