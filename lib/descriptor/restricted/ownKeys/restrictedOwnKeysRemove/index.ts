import { basename } from 'path';

import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../../../compiler/interfaces';
import { LoggerSignature } from '../../../../../compiler/types';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnKeysRemove } from '../../../../symbols';
import removeOwnRestrictedKeys from './removeOwnRestrictedKeys';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'removing own restrictedKeys';

const RestrictedOwnKeysRemove: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { color: 'red', bold: true }
) => ({
  [_restrictedOwnKeysRemove]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(removeOwnRestrictedKeys, LogHandler(message, caller, subject, chalkConfig)),
    writable: false,
  },
});

export default RestrictedOwnKeysRemove;
