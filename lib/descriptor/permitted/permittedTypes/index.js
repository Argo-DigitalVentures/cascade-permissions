import path from 'path';

import getPermittedTypes from './getPermittedTypes';
import { LogHandler } from '../../../proxyHandler';
import { _permittedTypes } from '../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "permittedTypes" method`;

export default function PermittedTypes(
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) {
  return {
    // gathers the all permitted keys in the prototype chain
    [_permittedTypes]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        getPermittedTypes,
        LogHandler(message, caller, subject, { verbose: true })
      ),
    },
  };
}
