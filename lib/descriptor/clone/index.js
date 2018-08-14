import path from 'path';

import CloneDescriptors from './cloneDescriptors';
import { _clone } from '../../symbols';
import { LogHandler } from '../../proxyHandler';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `"calling _clone" method`;

export default function Clone(message = 'no message received') {
  return {
    [_clone]: {
      configurable: false,
      enumerable: false,
      writable: false,
      value: new Proxy(
        CloneDescriptors,
        LogHandler(message, defaultCaller, defaultSubject, {
          color: 'blue',
          bold: true,
          verbose: true,
        })
      ),
    },
  };
}
