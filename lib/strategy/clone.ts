import { basename } from 'path';
import { LoggerSignature, StrategySignature } from '../../compiler/types';
import { _clone } from '../symbols';
import { desymbolize } from '../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultSubject = '"Clone" strategy selected';

const Clone: LoggerSignature<StrategySignature> = (message, caller = filename, subject = defaultSubject, loggerConfig = { bold: true, color: 'blue' }) => {
  return (prototype, restricted, name): {} => {
    const defaultMessage = `cloned "${desymbolize(name)}" object with "base" descriptors`;
    return prototype[_clone](name, restricted, prototype, message || defaultMessage, caller, subject, loggerConfig);
  };
};

export default Clone;
