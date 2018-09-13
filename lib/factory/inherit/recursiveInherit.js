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

  const domainTypeRestriction = restrictedTypes.some(item => isObject(item))
    ? restrictedTypes.reduce(
        (list, item) =>
          !isObject(item)
            ? list
            : [...Object.getOwnPropertySymbols(item), ...Object.keys(item).map(i => symbolize(i))].reduce(
                (col, key) => (this[key] ? [...col, ...item[key]] : col),
                list,
              ),
        [],
      )
    : [];
  const regularRestrictedTypes = !domainTypeRestriction.length
    ? []
    : restrictedTypes.reduce((col, item) => (isObject(item) ? col : [...col, ...(Array.isArray(item) ? item : [item])]), []);
  // const aggregateRestrictedTypes = restrictedTypes.reduce(
  //   (list, item) =>
  //     isObject(item)
  //       ? [...Object.getOwnPropertySymbols(item), ...Object.keys(item).map(i => symbolize(i))].reduce(
  //           (col, key) => (this[key] ? [...col, ...item[key]] : col),
  //           list,
  //         )
  //       : Array.isArray(item)
  //         ? [...list, ...item]
  //         : [...list, item],
  //   [],
  // );
  const restrictedTypesList = getUniqueSymbols([...this[_restrictedTypes](), ...previousOwnTypes, symbolizedName, this[_propId]]);

  return prototype[_permittedTypes]().reduce((col, permittedType) => {
    if (!restrictedTypesList.includes(permittedType)) {
      const shouldInheritDefinedType = !col[symbolizedName] && restrictedTypes.length ? !restrictedTypes.includes(desymbolize(name)) : true;

      if (shouldInheritDefinedType) {
        recursiveInherit.call(
          col[symbolizedName],
          permittedType,
          {
            restrictedKeys: isObject(restrictedKeys)
              ? restrictedKeys[desymbolize(permittedType)] || restrictedKeys
              : restrictedKeys.slice(0),
            restrictedTypes: domainTypeRestriction.length ? domainTypeRestriction.slice(0) : regularRestrictedTypes.slice(0),
            previousOwnTypes: restrictedTypesList,
          },
          prototype[permittedType],
        );
      }
    }
    return col;
  }, this);
}
