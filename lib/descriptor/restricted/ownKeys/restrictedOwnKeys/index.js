import path from 'path';

import getOwnRestrictedKeys from './getOwnRestrictedKeys';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnKeys } from '../../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "restrictedOwnKeys" method`;

export default function RestrictedOwnKeys(
  restrictedOwnKeys = [],
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
) {
  return {
    [_restrictedOwnKeys]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(getOwnRestrictedKeys(restrictedOwnKeys), LogHandler(message, caller, subject, { verbose: true })),
    },
  };
}
