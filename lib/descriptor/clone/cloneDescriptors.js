////////////////////////////////////////
// FYI
// This function creates a new object with all the properties
// from the "descriptors" folder (which includes this file)
// yes, that means it clones.....itself
////////////////////////////////////////
import path from 'path';

import Descriptors from '../../descriptor';
import { BaseHandler } from '../../proxyHandler';
import { desymbolize, symbolize, validateDefined } from '../../util';
import { _propId } from '../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;

export default function CloneDescriptors(name, restricted = {}, prototype = this, message, caller, subject) {
  validateDefined(filename, 'name', name);
  const defaultMessage = `${desymbolize(this[_propId])}`;
  const defaultSubject = `cloned new "${desymbolize(name)}" object with descriptor`;
  return Object.defineProperties(this, {
    [symbolize(name)]: {
      configurable: false,
      enumerable: false,
      writable: true, // descriptors needs to be writable
      value: new Proxy(
        Object.create(
          prototype,
          Descriptors(defaultMessage, defaultCaller, defaultSubject, {
            color: 'blue',
            bold: true,
          })(name, restricted),
        ),
        BaseHandler(message, caller, subject),
      ),
    },
  });
}
