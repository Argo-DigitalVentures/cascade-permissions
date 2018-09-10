import { basename } from 'path';

import { PrototypeInterface } from '../../../compiler/interfaces';
import { Signature } from '../../../compiler/types';
import { _clone, _inheritType, _permittedTypes, _propId, _restrictedTypes } from '../../symbols';
import { desymbolize, getUniqueArrayItems, symbolize } from '../../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = 'defining new type';

const recursiveDefinedType: Signature = (name, restricted = {}, prototype = this) => {
  const symbolizeName: string = symbolize(name) as any;
  const { restrictedTypes = [] } = restricted;
  const restrictedTypesList = getUniqueArrayItems([
    ...(prototype[_restrictedTypes] ? prototype[_restrictedTypes]() : []),
    ...restrictedTypes.map((symbol: string | symbol) => symbolize(symbol)),
    symbolizeName,
    this[_propId],
  ]);
  const defaultCloneMessage = `"${desymbolize(this[_propId])}" is cloning ${desymbolize(symbolizeName)}`;

  return prototype[_permittedTypes]()
    .filter((type: symbol) => !restrictedTypesList.includes(type))
    .reduce((col: PrototypeInterface, permittedType: string) => {
      const defaultInheritMessage = `"${desymbolize(symbolizeName)}" is inheriting definedType "${desymbolize(permittedType)}"`;
      col[symbolizeName][_inheritType](permittedType, restricted, prototype[permittedType], defaultInheritMessage, defaultCaller, defaultSubject);
      return col;
    }, this[_clone](symbolizeName, restricted, prototype, defaultCloneMessage, defaultCaller, defaultSubject));
};

export default recursiveDefinedType;
