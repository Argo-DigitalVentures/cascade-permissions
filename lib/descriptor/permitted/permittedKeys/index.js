import path from 'path';

import { LogHandler } from '../../../proxyHandler';
import getPermittedKeys from './getPermittedKeys';
import { _permittedKeys } from '../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "_permittedKeys" method`;

export default function PermittedKeys(
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) {
  return {
    // gathers the all permitted keys in the prototype chain
    [_permittedKeys]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        getPermittedKeys,
        LogHandler(message, caller, subject, { verbose: true })
      ),
    },
  };
}
