import { basename } from 'path';
import { RestrictedTypesSignature } from '../../../../compiler/types';
import * as appSymbols from '../../../symbols';
import { isPrecededByGlobalObject, validateArray } from '../../../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const { _restrictedTypes } = appSymbols;

const getPermittedTypes: RestrictedTypesSignature = (inputArray = []) => {
  validateArray(filename, 'inputArray', inputArray);
  if (isPrecededByGlobalObject(this, true)) {
    return inputArray;
  } else {
    const results = getPermittedTypes.call(Object.getPrototypeOf(this), Object.getOwnPropertySymbols(this));
    // get the restrictedList after the recursive-call
    const restrictedTypes = [...(this[_restrictedTypes] ? this[_restrictedTypes]() : []), ...Object.values(appSymbols)];

    return results.filter((type: symbol) => !restrictedTypes.includes(type));
  }
};

export default getPermittedTypes;
