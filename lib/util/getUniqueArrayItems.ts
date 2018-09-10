export default function getUniqueArrayItems(value: Array<string | symbol>): Array<string | symbol> {
  const isArray = Array.isArray(value);
  if (!isArray) {
    throw new TypeError(`getUniqueArrayItems: value ${value} is not an Array nor String`);
  } else {
    return value.reduce((col: Array<string | symbol>, field: string | symbol) => (col.includes(field) ? col : [...col, field]), []);
  }
}
