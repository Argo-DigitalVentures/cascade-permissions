import {
  _previous,
  _restrictedOwnTypes,
  _restrictedTypes,
} from '../../../symbols';
import { isPrecededByGlobalObject } from '../../../util';

export default function getRestrictedTypes(inputArray = []) {
  return isPrecededByGlobalObject(this)
    ? inputArray
    : getRestrictedTypes.call(Object.getPrototypeOf(this), [
        ...inputArray,
        ...(this[_previous] && this[_previous][_restrictedTypes]
          ? this[_previous][_restrictedTypes]()
          : []),
        ...this[_restrictedOwnTypes],
      ]);
}
