import path from 'path';

import getOwnRestrictedTypes from './getOwnRestrictedTypes';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnTypes } from '../../../../symbols';
import { validateArray } from '../../../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "restrictedOwnTypes" method`;

export default function RestrictedOwnTypes(
  restrictedOwnTypes = [],
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) {
  // only allow unique symbols during inheritance
  // store the unique symbols via closure
  // this list will not change
  // prevents child from setting restrictedOwnTypes if the prototype already has it set
  // needs to be dynamic because the prototype chain may be updated

  validateArray(filename, 'restrictedOwnTypes', restrictedOwnTypes);
  return {
    [_restrictedOwnTypes]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        getOwnRestrictedTypes(restrictedOwnTypes),
        LogHandler(message, caller, subject)
      ),
    },
  };
}
