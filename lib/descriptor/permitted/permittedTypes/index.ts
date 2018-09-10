import { basename } from 'path';

import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../../compiler/interfaces';
import { LoggerSignature, RestrictedTypesSignature } from '../../../../compiler/types';
import { LogHandler } from '../../../proxyHandler';
import { _permittedTypes } from '../../../symbols';
import getPermittedTypes from './getPermittedTypes';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "permittedTypes" method';

const PermittedTypes: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<RestrictedTypesSignature>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) => ({
  // gathers the all permitted keys in the prototype chain
  [_permittedTypes]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(getPermittedTypes, LogHandler(message, caller, subject)),
    writable: false,
  },
});

export default PermittedTypes;
