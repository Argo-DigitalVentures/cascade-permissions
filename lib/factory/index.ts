import { basename } from 'path';

import { Signature } from '../../compiler/types';
import selectStrategy from '../strategy';
import { desymbolize } from '../util';
import DefineType from './defineType';
import Inherit from './inherit';

const filename = `${basename(__dirname)}/${basename(__filename)}`;

const BaseFactory: Signature = (
  name,
  restricted = {},
  prototype,
  { caller = filename, chalkConfig = { color: 'green', bold: true }, message = desymbolize(name), subject = `BaseFactory selecting strategy for ${name}` } = {}
) => {
  const strategy = selectStrategy(message, caller, subject, chalkConfig)(prototype, restricted, name);
  return Object.defineProperties(strategy, {
    ...DefineType(message),
    ...Inherit(message),
  });
};

export default BaseFactory;
