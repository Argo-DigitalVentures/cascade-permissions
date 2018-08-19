export const symbolize = name => (typeof name === 'symbol' ? name : Symbol.for(name));
export const desymbolize = name => (typeof name === 'symbol' ? Symbol.keyFor(name) : name);
