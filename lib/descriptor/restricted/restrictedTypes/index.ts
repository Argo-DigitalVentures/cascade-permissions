import { basename } from 'path';

import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../../compiler/interfaces';
import { LoggerSignature } from '../../../../compiler/types';
import { LogHandler } from '../../../proxyHandler';
import { _restrictedTypes } from '../../../symbols';
import getRestrictedTypes from './getRestrictedTypes';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "_restrictedTypes" method';

const RestrictedTypes: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<() => {}>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { color: 'red', bold: true }
) => ({
  // gathers all the restricted instance keys on the prototype chain
  [_restrictedTypes]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(getRestrictedTypes, LogHandler(message, caller, subject, chalkConfig)),
    writable: false,
  },
});

export default RestrictedTypes;
