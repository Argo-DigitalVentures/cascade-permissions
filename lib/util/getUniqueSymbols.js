import getUniqueArrayItems from './getUniqueArrayItems';

export default function getUniqueSymbols(inputArray = []) {
  const restrictedTypes = Array.isArray(inputArray) ? inputArray : [inputArray];
  return getUniqueArrayItems(
    restrictedTypes.map(
      restrictedSymbol =>
        typeof restrictedSymbol === 'symbol'
          ? restrictedSymbol
          : Symbol.for(restrictedSymbol)
    )
  );
}
