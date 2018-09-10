import { basename } from 'path';

import { Signature } from '../../../compiler/types';
import { _clone, _inheritType, _permittedTypes, _propId, _restrictedTypes } from '../../symbols';
import { desymbolize, getUniqueArrayItems, symbolize } from '../../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'defining new type';

const recursiveDefinedType: Signature = (name, restricted = {}, prototype = this) => {
  const symbolizeName = symbolize(name);
  const restrictedTypesList = getUniqueArrayItems([
    ...(prototype[_restrictedTypes] ? prototype[_restrictedTypes]() : []),
    ...restricted.restrictedTypes.map((symbol: string | symbol) => symbolize(symbol)),
    symbolizeName,
    this[_propId],
  ]);
  const defaultCloneMessage = `"${desymbolize(this[_propId])}" is cloning ${desymbolize(symbolizeName)}`;

  const func = prototype[_permittedTypes]();
  // return prototype[_permittedTypes]()
  return func
    .filter(type => !restrictedTypesList.includes(type))
    .reduce((col, permittedType) => {
      const defaultInheritMessage = `"${desymbolize(symbolizeName)}" is inheriting definedType "${desymbolize(permittedType)}"`;
      col[symbolizeName][_inheritType](permittedType, restricted, prototype[permittedType], defaultInheritMessage, defaultCaller, defaultSubject);
      return col;
    }, this[_clone](symbolizeName, restricted, prototype, defaultCloneMessage, defaultCaller, defaultSubject));
};

export default recursiveDefinedType;
