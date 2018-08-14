import path from 'path';

import {
  _inheritType,
  _propId,
  _restrictedTypes,
  _permittedTypes,
} from '../../symbols';
import {
  desymbolize,
  getUniqueSymbols,
  symbolize,
  validateObject,
} from '../../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `inherited definedType`;
export default function recursiveInherit(
  name,
  restricted,
  prototype = this,
  message = `with name ${desymbolize(name)}`,
  caller = defaultCaller,
  subject = defaultSubject
) {
  validateObject(filename, 'prototype', prototype);
  const symbolizedName = symbolize(name);
  const {
    restrictedFields = [],
    restrictedTypes = [],
    previousOwnTypes = [],
  } = restricted;
  this[_inheritType](
    symbolizedName,
    restricted,
    prototype,
    message,
    caller,
    subject
  );

  const restrictedTypesList = getUniqueSymbols([
    ...this[_restrictedTypes](),
    ...restrictedTypes.map(symbol => symbolize(symbol)),
    ...previousOwnTypes,
    symbolizedName,
    this[_propId],
  ]);

  return prototype[_permittedTypes]().reduce((col, permittedType) => {
    if (!restrictedTypesList.includes(permittedType)) {
      const shouldInheritDefinedType =
        !col[symbolizedName] && restrictedTypes.length
          ? !restrictedTypes.includes(symbolizedName)
          : true;

      if (shouldInheritDefinedType) {
        recursiveInherit.call(
          col[symbolizedName],
          permittedType,
          {
            restrictedTypes: restrictedTypes.slice(0),
            restrictedFields: restrictedFields.slice(0),
            previousOwnTypes: restrictedTypesList,
          },
          prototype[permittedType]
        );
      }
    }
    return col;
  }, this);
}
