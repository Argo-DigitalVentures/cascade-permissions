import path from 'path';

import { LogHandler } from '../../proxyHandler';
import { _inheritType } from '../../symbols';
import cloneChildDescriptors from './cloneChildDescriptors';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "inheritType" method`;

export default function InheritType(message = 'no message received') {
  return {
    [_inheritType]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        cloneChildDescriptors,
        LogHandler(message, defaultCaller, defaultSubject, {
          verbose: true,
        }),
      ),
    },
  };
}
