import { basename } from 'path';

import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../../compiler/interfaces';
import { LoggerSignature } from '../../../../compiler/types';
import { LogHandler } from '../../../proxyHandler';
import { _permittedValues } from '../../../symbols';
import getPermittedValues from './getPermittedValues';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "permittedKeys" method';

const PermittedValues: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<() => {}>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) => ({
  // gathers all the key/value keys in the prototype chain
  [_permittedValues]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(getPermittedValues, LogHandler(message, caller, subject)),
    writable: false,
  },
});

export default PermittedValues;
