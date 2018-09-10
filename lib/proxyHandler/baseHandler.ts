/* eslint-disable no-unused-vars */

import { basename } from 'path'
import * as appSymbols from '../symbols';
import { getPrototypeFromKey, isSymbol } from '../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'baseHandler call';

export default function BaseHandler(message, caller = defaultCaller, subject = defaultSubject) {
  const { _restrictedKeys, _restrictedTypes } = appSymbols;
  return {
    get(target, key, context) {
      if (isSymbol(key)) {
        if (Object.values(appSymbols).includes(key)) {
          return Reflect.get(target, key, context);
        } else {
          const isOwnTypes = [...target[_restrictedTypes](), ...context[_restrictedTypes]()].includes(key);

          return isOwnTypes ? undefined : Reflect.get(target, key, context);
        }
      } else {
        const prototypeRestrictedKeys = target[appSymbols._restrictedKeys]([]);
        return prototypeRestrictedKeys.includes(key) ? undefined : Reflect.get(getPrototypeFromKey.call(target, key) || target, key, context);
      }
    },
    ownKeys(target) {
      const restrictedKeys = target[_restrictedKeys]();
      const restrictedTypes = target[_restrictedTypes]();

      const ownKeys = Reflect.ownKeys(target);
      const results = ownKeys.filter(key => !restrictedKeys.includes(key));
      // console.log('ownKeys: restrictedKeys', restrictedKeys);
      // console.log('ownKeys: restrictedTypes', restrictedTypes);
      // console.log('ownKeys: ownKeys', ownKeys);
      // console.log('ownKeys: filteredKeys', results);
      return results;
    },
    set(target, key, value, context) {
      // prevent setting a property that exists in restrictFields (prototype-chain)
      const isRestrictedKey = target[_restrictedKeys]([]).includes(key);

      if (isRestrictedKey) {
        throw new Error(`the key "${key}" is restricted and cannot be set`);
      } else {
        return Reflect.set(target, key, value, context);
      }
    },
  };
}

/* eslint-enable */
