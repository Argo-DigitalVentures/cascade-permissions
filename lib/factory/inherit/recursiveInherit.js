import path from 'path';

import { _inheritType, _permittedTypes, _propId, _restrictedTypes } from '../../symbols';
import { desymbolize, getUniqueSymbols, isObject, symbolize, validateObject } from '../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `inherited definedType`;
export default function recursiveInherit(
  name,
  restricted,
  prototype = this,
  message = `with name ${desymbolize(name)}`,
  caller = defaultCaller,
  subject = defaultSubject,
) {
  validateObject(filename, 'prototype', prototype);
  const symbolizedName = symbolize(name);
  const { restrictedKeys = [], restrictedTypes = [], previousOwnTypes = [] } = restricted;
  this[_inheritType](symbolizedName, restricted, prototype, message, caller, subject);

  const restrictedTypesList = getUniqueSymbols([
    ...this[_restrictedTypes](),
    ...restrictedTypes.map(symbol => symbolize(symbol)),
    ...previousOwnTypes,
    symbolizedName,
    this[_propId],
  ]);

  return prototype[_permittedTypes]().reduce((col, permittedType) => {
    if (!restrictedTypesList.includes(permittedType)) {
      const shouldInheritDefinedType = !col[symbolizedName] && restrictedTypes.length ? !restrictedTypes.includes(symbolizedName) : true;

      if (shouldInheritDefinedType) {
        if (isObject(restrictedKeys) && restrictedKeys[desymbolize(permittedType)]) {
          // console.log(`${desymbolize(name)}: permittedType`, permittedType);
          // console.log(
          //   `${desymbolize(name)}: restrictedKeys`,
          //   restrictedKeys[desymbolize(permittedType)]
          // );
        }

        recursiveInherit.call(
          col[symbolizedName],
          permittedType,
          {
            restrictedKeys: isObject(restrictedKeys)
              ? restrictedKeys[desymbolize(permittedType)] || restrictedKeys
              : restrictedKeys.slice(0),
            restrictedTypes: restrictedTypes.slice(0),
            previousOwnTypes: restrictedTypesList,
          },
          prototype[permittedType],
        );
      }
    }
    return col;
  }, this);
}
