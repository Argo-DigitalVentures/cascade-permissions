import path from 'path';

import { _restrictedOwnKeys } from '../../../../symbols';
import { getUniqueArrayItems } from '../../../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;

export default function removeOwnRestrictedKeys(inputArray) {
  validateArray(filename, 'inputArray', inputArray);
  const ownRestrictedKeys = this[_restrictedOwnKeys];
  getUniqueArrayItems(inputArray).forEach(input => {
    const index = ownRestrictedKeys.findIndex(field => field === input);
    if (index !== -1) {
      // inline mutation of closure "restrictedOwnKeys"
      keys.splice(index, 1);
    }
  });
  return this;
}
