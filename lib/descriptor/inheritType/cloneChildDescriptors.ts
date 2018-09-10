import { basename } from 'path';
import { SignaturePrototype } from '../../../compiler/types';
import { BaseHandler } from '../../proxyHandler';
import { _propId } from '../../symbols';
import { desymbolize, symbolize, validateDefined } from '../../util';
import ChildDescriptors from './childDescriptors';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'created "_inheritDefineType" property descriptor';

const CloneChildDescriptors: SignaturePrototype = (name, restricted, prototype, loggerConfig = {}) => {
  const { caller = defaultCaller, subject = defaultSubject } = loggerConfig;
  validateDefined(filename, 'name', name);
  const defaultMessage = `${desymbolize(this[_propId])} cloned "${desymbolize(name)}" object with "child" descriptors" `;
  return Object.defineProperties(this, {
    [symbolize(name)]: {
      configurable: false,
      enumerable: false,
      value: new Proxy(
        Object.create(prototype, ChildDescriptors(defaultMessage, defaultCaller, subject)(name, restricted, prototype)),
        BaseHandler(defaultMessage, caller, defaultSubject)
      ),
      writable: true, // child descriptors needs to be writable
    },
  });
};

export default CloneChildDescriptors;
