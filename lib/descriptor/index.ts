import { basename } from 'path';

import Clone from './clone';
import InheritType from './inheritType';
import { PermittedKeys, PermittedTypes, PermittedValues } from './permitted';
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

import { ChalkConfigInterface } from '../../compiler/interfaces';
import { LoggerSignature, Signature } from '../../compiler/types';
import { LogHandler } from '../proxyHandler';
import { desymbolize } from '../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "createDescriptors" constructor';

const Descriptors: LoggerSignature<Signature> = (
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { color: 'red', bold: true }
) => {
  const createDescriptors: Signature = (name, { restrictedKeys = [], restrictedTypes = [] } = {}) => {
    const args: [string, string, string, ChalkConfigInterface] = [`from "${desymbolize(name)}" object`, defaultCaller, subject, chalkConfig];
    return {
      ...Clone(...args),
      ...InheritType(...args),
      ...PermittedValues(...args),
      ...PermittedKeys(...args),
      ...PermittedTypes(...args),
      ...PropId(name, ...args),
      ...RestrictedKeys(...args),
      // ...RestrictedOwnKeys(restrictedKeys, ...args),
      ...RestrictedOwnKeys(restrictedKeys, ...args),
      ...RestrictedOwnKeysAdd(...args),
      ...RestrictedOwnKeysRemove(...args),
      ...RestrictedOwnTypes(restrictedTypes, ...args),
      ...RestrictedOwnTypesAdd(...args),
      ...RestrictedOwnTypesRemove(...args),
      ...RestrictedTypes(...args),
    };
  };
  return new Proxy(createDescriptors, LogHandler(message, caller, subject, chalkConfig));
};

export default Descriptors;
