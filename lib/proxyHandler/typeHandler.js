import { _restrictedKeys } from '../symbols';

export default function TypeHandler(prototype = {}, source) {
  const restrictedKeys = prototype[_restrictedKeys]
    ? prototype[_restrictedKeys]()
    : Object.keys(source);
  return {
    get(target, key, context) {
      return restrictedKeys.includes(key)
        ? undefined
        : Reflect.get(target, key, context);
    },
    set(target, key, value, context) {
      // prevent setting a property that exists in restrictFields (prototype-chain)

      if (restrictedKeys.includes(key)) {
        throw new Error(`the key "${key}" is restricted and cannot be set`);
      } else {
        return Reflect.set(target, key, value, context);
      }
    },
    ownKeys(target) {
      return Reflect.ownKeys(target).filter(
        key => !restrictedKeys.includes(key)
      );
    },
  };
}
