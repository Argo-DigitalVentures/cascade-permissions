////////////////////////////////////////
// FYI
// This function creates a new object with all the properties
// from the "descriptors" folder (which includes this file)
// yes, that means it clones.....itself
////////////////////////////////////////
import { basename } from 'path';

import { Signature } from '../../../compiler/types';
import Descriptors from '../../descriptor';
import { BaseHandler } from '../../proxyHandler';
import { _propId } from '../../symbols';
import { desymbolize, symbolize, validateDefined } from '../../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;

const CloneDescriptors: Signature = (name, restricted, prototype = this, loggerConfig = {}) => {
  const {
    caller = filename,
    message = `${desymbolize(this[_propId])}`,
    subject = `cloned new "${desymbolize(name)}" object with descriptor`,
    chalkConfig = {
      bold: true,
      color: 'blue',
    },
  } = loggerConfig;
  validateDefined(filename, 'name', name);
  return Object.defineProperties(this, {
    [symbolize(name)]: {
      configurable: false,
      enumerable: false,
      value: new Proxy(Object.create(prototype, Descriptors(message, caller, subject, chalkConfig)(name, restricted)), BaseHandler(message, caller, subject)),
      writable: true, // descriptors needs to be writable
    },
  });
};

export default CloneDescriptors;
