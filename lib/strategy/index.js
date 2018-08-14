import path from 'path';

import Create from './create';
import CreateCloneTypes from './createCloneTypes';
import Clone from './clone';
import CloneTypes from './cloneTypes';
import Decorate from './decorate';

import * as appSymbols from '../symbols';
import { LogHandler } from '../proxyHandler';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `selecting strategy`;
export default function SelectStrategy(
  message,
  caller = defaultCaller,
  subject = defaultSubject,
  { color = 'blue', bold = true } = {}
) {
  function _selectStrategy(prototype) {
    if (!prototype) {
      return Create().bind(null, {});
    } else {
      const inhertableTypes = Object.getOwnPropertySymbols(prototype).filter(
        symbol => !Object.values(appSymbols).includes(symbol)
      );
      const noInheritableTypes = !inhertableTypes.length;
      const noCloneMethod = typeof prototype[appSymbols._clone] !== 'function';
      if (noInheritableTypes && noCloneMethod) {
        return Decorate().bind(null, prototype);
      } else if (noInheritableTypes && !noCloneMethod) {
        return Clone().bind(null, prototype);
      } else if (!noInheritableTypes && !noCloneMethod) {
        return CloneTypes().bind(null, prototype, inhertableTypes);
      } else if (!noInheritableTypes && noCloneMethod) {
        return CreateCloneTypes().bind(null, prototype, inhertableTypes);
      }
    }
  }
  return new Proxy(
    _selectStrategy,
    LogHandler(message, caller, subject, { color, bold })
  );
}
