import path from 'path';

import ChildDescriptors from './childDescriptors';
import { BaseHandler } from '../../proxyHandler';
import { desymbolize, symbolize, validateDefined } from '../../util';
import { _propId } from '../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `created "_inheritDefineType" property descriptor`;

export default function CloneChildDescriptors(
  name,
  restricted,
  prototype,
  message,
  caller = defaultCaller,
  subject = defaultSubject
) {
  validateDefined(filename, 'name', name);
  const defaultMessage = `${desymbolize(this[_propId])} cloned "${desymbolize(
    name
  )}" object with "child" descriptors" `;
  return Object.defineProperties(this, {
    [symbolize(name)]: {
      configurable: false,
      enumerable: false,
      writable: true, // child descriptors needs to be writable
      value: new Proxy(
        Object.create(
          prototype,
          ChildDescriptors(defaultMessage, defaultCaller, subject)(
            name,
            restricted,
            prototype
          )
        ),
        BaseHandler(defaultMessage, caller, defaultSubject)
      ),
    },
  });
}
