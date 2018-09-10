export const DefineByExclusionKeys = domain => {
  const uniqueAllFields = Object.entries(domain).reduce(
    (col, [, value]) => Object.keys(value()).reduce((c, n) => (!c.includes(n) ? [...c, n] : c), col),
    [],
  );
  return Object.entries(domain).reduce((col, [key, value]) => {
    col[key] = uniqueAllFields.filter(field => !Object.keys(value()).includes(field));
    return col;
  }, {});
};

export const getRestrictedDomainList = (domain, restricted) => Object.keys(domain).filter(item => !Object.keys(restricted).includes(item));
export const getDomainTypes = domain => Object.keys(domain).filter(item => item !== 'all');

export const getUniqueKeys = (...args) =>
  args.reduce((col, obj) => Object.keys(obj).reduce((c, n) => (c[n] ? { ...c } : { ...c, [n]: obj[n] }), col), {});

export { default as TypeWrapper } from './typeWrapper';
