import { basename } from 'path';
import { LoggerSignature, StrategySignature } from '../../compiler/types';

import Descriptors from '../descriptor';
import { desymbolize, validateDefined } from '../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultSubject = '"Decorate" strategy selected';

const Decorate: LoggerSignature<StrategySignature> = (message, caller = filename, subject = defaultSubject, chalkConfig) => {
  return (prototype, restricted, name): object => {
    validateDefined(filename, 'prototype', prototype);
    const defaultMessage = `decorated "${desymbolize(name)}" object with "base" descriptors`;
    Object.defineProperties(prototype, Descriptors(message || defaultMessage, caller, subject, chalkConfig)(name, restricted));
    return prototype;
  };
};

export default Decorate;
