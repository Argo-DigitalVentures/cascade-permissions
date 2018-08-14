import path from 'path';

import Descriptors from '../descriptor';
import { desymbolize, validateDefined } from '../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `"Decorate" strategy selected`;

export default function Decorate(
  message,
  caller = defaultCaller,
  subject = defaultSubject,
  { color = 'green', bold = true } = {}
) {
  return function decorateWithDescriptors(prototype, restricted, name) {
    validateDefined(filename, 'prototype', prototype);
    const defaultMessage = `decorated "${desymbolize(
      name
    )}" object with "base" descriptors`;
    Object.defineProperties(
      prototype,
      Descriptors(message || defaultMessage, caller, subject, { color, bold })(
        name,
        restricted
      )
    );
    return prototype;
  };
}
