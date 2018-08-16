//////////////////////////////
// begin imports /////////////
//////////////////////////////
import chalk from 'chalk';
import { appSymbols, BaseFactory, util } from '../lib';
import { BaseRoles, BaseTypes, LeastStrict, MostStrict } from './util';
import { DefineByExclusionKeys, getDomainTypes, getRestrictedDomainList, getUniqueKeys } from '../lib/helper';

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
describe(chalk.yellow.bold.underline('Inheriting Cascaded Definitions'), () => {
  let Groups;
  let Roles;
  let Types;
  beforeEach(() => {
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
          restrictedTypes: [...roles, ...types, ...otherDemoGroups],
        });
      }
    });
  });
  afterEach(() => {
    Groups = undefined;
    Roles = undefined;
    Types = undefined;
  });
  demoGroups.forEach(demoGroup => {
    allTypeKeys.forEach(key => {
      const permittedType = demoGroup === 'admin' || !restricted()[demoGroup].types.includes(key);
      if (permittedType) {
        describe(`${chalk.blue.bold(demoGroup)}: permitted "${chalk.green.bold(key)}" type`, () => {
          const targetTypeKeys = Object.keys(BaseTypes()[key]()).sort();
          it(`expects "${chalk.green.bold(key)}" to match definitions ${chalk.blue.bold.italic(targetTypeKeys)} `, () => {
            const group = Groups[symbolize(demoGroup)][symbolize('types')];
            const groupType = group[symbolize(key)];
            const permittedTypeKeys = groupType[_permittedKeys]().sort();
            expect(permittedTypeKeys).toEqual(targetTypeKeys);
          });
        });
      } else {
        describe(`${chalk.blue.bold(demoGroup)}: ${chalk.underline('restricted')} "${chalk.green.bold(key)}" type`, () => {
          it(`expects ${chalk.red.bold('restricted')} "${chalk.red.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
            const group = Groups[symbolize(demoGroup)][symbolize('types')];
            const groupType = group[symbolize(key)];
            expect(groupType).toBeUndefined();
          });
        });
      }
    });
    allRoleKeys.forEach(key => {
      const permittedRole = demoGroup === 'admin' || !restricted()[demoGroup].roles.includes(key);
      if (permittedRole) {
        describe(`${chalk.blue.bold(demoGroup)}: permitted "${chalk.green.bold(key)}" role`, () => {
          const targetRoleKeys = Object.keys(BaseRoles()[key]()).sort();
          it(`expects "${chalk.green.bold(key)}" to match definitions ${chalk.blue.bold.italic(targetRoleKeys)} `, () => {
            const group = Groups[symbolize(demoGroup)][symbolize('roles')];
            const groupRole = group[symbolize(key)];
            const permittedRoleKeys = groupRole[_permittedKeys]().sort();
            expect(permittedRoleKeys).toEqual(targetRoleKeys);
          });
        });
      } else {
        describe(`${chalk.blue.bold(demoGroup)}: ${chalk.underline('restricted')} "${chalk.green.bold(key)}" type`, () => {
          it(`expects ${chalk.red.bold('restricted')} "${chalk.red.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
            const group = Groups[symbolize(demoGroup)][symbolize('roles')];
            const groupRole = group[symbolize(key)];
            expect(groupRole).toBeUndefined();
          });
        });
      }
    });
  });
});
