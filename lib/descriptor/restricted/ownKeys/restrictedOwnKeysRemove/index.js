import path from 'path';

import removeOwnRestrictedKeys from './removeOwnRestrictedKeys';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnKeysRemove } from '../../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `removing own restrictedKeys`;

export default function RestrictedOwnKeysRemove(message = 'no message received', caller = defaultCaller, subject = defaultSubject) {
  return {
    [_restrictedOwnKeysRemove]: {
      enumerable: false,
      configurable: false,
      writable: false,
      value: new Proxy(removeOwnRestrictedKeys, LogHandler(message, caller, subject)),
    },
  };
}
