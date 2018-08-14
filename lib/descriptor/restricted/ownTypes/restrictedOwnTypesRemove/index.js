import path from 'path';

import removeOwnRestrictedTypes from './removeOwnRestrictedTypes';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnTypesRemove } from '../../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `removing own restrictedTypes`;

export default function RestrictedOwnTypesRemove(
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) {
  return {
    [_restrictedOwnTypesRemove]: {
      enumerable: false,
      configurable: false,
      writable: false,
      value: new Proxy(
        removeOwnRestrictedTypes,
        LogHandler(message, caller, subject)
      ),
    },
  };
}
