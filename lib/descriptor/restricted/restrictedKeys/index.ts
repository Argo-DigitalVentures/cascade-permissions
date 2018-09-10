import { basename } from 'path';

import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../../compiler/interfaces';
import { LoggerSignature, RestrictedKeysType } from '../../../../compiler/types';
import { LogHandler } from '../../../proxyHandler';
import { _restrictedKeys } from '../../../symbols';
import getRestrictedKeys from './getRestrictedKeys';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "restrictedKeys" method';

const RestrictedKeys: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<RestrictedKeysType>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { color: 'red', bold: true }
) => ({
  // gathers all the restricted instance keys on the prototype chain
  [_restrictedKeys]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(getRestrictedKeys, LogHandler(message, caller, subject, chalkConfig)),
    writable: false,
  },
});

export default RestrictedKeys;
