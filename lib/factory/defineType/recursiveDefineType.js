import path from 'path';

import { _clone, _inheritType, _permittedTypes, _propId, _restrictedTypes } from '../../symbols';
import { desymbolize, getUniqueSymbols, symbolize } from '../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `defining new type`;

export default function recursiveDefinedType(name, restricted = {}, prototype = this) {
  const symbolizeName = symbolize(name);
  const restrictedTypesList = getUniqueSymbols([
    ...(prototype[_restrictedTypes] ? prototype[_restrictedTypes]() : []),
    ...restricted.restrictedTypes.map(symbol => symbolize(symbol)),
    symbolizeName,
    this[_propId],
  ]);
  const defaultCloneMessage = `"${desymbolize(this[_propId])}" is cloning ${desymbolize(symbolizeName)}`;

  return prototype[_permittedTypes]()
    .filter(type => !restrictedTypesList.includes(type))
    .reduce((col, permittedType) => {
      const defaultInheritMessage = `"${desymbolize(symbolizeName)}" is inheriting definedType "${desymbolize(permittedType)}"`;
      col[symbolizeName][_inheritType](
        permittedType,
        restricted,
        prototype[permittedType],
        defaultInheritMessage,
        defaultCaller,
        defaultSubject,
      );
      return col;
      [];
      // }, this[_clone](symbolizeName, restricted, prototype, message || defaultCloneMessage, caller, subject));
    }, this[_clone](symbolizeName, restricted, prototype, defaultCloneMessage, defaultCaller, defaultSubject));
}
