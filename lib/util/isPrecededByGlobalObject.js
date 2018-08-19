export default function isPrecededByGlobalObject(context, keys = false) {
  // if the search is for an object's own properties via Object.keys
  // the "keys" arguement should be true
  // the logic will reach the prototype-chain before the global Object
  // else, we can save an extra call if keys is set to "false"
  return !context || !Object.prototype.isPrototypeOf(keys ? context : Object.getPrototypeOf(context));
}
