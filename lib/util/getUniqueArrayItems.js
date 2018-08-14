export default function getUniqueArrayItems(value) {
  const isString = typeof value === 'string';
  const isArray = Array.isArray(value);
  if (!isArray && !isString) {
    throw new TypeError(
      `getUniqueArrayItems: value ${value} is not an Array nor String`
    );
  }
  return !isArray
    ? [value]
    : value.reduce(
        (col, field) => (col.includes(field) ? col : [...col, field]),
        []
      );
}
