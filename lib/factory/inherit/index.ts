import { basename } from 'path'

import recursiveInherit from './recursiveInherit';
import { _inherit } from '../../symbols';
import { LogHandler } from '../../proxyHandler';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "inherit" method`;

export default function Inherit(message, caller = defaultCaller, subject = defaultSubject) {
  return {
    [_inherit]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        recursiveInherit,
        LogHandler(message, caller, subject, {
          color: 'blue',
          bold: false,
          verbose: true,
        }),
      ),
    },
  };
}
