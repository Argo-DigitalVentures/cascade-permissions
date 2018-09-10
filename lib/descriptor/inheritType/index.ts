import { basename } from 'path';
import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../compiler/interfaces';
import { LoggerSignature, SignaturePrototype } from '../../../compiler/types';
import { LogHandler } from '../../proxyHandler';
import { _inheritType } from '../../symbols';
import cloneChildDescriptors from './cloneChildDescriptors';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "inheritType" method';

const InheritType: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<SignaturePrototype>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { bold: true, color: 'blue' }
) => {
  return {
    [_inheritType]: {
      configurable: false,
      enumerable: false,
      value: new Proxy(cloneChildDescriptors, LogHandler(message, caller, subject, chalkConfig)),
      writable: false,
    },
  };
};

export default InheritType;
