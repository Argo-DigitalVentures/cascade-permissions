import { basename } from 'path';

import { CloneTypesSignature,LoggerSignature  } from '../../compiler/types';
import { _clone, _propId } from '../symbols';
import { desymbolize, validateDefined } from '../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = '"CloneTypes" strategy selected';

const CloneTypes: LoggerSignature<CloneTypesSignature> = (message, caller = defaultCaller, subject = defaultSubject) => (
  prototype,
  typesList,
  restricted
) => {
  validateDefined(filename, 'prototype', prototype);
  return typesList.reduce((context, type) => {
    const defaultMessage = `"${desymbolize(context[_propId])} cloned "${desymbolize(type[_propId])}" with "descriptors" functionalities`;
    context[_clone](type, restricted, prototype[type], message || defaultMessage, caller, subject);
    return context;
  }, prototype);
};

export default CloneTypes;
