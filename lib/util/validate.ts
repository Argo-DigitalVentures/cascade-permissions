import { ValidateSignature } from '../../compiler/types';

import isObject from './isObject';
import { createMessage } from './message';

export const validateArray: ValidateSignature = (filename, inputName, input) => {
  if (!Array.isArray(input)) {
    throw new TypeError(createMessage(filename, { color: 'red', bold: true }, `${inputName} is not of type Array`, input));
  }
};

export const validateDefined: ValidateSignature = (filename, inputName, input) => {
  if (!input) {
    throw new TypeError(createMessage(filename, { color: 'red', bold: true }, `${inputName} is falsey`, input));
  }
};

export const validateName: ValidateSignature = (filename, inputName, input) => {
  if (typeof input !== 'symbol' && typeof input !== 'string') {
    throw new TypeError(createMessage(filename, { color: 'red', bold: true }, `${inputName} is not of type String or Symbol`, input));
  }
};

export const validateObject: ValidateSignature = (filename, inputName, input) => {
  if (!isObject(input)) {
    throw new TypeError(createMessage(filename, { color: 'red', bold: true }, `${inputName} is not of type Object`, input));
  }
};
