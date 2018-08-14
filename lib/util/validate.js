import { createMessage } from './message';
import isObject from './isObject';

export function validateArray(filename, inputName, input) {
  if (!Array.isArray(input)) {
    throw new TypeError(
      createMessage(
        filename,
        { color: 'red', bold: true },
        `${inputName} is not of type Array`,
        input
      )
    );
  }
}

export function validateDefined(filename, inputName, input) {
  if (!input) {
    throw new TypeError(
      createMessage(
        filename,
        { color: 'red', bold: true },
        `${inputName} is falsey`,
        input
      )
    );
  }
}
export function validateName(filename, inputName, input) {
  if (typeof input !== 'symbol' && typeof input !== 'string') {
    throw new TypeError(
      createMessage(
        filename,
        { color: 'red', bold: true },
        `${inputName} is not of type String or Symbol`,
        input
      )
    );
  }
}

export function validateObject(filename, inputName, input) {
  if (!isObject(input)) {
    throw new TypeError(
      createMessage(
        filename,
        { color: 'red', bold: true },
        `${inputName} is not of type Object`,
        input
      )
    );
  }
}
