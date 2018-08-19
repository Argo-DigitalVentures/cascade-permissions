import { _restrictedTypes } from '../../../../symbols';
import { getUniqueSymbols } from '../../../../util';

export default function getOwnRestrictedTypes(restrictedOwnTypes = []) {
  const restrictedTypes = this && this[_restrictedTypes] ? this[_restrictedTypes]() : [];

  return getUniqueSymbols(restrictedOwnTypes).filter(symbol => !restrictedTypes.includes(symbol));
}
