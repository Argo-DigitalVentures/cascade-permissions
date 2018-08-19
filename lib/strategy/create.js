import path from 'path';

import Descriptors from '../descriptor';
import { desymbolize, validateDefined } from '../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `"Create" strategy selected:`;

export default function Create(message, caller = defaultCaller, subject = defaultSubject) {
  return function createWithDescriptors(prototype, restricted, name) {
    validateDefined(filename, 'prototype', prototype);
    const defaultMessage = `created "${desymbolize(name)}" object with "base" descriptors`;
    return Object.create(prototype, Descriptors(message || defaultMessage, caller, subject)(name, restricted));
  };
}
