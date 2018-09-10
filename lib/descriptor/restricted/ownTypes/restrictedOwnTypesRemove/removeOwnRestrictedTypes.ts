import { basename } from 'path';

import { _restrictedOwnTypes } from '../../../../symbols';
import { getUniqueArrayItems, validateArray } from '../../../../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;

export default function removeOwnRestrictedTypes(inputArray: symbol[] = []): {} {
  validateArray(filename, 'inputArray', inputArray);
  const ownRestrictedTypes = this[_restrictedOwnTypes];

  getUniqueArrayItems(inputArray).forEach(input => {
    const index = ownRestrictedTypes.findIndex((item: symbol) => item === input);
    if (index !== -1) {
      // inline mutation of closure "restrictedOwnTypes"
      ownRestrictedTypes.splice(index, 1);
    }
  });
  return this;
}
