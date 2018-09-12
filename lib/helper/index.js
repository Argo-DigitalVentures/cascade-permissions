import { deprecate } from 'util';
import BaseFactory from '../factory';
import { _defineType } from '../symbols';
import isObject from '../util/isObject';

const _DefineByExclusionKeys = domain => {
  const uniqueAllFields = Object.entries(domain).reduce(
    (col, [, value]) => Object.keys(value()).reduce((c, n) => (!c.includes(n) ? [...c, n] : c), col),
    [],
  );
  return Object.entries(domain).reduce((col, [key, value]) => {
    col[key] = uniqueAllFields.filter(field => !Object.keys(value()).includes(field));
    return col;
  }, {});
};

const _getRestrictedDomainList = (domain, restricted) => Object.keys(domain).filter(item => !Object.keys(restricted).includes(item));

const _getDomainTypes = domain => Object.keys(domain).filter(item => item !== 'all');

const _getUniqueKeys = (...args) =>
  args.reduce((col, obj) => Object.keys(obj).reduce((c, n) => (c[n] ? { ...c } : { ...c, [n]: obj[n] }), col), {});

export const DefineByExclusionKeys = deprecate(
  _DefineByExclusionKeys,
  'DefineByExclusionKeys will be deprecated, use CreateDomain.prototype.getRestrictedKeys method instead',
);

export const getRestrictedDomainList = deprecate(
  _getRestrictedDomainList,
  'getRestrictedDomainList is deprecated. Use the CreateDomain.prototype.getRestrictedKeys instead',
);

export const getDomainTypes = deprecate(
  _getDomainTypes,
  'getDomainTypes is deprecated. Use the CreateDomain.prototype.getUniqueKeys method instead',
);

export const getUniqueKeys = deprecate(
  _getUniqueKeys,
  'getUniqueKeys is deprecated. Use the CreateDomain.prototype.getDictionary method instead',
);

export { default as TypeWrapper } from './typeWrapper';

export const CreateDomain = objectWithAll => () =>
  Object.entries(objectWithAll).reduce(
    (col, [key, value]) => ({
      ...col,
      ...{ [key]: value },
    }),
    {
      _internalFields() {
        return [
          '_internalFields',
          'createRules',
          'getDictionary',
          'getRestrictedKeys',
          'getRestrictedTypes',
          'getUniqueKeys',
          'getUniqueTypes',
        ];
      },
      getDictionary() {
        return Object.entries(this).reduce(
          (dictionary, [prop, data]) =>
            this._internalFields().includes(prop)
              ? dictionary
              : Object.entries(data()).reduce(
                  (col, [key, value]) =>
                    col[key]
                      ? col
                      : {
                          ...col,
                          [key]: value,
                        },
                  dictionary,
                ),
          {},
        );
      },
      getRestrictedKeys(type) {
        if (!type || !this[type] || this._internalFields().includes(type)) {
          throw new ReferenceError(`cannot call ${type}`);
        }
        const typeFields = Object.keys(this[type]());
        return this.getUniqueKeys().filter(item => !typeFields.includes(item));
      },
      getRestrictedTypes(type) {
        if (!this._internalFields().includes(type) && (type || this[type])) {
          const inputType = Array.isArray(type) ? type : isObject(type) ? Object.keys(type) : [type];
          const exclusionList = [...inputType, ...this._internalFields()];
          return Object.keys(this).filter(item => !exclusionList.includes(item));
        } else {
          throw new ReferenceError(`cannot call ${type}`);
        }
      },
      getUniqueKeys(type) {
        return this[type] && !this._internalFields().includes(type) ? Object.keys(this[type]()) : Object.keys(this.getDictionary());
      },
      getUniqueTypes() {
        return Object.keys(this).filter(item => !this._internalFields().includes(item));
      },

      createRules(ruleGroupName, restricted = {}, message = `from createRules for ${ruleGroupName}`) {
        const targetObj = BaseFactory(ruleGroupName, restricted, this.getDictionary(), message);
        this.getUniqueTypes().forEach(key => {
          targetObj[_defineType](
            key,
            {
              restrictedKeys: this.getRestrictedKeys(key),
              restrictedTypes: this.getRestrictedTypes(key),
            },
            undefined,
            `from created ${ruleGroupName} factory`,
            key,
            `defining ${key} for "Types" factory`,
          );
        });
        return targetObj;
      },
    },
  );
