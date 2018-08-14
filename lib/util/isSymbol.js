import * as appSymbols from '../symbols';

export default function isSymbol(key) {
  return typeof key === 'symbol' || Object.values(appSymbols).includes(key);
}
