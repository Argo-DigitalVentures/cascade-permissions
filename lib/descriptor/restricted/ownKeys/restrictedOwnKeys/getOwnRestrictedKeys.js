import path from 'path';

import { _restrictedKeys } from '../../../../symbols';
import { getUniqueArrayItems, validateArray } from '../../../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;

export default function getOwnRestrictedKeys(restrictedOwnKeys = []) {
  validateArray(filename, 'restrictedOwnKeys', restrictedOwnKeys);
  const restrictedKeys =
    this && this[_restrictedKeys] ? this[_restrictedKeys]() : [];
  return getUniqueArrayItems(restrictedOwnKeys).filter(
    key => !restrictedKeys.includes(key)
  );
}
