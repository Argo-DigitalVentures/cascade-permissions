import { basename } from 'path';

import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../../../compiler/interfaces';
import { LoggerSignature } from '../../../../../compiler/types';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnKeysAdd } from '../../../../symbols';
import addOwnRestrictedKeys from './addOwnRestrictedKeys';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'adding own restrictedKeys';

const RestrictedOwnKeysAdd: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<() => {}>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { color: 'red', bold: true }
) => ({
  [_restrictedOwnKeysAdd]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(addOwnRestrictedKeys, LogHandler(message, caller, subject, chalkConfig)),
    writable: false,
  },
});

export default RestrictedOwnKeysAdd;
