import { basename } from 'path';
import { PropIdSignature } from '../../../compiler/types';
import { LogHandler } from '../../proxyHandler';
import { desymbolize, validateName } from '../../util';
import CreatePropId from './createPropId';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'created new "_propId" descriptor';

const PropId: PropIdSignature = (name, message = `with name "${desymbolize(name)}"`, caller = defaultCaller, subject = defaultSubject) => {
  validateName(filename, 'name', name);
  return new Proxy(CreatePropId(name), LogHandler(message, caller, subject));
};

export default PropId;
