import { TypeHandler } from '../proxyHandler';
import { symbolize } from '../util';

export default function TypeWrapper(Permissions, permissionListType = 'types') {
  return function WrapTarget(target, type, obj) {
    return new Proxy(
      obj,
      TypeHandler(
        Permissions[symbolize(target)] &&
        Permissions[symbolize(target)][symbolize(permissionListType)] &&
        Permissions[symbolize(target)][symbolize(permissionListType)][symbolize(type)]
          ? Permissions[symbolize(target)][symbolize(permissionListType)][symbolize(type)]
          : undefined,
      ),
    );
  };
}
