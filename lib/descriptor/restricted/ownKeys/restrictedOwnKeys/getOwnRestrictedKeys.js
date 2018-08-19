import { _restrictedKeys } from '../../../../symbols';
import { getUniqueArrayItems, isObject } from '../../../../util';

export default function getOwnRestrictedKeys(restrictedOwnKeys = []) {
  const restrictedKeys = this && this[_restrictedKeys] ? this[_restrictedKeys]() : [];
  if (isObject(restrictedOwnKeys)) {
    return restrictedKeys;
  }
  return getUniqueArrayItems(restrictedOwnKeys).filter(key => !restrictedKeys.includes(key));
}
