import * as appSymbols from '../symbols';
export default function getInheritableTypes(prototype: {}) {
  const restrictedSymbolValues: symbol[] = Object.values(appSymbols);
  return Object.getOwnPropertySymbols(prototype).filter((item): item is symbol => !restrictedSymbolValues.includes(item));
}
