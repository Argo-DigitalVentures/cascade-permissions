import { DeSymbolize, Symbolize } from '../../compiler/types';

export const desymbolize: DeSymbolize = name => (typeof name === 'symbol' ? Symbol.keyFor(name) : name);
export const symbolize: Symbolize = name => (typeof name === 'symbol' ? name : Symbol.for(name));
