import { _previous, _restrictedKeys, _restrictedOwnKeys } from '../../../symbols';
import { isPrecededByGlobalObject } from '../../../util';

export default function getRestrictedKeys(inputArray = []) {
  return isPrecededByGlobalObject(this)
    ? inputArray
    : getRestrictedKeys.call(Object.getPrototypeOf(this), [
        ...inputArray,
        ...(this[_previous] && this[_previous][_restrictedKeys] ? this[_previous][_restrictedKeys]() : []),
        ...(this[_restrictedOwnKeys] || []),
      ]);
}
