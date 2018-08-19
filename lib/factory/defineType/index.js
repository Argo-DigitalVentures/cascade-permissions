import path from 'path';

import { _defineType } from '../../symbols';
import { LogHandler } from '../../proxyHandler';
import recursiveDefineType from './recursiveDefineType';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "_defineType" method`;

export default function DefineType(message = 'no message received', caller = defaultCaller, subject = defaultSubject) {
  return {
    [_defineType]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        recursiveDefineType,
        LogHandler(message, caller, subject, {
          color: 'blue',
          bold: true,
          verbose: true,
        }),
      ),
    },
  };
}
