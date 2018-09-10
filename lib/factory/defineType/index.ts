import { basename } from 'path';
import { PropertyDescriptorInterface, SymbolizedInterface } from '../../../compiler/interfaces';
import { LoggerSignature, Signature } from '../../../compiler/types';
import { LogHandler } from '../../proxyHandler';
import { _defineType } from '../../symbols';
import recursiveDefineType from './recursiveDefineType';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "_defineType" method';

const DefineType: LoggerSignature<SymbolizedInterface<PropertyDescriptorInterface<Signature>>> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  loggerConfig = { bold: true, color: 'blue' }
) => ({
  [_defineType]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(recursiveDefineType, LogHandler(message, caller, subject, loggerConfig)),
    writable: false,
  },
});

export default DefineType;
