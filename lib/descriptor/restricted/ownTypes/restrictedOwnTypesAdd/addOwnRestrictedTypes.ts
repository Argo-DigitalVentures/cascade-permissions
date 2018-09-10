import { basename } from 'path';

import { _restrictedOwnTypes, _restrictedTypes } from '../../../../symbols';
import { getUniqueArrayItems, validateArray } from '../../../../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;

export default function addOwnRestrictedTypes(inputArray = []) {
  validateArray(filename, 'inputArray', inputArray);
  const restrictedTypes = this[_restrictedTypes]();
  getUniqueArrayItems(inputArray).forEach(input => {
    if (!restrictedTypes.includes(input)) {
      // inline mutation of closure "restrictedOwnTypes"
      this[_restrictedOwnTypes].push(input);
    }
  });
  return this;
}
