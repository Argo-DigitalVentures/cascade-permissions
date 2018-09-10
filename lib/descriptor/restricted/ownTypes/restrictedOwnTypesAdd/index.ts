import { basename } from 'path';

import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../../../compiler/interfaces';
import { LoggerSignature } from '../../../../../compiler/types';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnTypesAdd } from '../../../../symbols';
import addOwnRestrictedTypes from './addOwnRestrictedTypes';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'adding own restrictedTypes';

const RestrictedOwnTypesAdd: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<() => {}>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { color: 'red', bold: true }
) => ({
  [_restrictedOwnTypesAdd]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(addOwnRestrictedTypes, LogHandler(message, caller, subject, chalkConfig)),
    writable: false,
  },
});

export default RestrictedOwnTypesAdd;
