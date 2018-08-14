import path from 'path';

import { _restrictedTypes, _restrictedOwnTypes } from '../../../../symbols';
import { getUniqueSymbols, validateArray } from '../../../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;

export default function addOwnRestrictedTypes(inputArray = []) {
  validateArray(filename, 'inputArray', inputArray);
  const restrictedTypes = this[_restrictedTypes]();
  getUniqueSymbols(inputArray).forEach(input => {
    if (!restrictedTypes.includes(input)) {
      // inline mutation of closure "restrictedOwnTypes"
      this[_restrictedOwnTypes].push(input);
    }
  });
  return this;
}
