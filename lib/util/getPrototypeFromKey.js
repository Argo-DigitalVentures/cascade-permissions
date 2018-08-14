import isPrecededByGlobalObject from './isPrecededByGlobalObject';

export default function getProtoTypeFromKey(key) {
  // this refers to the caller aka before the "." dot
  // meaning "this" === child
  return isPrecededByGlobalObject(this, true)
    ? undefined
    : Object.prototype.hasOwnProperty.call(this, key)
      ? this
      : getProtoTypeFromKey.call(Object.getPrototypeOf(this), key);
}
