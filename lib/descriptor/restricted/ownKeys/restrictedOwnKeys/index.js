import path from 'path';

import getOwnRestrictedKeys from './getOwnRestrictedKeys';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnKeys } from '../../../../symbols';
import { validateArray } from '../../../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "restrictedOwnKeys" method`;

export default function RestrictedOwnKeys(
  restrictedOwnKeys = [],
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) {
  validateArray(filename, 'restrictedOwnKeys', restrictedOwnKeys);
  return {
    [_restrictedOwnKeys]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        getOwnRestrictedKeys(restrictedOwnKeys),
        LogHandler(message, caller, subject, { verbose: true })
      ),
    },
  };
}
