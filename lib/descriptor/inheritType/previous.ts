import { basename } from 'path';

import { MethodSignature } from '../../../compiler/types';
import { LogHandler } from '../../proxyHandler';
import { _previous } from '../../symbols';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'created "_previous" property descriptor';

function createPrevious(prototype: {}) {
  return {
    // gathers all the restricted instance fields on the prototype chain
    [_previous]: {
      configurable: false,
      enumerable: false,
      value: prototype,
      writable: true,
    },
  };
}

const Previous: MethodSignature<{}> = (prototype, message = 'no message received', caller = defaultCaller, subject = defaultSubject) =>
  // interested to know when a "second" prototype is created
  new Proxy(createPrevious(prototype), LogHandler(message, caller, subject));

export default Previous;
