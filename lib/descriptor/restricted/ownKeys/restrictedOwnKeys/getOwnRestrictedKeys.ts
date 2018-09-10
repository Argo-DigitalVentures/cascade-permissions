import { RestrictedKeysSignature } from '../../../../../compiler/types';
import { _restrictedKeys } from '../../../../symbols';
import { getUniqueArrayItems, isObject } from '../../../../util';

const getOwnRestrictedKeys: RestrictedKeysSignature = restrictedOwnKeys => {
  const restrictedKeys = this && this[_restrictedKeys] ? this[_restrictedKeys]() : [];
  if (isObject(restrictedOwnKeys)) {
    return restrictedKeys;
    // return restrictedOwnKeys;
  }
  return getUniqueArrayItems(restrictedOwnKeys).filter((key): key is string => !restrictedKeys.includes(key));
};

export default getOwnRestrictedKeys;
