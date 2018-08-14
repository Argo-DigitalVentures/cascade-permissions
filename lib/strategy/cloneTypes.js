import path from 'path';

import { _clone, _propId } from '../symbols';
import { desymbolize, validateDefined } from '../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `"CloneTypes" strategy selected`;

export default function CloneTypes(
  message,
  caller = defaultCaller,
  subject = defaultSubject
) {
  return function cloneTypesWithDescriptors(prototype, typesList, restricted) {
    validateDefined(filename, 'prototype', prototype);
    return typesList.reduce((context, type) => {
      const defaultMessage = `"${desymbolize(
        context[_propId]
      )} cloned "${desymbolize(
        type[_propId]
      )}" with "descriptors" functionalities`;
      context[_clone](
        type,
        restricted,
        prototype[type],
        message || defaultMessage,
        caller,
        subject
      );
      return context;
    }, prototype);
  };
}
