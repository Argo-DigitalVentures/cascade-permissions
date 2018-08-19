import path from 'path';

import Previous from './previous';
import PropId from '../propId';
import { LogHandler } from '../../proxyHandler';
import { RestrictedOwnKeys, RestrictedOwnTypes } from '../restricted';
import { desymbolize } from '../../util';
import { _propId } from '../../symbols';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `created "_previous" property descriptor`;

export default function ChildDescriptors(
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  { color = 'blue', bold = true } = {},
) {
  function createChildDescriptors(name, { restrictedKeys = [], restrictedTypes = [] } = {}, prototype = this) {
    const args = [
      `created "childDescriptors" for "${desymbolize(name)}" with a previous propId ${desymbolize(prototype[_propId])}`,
      caller,
      subject,
    ];
    return {
      ...Previous(prototype, ...args),
      ...PropId(name, ...args),
      ...RestrictedOwnKeys(restrictedKeys, ...args),
      ...RestrictedOwnTypes(restrictedTypes, ...args),
    };
  }
  return new Proxy(createChildDescriptors, LogHandler(message, caller, subject, { color, bold }));
}
