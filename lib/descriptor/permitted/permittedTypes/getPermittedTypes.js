import path from 'path';

import { isPrecededByGlobalObject, validateArray } from '../../../util';
import * as appSymbols from '../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const { _restrictedTypes } = appSymbols;

export default function getPermittedTypes(inputArray = []) {
  validateArray(filename, 'inputArray', inputArray);

  if (isPrecededByGlobalObject(this, true)) {
    return inputArray;
  } else {
    const results = getPermittedTypes.call(Object.getPrototypeOf(this), Object.getOwnPropertySymbols(this));
    // get the restrictedList after the recursive-call
    const restrictedTypes = [...(this[_restrictedTypes] ? this[_restrictedTypes]() : []), ...Object.values(appSymbols)];

    return results.filter(type => !restrictedTypes.includes(type));
  }
}
