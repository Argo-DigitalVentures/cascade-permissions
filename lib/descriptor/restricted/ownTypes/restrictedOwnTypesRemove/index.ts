import { basename } from 'path';

import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../../../compiler/interfaces';
import { LoggerSignature } from '../../../../../compiler/types';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnTypesRemove } from '../../../../symbols';
import removeOwnRestrictedTypes from './removeOwnRestrictedTypes';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'removing own restrictedTypes';

const RestrictedOwnTypesRemove: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<() => {}>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) => ({
  [_restrictedOwnTypesRemove]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(removeOwnRestrictedTypes, LogHandler(message, caller, subject)),
    writable: false,
  },
});

export default RestrictedOwnTypesRemove;
