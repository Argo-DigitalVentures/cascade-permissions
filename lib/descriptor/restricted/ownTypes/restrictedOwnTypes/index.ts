import { basename } from 'path';

import { RestrictedLoggerSignature, RestrictedTypesType } from '../../../../../compiler/types';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnTypes } from '../../../../symbols';
import getOwnRestrictedTypes from './getOwnRestrictedTypes';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "restrictedOwnTypes" method';

const RestrictedOwnTypes: RestrictedLoggerSignature<RestrictedTypesType> = (
  restrictedOwnTypes = [],
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { color: 'red', bold: true }
) => {
  // only allow unique symbols during inheritance
  // store the unique symbols via closure
  // this list will not change
  // prevents child from setting restrictedOwnTypes if the prototype already has it set
  // needs to be dynamic because the prototype chain may be updated

  return {
    [_restrictedOwnTypes]: {
      configurable: false,
      enumerable: false,
      value: new Proxy(getOwnRestrictedTypes(restrictedOwnTypes), LogHandler(message, caller, subject, chalkConfig)),
      writable: false,
    },
  };
};

export default RestrictedOwnTypes;
