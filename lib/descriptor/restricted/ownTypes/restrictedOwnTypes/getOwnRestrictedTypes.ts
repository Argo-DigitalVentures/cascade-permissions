import { RestrictedTypesSignature } from '../../../../../compiler/types';
import { _restrictedTypes } from '../../../../symbols';
import { getUniqueArrayItems } from '../../../../util';

const getOwnRestrictedTypes: RestrictedTypesSignature = restrictedOwnTypes => {
  const restrictedTypes = this && this[_restrictedTypes] ? this[_restrictedTypes]() : [];
  return getUniqueArrayItems(restrictedOwnTypes).filter((item): item is symbol => !restrictedTypes.includes(item));
};

export default getOwnRestrictedTypes;
