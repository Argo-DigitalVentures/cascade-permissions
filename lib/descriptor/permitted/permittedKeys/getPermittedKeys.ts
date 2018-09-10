import { _restrictedKeys } from '../../../symbols';
import { isPrecededByGlobalObject } from '../../../util';


export default function getPermittedKeys(inputArray: string[] = []): string[] {
  // go up the prototype-chain and collect all the restrictedKeys
  // restrictedKeys will include restrictedKeys from the "_previous" key
  // filter the Object.keys with the prototype-chain restricedFields

  if (isPrecededByGlobalObject(this, true)) {
    return inputArray;
  } else {
    const results = getPermittedKeys.call(Object.getPrototypeOf(this), Object.keys(this));
    // get the restrictedList after the recursive-call
    const restrictedKeys = this[_restrictedKeys] ? this[_restrictedKeys]() : [];

    return results.filter((key: string) => !restrictedKeys.includes(key));
  }
}
