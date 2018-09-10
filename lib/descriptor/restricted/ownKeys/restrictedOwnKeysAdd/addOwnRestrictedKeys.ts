import { basename } from 'path';

import { _restrictedKeys, _restrictedOwnKeys } from '../../../../symbols';
import { getUniqueArrayItems, validateArray } from '../../../../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;

export default function addOwnRestrictedKeys(inputArray: string[] = []): {} {
  validateArray(filename, 'inputArray', inputArray);
  const restrictedKeys = [...this[_restrictedKeys](), ...this[_restrictedOwnKeys]];
  getUniqueArrayItems(inputArray).forEach(
    (input): void => {
      if (!restrictedKeys.includes(input)) {
        // inline mutation of closure "restrictedOwnKeys"
        this[_restrictedOwnKeys].push(input);
      }
    }
  );
  return this;
}
