import { basename } from 'path';
import { LoggerSignature, StrategySignature } from '../../compiler/types';

import Clone from './clone';
import CloneTypes from './cloneTypes';
import Create from './create';
import CreateCloneTypes from './createCloneTypes';
import Decorate from './decorate';

import { LogHandler } from '../proxyHandler';
import { _clone } from '../symbols';
import { getInheritableTypes } from '../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultSubject = 'selscting strategy';

const selectStrategy: LoggerSignature<StrategySignature> = (message, caller = filename, subject = defaultSubject, chalkConfig) => (prototype, restricted, name) => {
  if (!prototype) {
    return Create(message, caller, subject)(prototype, restricted, name);
  } else {
    const inheritableTypes = getInheritableTypes(prototype);
    const noInheritableTypes = !inheritableTypes.length;
    const noCloneMethod = typeof prototype[_clone] !== 'function';
    if (noInheritableTypes && noCloneMethod) {
      return Decorate(message, caller, subject, chalkConfig)(prototype, restricted, name);
    } else if (noInheritableTypes && !noCloneMethod) {
      return Clone(message, caller, subject, chalkConfig)(prototype, restricted, name);
    } else if (!noInheritableTypes && !noCloneMethod) {
      return CloneTypes(message, caller, subject, chalkConfig)(prototype, inheritableTypes, restricted);
    } else if (!noInheritableTypes && noCloneMethod) {
      return CreateCloneTypes(message, caller, subject, chalkConfig)(prototype, inheritableTypes, restricted, name);
    } else {
      throw new TypeError('no strategy selected');
    }
  }
};

const SelectStrategy: LoggerSignature<StrategySignature> = (message, caller = filename, subject = defaultSubject, chalkConfig) =>
  new Proxy(selectStrategy(message, caller, subject, chalkConfig), LogHandler(message, caller, subject, chalkConfig));

export default SelectStrategy;
