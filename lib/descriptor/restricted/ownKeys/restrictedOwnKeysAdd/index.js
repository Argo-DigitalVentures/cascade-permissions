import path from 'path';

import addOwnRestrictedKeys from './addOwnRestrictedKeys';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnKeysAdd } from '../../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `adding own restrictedKeys`;

export default function RestrictedOwnKeysAdd(
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  { color = 'red', bold = true } = {},
) {
  return {
    [_restrictedOwnKeysAdd]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(addOwnRestrictedKeys, LogHandler(message, caller, subject, { color, bold })),
    },
  };
}
