import path from 'path';

import { _previous } from '../../symbols';
import { LogHandler } from '../../proxyHandler';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `created "_previous" property descriptor`;

export default function Previous(
  prototype,
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject
) {
  function createPrevious(prototype) {
    return {
      // gathers all the restricted instance fields on the prototype chain
      [_previous]: {
        configurable: false,
        enumerable: false,
        writable: true,
        value: prototype,
      },
    };
  }

  // interested to know when a "second" prototype is created
  return new Proxy(
    createPrevious(prototype),
    LogHandler(message, caller, subject)
  );
}
