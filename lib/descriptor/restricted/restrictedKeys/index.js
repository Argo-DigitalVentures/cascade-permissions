import path from 'path';

import { LogHandler } from '../../../proxyHandler';
import getRestrictedKeys from './getRestrictedKeys';
import { _restrictedKeys } from '../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "restrictedKeys" method`;

export default function RestrictedKeys(
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) {
  return {
    // gathers all the restricted instance keys on the prototype chain
    [_restrictedKeys]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        getRestrictedKeys,
        LogHandler(message, caller, subject, { verbose: true })
      ),
    },
  };
}
