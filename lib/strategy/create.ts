import { basename } from 'path';
import { LoggerSignature, StrategySignature } from '../../compiler/types';

import Descriptors from '../descriptor';
import { desymbolize, validateDefined } from '../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = '"Create" strategy selected:';

const Create: LoggerSignature<StrategySignature> = (message, caller = defaultCaller, subject = defaultSubject) => (prototype, restricted, name) => {
  validateDefined(filename, 'prototype', prototype);
  const defaultMessage = `created "${desymbolize(name)}" object with "base" descriptors`;
  return Object.create(prototype, Descriptors(message || defaultMessage, caller, subject)(name, restricted));
};

export default Create;
