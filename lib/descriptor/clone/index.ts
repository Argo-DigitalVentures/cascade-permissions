import { basename } from 'path';
import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../compiler/interfaces';
import { LoggerSignature, Signature } from '../../../compiler/types';
import { LogHandler } from '../../proxyHandler';
import { _clone } from '../../symbols';
import CloneDescriptors from './cloneDescriptors';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = '"calling _clone" method';

const Clone: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<Signature>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { bold: true, color: 'blue' }
) => ({
  [_clone]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(CloneDescriptors, LogHandler(message, caller, subject, chalkConfig)),
    writable: false,
  },
});

export default Clone;
