import { basename } from 'path';

import { RestrictedKeysType, RestrictedLoggerSignature } from '../../../../../compiler/types';
import { LogHandler } from '../../../../proxyHandler';
import { _restrictedOwnKeys } from '../../../../symbols';
import getOwnRestrictedKeys from './getOwnRestrictedKeys';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'calling "restrictedOwnKeys" method';

const RestrictedOwnKeys: RestrictedLoggerSignature<RestrictedKeysType> = (
  restrictedOwnKeys = [],
  message = 'no message received',
  caller = defaultCaller,
  subject = defaultSubject,
  chalkConfig = { color: 'red', bold: true }
) => ({
  [_restrictedOwnKeys]: {
    configurable: false,
    enumerable: false,
    value: new Proxy(getOwnRestrictedKeys(restrictedOwnKeys), LogHandler(message, caller, subject, chalkConfig)),
    writable: false,
  },
});

export default RestrictedOwnKeys;
