import path from 'path';

import getPermittedValues from './getPermittedValues';
import { LogHandler } from '../../../proxyHandler';
import { _permittedValues } from '../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "permittedKeys" method`;

export default function PermittedValues(
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) {
  return {
    // gathers all the key/value keys in the prototype chain
    [_permittedValues]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        getPermittedValues,
        LogHandler(message, caller, subject, { verbose: true })
      ),
    },
  };
}
