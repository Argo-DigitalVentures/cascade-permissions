import { basename } from 'path';
import { LoggerSignature, Signature } from '../../../compiler/types';
import { LogHandler } from '../../proxyHandler';
import { _propId } from '../../symbols';
import { desymbolize } from '../../util';
import PropId from '../propId';
import { RestrictedOwnKeys, RestrictedOwnTypes } from '../restricted';
import Previous from './previous';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'created "_previous" property descriptor';

const createChildDescriptors = (caller?: string, subject?: string): Signature => (name, restricted = {}, prototype = this) => {
  const args = [`created "childDescriptors" for "${desymbolize(name)}" with a previous propId ${desymbolize(prototype[_propId])}`, caller, subject];
  return {
    ...Previous(prototype, ...args),
    ...PropId(name, ...args),
    ...RestrictedOwnKeys(restricted.restrictedKeys, ...args),
    ...RestrictedOwnTypes(restricted.restrictedTypes, ...args),
  };[]
};

const ChildDescriptors: LoggerSignature<Signature> = (message = 'no message received', caller = defaultCaller, subject = defaultSubject, chalkConfig) =>
  new Proxy(createChildDescriptors(caller, subject), LogHandler(message, caller, subject, chalkConfig));

export default ChildDescriptors;
