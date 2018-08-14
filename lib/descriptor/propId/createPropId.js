import { _propId } from '../../symbols';
import { symbolize } from '../../util';

export default function CreatePropId(name) {
  return {
    [_propId]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: symbolize(name),
    },
  };
}
