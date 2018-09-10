import { basename } from 'path';

import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../../compiler/interfaces';
import { LoggerSignature } from '../../../../compiler/types';
import { LogHandler } from '../../../proxyHandler';
import { _permittedKeys } from '../../../symbols';
import getPermittedKeys from './getPermittedKeys';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "_permittedKeys" method';

const PermittedKeys: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<() => string[]>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) => ({
  // gathers the all permitted keys in the prototype chain
  [_permittedKeys]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(getPermittedKeys, LogHandler(message, caller, subject)),
    writable: false,
  },
});

export default PermittedKeys;
