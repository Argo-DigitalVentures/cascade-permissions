import path from 'path';

import getRestrictedTypes from './getRestrictedTypes';
import { LogHandler } from '../../../proxyHandler';
import { _restrictedTypes } from '../../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "_restrictedTypes" method`;

export default function RestrictedTypes(message = 'no message received', caller = defaultCaller, subject = defaultSubject) {
  return {
    // gathers all the restricted instance keys on the prototype chain
    [_restrictedTypes]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(getRestrictedTypes, LogHandler(message, caller, subject, { verbose: true })),
    },
  };
}
