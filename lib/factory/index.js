import path from 'path';

import DefineType from './defineType';
import Inherit from './inherit';
import { desymbolize, validateArray, validateName } from '../util';
import selectStrategy from '../strategy';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;

export default function BaseFactory(
  name,
  restricted = {},
  prototype,
  message = desymbolize(name),
  caller = defaultCaller,
  subject,
  { color = 'green', bold = true } = {},
) {
  validateName(filename, 'name', name);
  validateArray(filename, 'restricted.restrictedTypes', restricted.restrictedTypes || []);
  validateArray(filename, 'restricted.restrictedKeys', restricted.restrictedKeys || []);

  const defaultSubject = `BaseFactory is selecting strategy for "${desymbolize(name)}" object`;
  return Object.defineProperties(selectStrategy(message, caller, subject || defaultSubject, { color, bold })(prototype)(restricted, name), {
    ...DefineType(message),
    ...Inherit(message),
  });
}
