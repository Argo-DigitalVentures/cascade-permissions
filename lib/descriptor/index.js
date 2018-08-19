import path from 'path';

import Clone from './clone';
import InheritType from './inheritType';
import { LogHandler } from '../proxyHandler';
import { PermittedValues, PermittedKeys, PermittedTypes } from './permitted';
import PropId from './propId';
import {
  RestrictedKeys,
  RestrictedOwnKeys,
  RestrictedOwnKeysAdd,
  RestrictedOwnKeysRemove,
  RestrictedOwnTypes,
  RestrictedOwnTypesAdd,
  RestrictedOwnTypesRemove,
  RestrictedTypes,
} from './restricted';
import { desymbolize } from '../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `calling "createDescriptors" constructor`;

export default function Descriptors(
  message = 'no message received',
  caller = defaultCaller,
  subject,
  { color = 'green', bold = true } = {},
) {
  function createDescriptors(name, { restrictedKeys = [], restrictedTypes = [] } = {}) {
    const args = [`from "${desymbolize(name)}" object`, defaultCaller, subject || defaultSubject, { color, bold }];
    return {
      ...Clone(...args),
      ...InheritType(...args),
      ...PermittedValues(...args),
      ...PermittedKeys(...args),
      ...PermittedTypes(...args),
      ...PropId(name, ...args),
      ...RestrictedKeys(...args),
      ...RestrictedOwnKeys(restrictedKeys, ...args),
      ...RestrictedOwnKeysAdd(...args),
      ...RestrictedOwnKeysRemove(...args),
      ...RestrictedOwnTypes(restrictedTypes, ...args),
      ...RestrictedOwnTypesAdd(...args),
      ...RestrictedOwnTypesRemove(...args),
      ...RestrictedTypes(...args),
    };
  }
  return new Proxy(createDescriptors, LogHandler(message, caller, subject, { color, bold }));
}
