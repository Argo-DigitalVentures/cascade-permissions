import { isPrecededByGlobalObject } from '../../../util';
import { _restrictedKeys } from '../../../symbols';

export default function getPermittedValues(inputData = {}) {
  // Only want the baseObj's properties and its descendants
  // No point of getting the global "Object's properties"
  if (isPrecededByGlobalObject(this, true)) {
    return inputData;
  } else {
    const results = Object.entries(
      getPermittedValues.call(Object.getPrototypeOf(this), this)
    );
    // get the restrictedList after the recursive-call
    const restrictedKeys = this[_restrictedKeys] ? this[_restrictedKeys]() : [];
    return results.reduce((col, [key, value]) => {
      if (!restrictedKeys.includes(key)) {
        col[key] = value;
      }
      return col;
    }, {});
  }
}
