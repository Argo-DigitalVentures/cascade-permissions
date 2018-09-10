import { basename } from 'path';

import { _restrictedOwnKeys } from '../../../../symbols';
import { getUniqueArrayItems, validateArray } from '../../../../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;

export default function removeOwnRestrictedKeys(inputArray: string[]): {} {
  validateArray(filename, 'inputArray', inputArray);
  const ownRestrictedKeys = this[_restrictedOwnKeys];
  getUniqueArrayItems(inputArray).forEach(
    (input): void => {
      const index = ownRestrictedKeys.findIndex((field: string) => field === input);
      if (index !== -1) {
        // inline mutation of closure "restrictedOwnKeys"
        ownRestrictedKeys.splice(index, 1);
      }
    }
  );
  return this;
}
