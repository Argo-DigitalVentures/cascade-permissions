import path from 'path';

import addOwnRestrictedTypes from './addOwnRestrictedTypes';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnTypesAdd } from '../../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `adding own restrictedTypes`;

export default function RestrictedOwnTypesAdd(message = 'no message received', caller = defaultCaller, subject = defaultSubject) {
  return {
    [_restrictedOwnTypesAdd]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(addOwnRestrictedTypes, LogHandler(message, caller, subject)),
    },
  };
}
