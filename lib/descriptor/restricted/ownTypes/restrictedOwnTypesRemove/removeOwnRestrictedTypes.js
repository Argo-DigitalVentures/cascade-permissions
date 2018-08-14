import path from 'path';

import { _restrictedOwnTypes } from '../../../../symbols';
import { getUniqueSymbols, validateArray } from '../../../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;

export default function removeOwnRestrictedTypes(inputArray = []) {
  validateArray(filename, 'inputArray', inputArray);
  const ownRestrictedTypes = this[_restrictedOwnTypes];

  getUniqueSymbols(inputArray).forEach(input => {
    const index = ownRestrictedTypes.findIndex(symbol => symbol === input);
    if (index !== -1) {
      // inline mutation of closure "restrictedOwnTypes"
      symbols.splice(index, 1);
    }
  });
  return this;
}
