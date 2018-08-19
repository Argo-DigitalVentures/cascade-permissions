import path from 'path';

import { _clone } from '../symbols';
import { desymbolize, validateDefined } from '../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `"Clone" strategy selected`;

export default function Clone(message, caller = defaultCaller, subject = defaultSubject) {
  return function cloneWithDescriptors(prototype, restricted, name) {
    validateDefined(filename, 'prototype', prototype);
    const defaultMessage = `cloned "${desymbolize(name)}" object with "base" descriptors`;
    return prototype[_clone](name, restricted, prototype, message || defaultMessage, caller, subject);
  };
}
