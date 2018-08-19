import path from 'path';

import CreatePropId from './createPropId';
import { LogHandler } from '../../proxyHandler';
import { validateName } from '../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `created new "_propId" descriptor`;

export default function PropId(name, message = `with name "desymbolize(name)"`, caller = defaultCaller, subject = defaultSubject) {
  validateName(filename, 'name', name);
  return new Proxy(CreatePropId(name), LogHandler(message, caller, subject));
}
