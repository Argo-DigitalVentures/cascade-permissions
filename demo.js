//////////////////////////////
// begin imports /////////////
//////////////////////////////
import chalk from 'chalk';
import { appSymbols, BaseFactory, util, helper } from './lib';
import { BaseRoles, BaseTypes, LeastStrict, MostStrict } from './__tests__/util';

const { DefineByExclusionKeys, getDomainTypes, getRestrictedDomainList, getUniqueKeys, typeWrapper } = helper;

//////////////////////////////
// begin setup ///////////////
//////////////////////////////
const { _defineType, _inherit, _permittedKeys } = appSymbols;
const { symbolize } = util;
const { admin, basic, moderator } = BaseRoles();
const { account, forum, message, transaction } = BaseTypes();

const demoGroups = ['admin', 'leastStrict', 'mostStrict'];
const allRoleKeys = getDomainTypes(BaseRoles());
const allTypeKeys = getDomainTypes(BaseTypes());
const allRole = () => getUniqueKeys(admin(), basic(), moderator());
const allType = () => getUniqueKeys(account(), forum(), message(), transaction());
const RolesDefinedByExclusionKeys = () => DefineByExclusionKeys(BaseRoles());
const TypesDefinedByExclusionKeys = () => DefineByExclusionKeys(BaseTypes());
const restricted = () => ({
  leastStrict: {
    roles: getRestrictedDomainList(RolesDefinedByExclusionKeys(), LeastStrict().roles),
    types: getRestrictedDomainList(TypesDefinedByExclusionKeys(), LeastStrict().types),
  },
  mostStrict: {
    roles: getRestrictedDomainList(RolesDefinedByExclusionKeys(), MostStrict().roles),
    types: getRestrictedDomainList(TypesDefinedByExclusionKeys(), MostStrict().types),
  },
});

//////////////////////////////
// begin tests ///////////////
//////////////////////////////
let Groups;
let Roles;
let Types;
Roles = BaseFactory('roles', {}, allRole(), 'from created "Roles"');
allRoleKeys.forEach(key => {
  Roles[_defineType](
    key,
    {
      restrictedKeys: RolesDefinedByExclusionKeys()[key],
      restrictedTypes: allRoleKeys.filter(target => target !== key),
    },
    undefined,
    'from created "Roles" factory',
    key,
    `defining ${key} for "Types" factory`
  );
});
Types = BaseFactory('types', {}, allType(), 'from created "Types"');
allTypeKeys.forEach(key => {
  Types[_defineType](
    key,
    {
      restrictedKeys: TypesDefinedByExclusionKeys()[key],
      restrictedTypes: allTypeKeys.filter(item => item !== key),
    },
    undefined,
    'from created "Types" factory',
    key,
    `defining ${key} for "Types" factory`
  );
});
Groups = BaseFactory('demo', {}, { [symbolize('roles')]: Roles, [symbolize('types')]: Types });
demoGroups.forEach(demoGroup => {
  const otherDemoGroups = demoGroups.filter(item => item !== demoGroup);
  if (demoGroup === 'admin') {
    Groups[_inherit](demoGroup, {
      restrictedTypes: otherDemoGroups,
    });
  } else {
    const { roles = [], types = [] } = restricted()[demoGroup];
    Groups[_inherit](demoGroup, {
      restrictedKeys: demoGroup === 'leastStrict' ? LeastStrict() : MostStrict(),
      restrictedTypes: [...roles, ...types, ...otherDemoGroups],
    });
  }
});
const accountData = {
  first_name: 'John',
  id: 8,
  last_name: 'Doe',
  last_active_date: '2018-08-01',
  signup_date: '2018-07-05',
  username: 'john.doe',
};
const mostStrictAccount = typeWrapper(Groups, 'types')('mostStrict', 'account', accountData);
console.log('most account', mostStrictAccount);
// expect(mostStrictAccount.username).toBe('john.doe');
