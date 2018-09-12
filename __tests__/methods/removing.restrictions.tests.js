//////////////////////////////
// begin imports /////////////
//////////////////////////////
import chalk from 'chalk';
import { appSymbols, BaseFactory, helper, util } from '../../lib';
import { BaseRoles, BaseTypes, LeastStrict, MostStrict } from '../../test_helpers';

//////////////////////////////
// begin setup ///////////////
//////////////////////////////
const { _inherit, _permittedKeys, _restrictedOwnKeysRemove, _restrictedOwnTypesRemove } = appSymbols;
const { CreateDomain } = helper;
const { symbolize } = util;
const { admin, basic, moderator } = BaseRoles();
const { account, forum, message, transaction } = BaseTypes();

const demoGroups = ['admin', 'leastStrict', 'mostStrict'];
const allRoles = CreateDomain({
  admin,
  basic,
  moderator,
});
const allTypes = CreateDomain({
  account,
  forum,
  message,
  transaction,
});
const restricted = () => ({
  leastStrict: {
    roles: allRoles().getRestrictedTypes(LeastStrict().roles),
    types: allTypes().getRestrictedTypes(LeastStrict().types),
  },
  mostStrict: {
    roles: allRoles().getRestrictedTypes(MostStrict().roles),
    types: allTypes().getRestrictedTypes(MostStrict().types),
  },
});
const restrictedData = () => ({
  leastStrict: LeastStrict(),
  mostStrict: MostStrict(),
});

//////////////////////////////
// begin tests ///////////////
//////////////////////////////
describe(`${chalk.yellow.bold.underline('Methods')}: removing applied "${chalk.blue.bold('keys')}" and "${chalk.blue.bold(
  'types',
)}" restrictions`, () => {
  let Groups;
  let Roles;
  let Types;
  beforeEach(() => {
    Roles = allRoles().createRules('roles');
    Types = allTypes().createRules('types');
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
          restrictedKeys: restrictedData()[demoGroup],
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
    describe(`Group: "${chalk.blue.bold(demoGroup)}"`, () => {
      const demoGroupRestrictedData = restrictedData()[demoGroup] || {};
      allRoles()
        .getUniqueTypes()
        .forEach(key => {
          const demoGroupRestrictedRoles = demoGroupRestrictedData.roles || {};
          const demoGroupRoleRestrictedKeys = demoGroupRestrictedRoles[key] || [];
          if (demoGroupRoleRestrictedKeys.length) {
            describe(`removing "${chalk.yellow.bold(key)}" restrictedKeys [${chalk.blue.italic(demoGroupRoleRestrictedKeys)}] `, () => {
              const baseRoleKeys = allRoles()
                .getUniqueKeys(key)
                .sort();
              it(`expects initial definitions to ${chalk.red.bold.underline('not')} contain [${chalk.blue.bold.italic(
                demoGroupRoleRestrictedKeys,
              )}]`, () => {
                const demoGroupRoleKeys = Groups[symbolize(demoGroup)][symbolize('roles')][symbolize(key)][_permittedKeys]().sort();
                expect(demoGroupRoleKeys).toEqual(expect.not.arrayContaining(demoGroupRoleRestrictedKeys));
              });
              it(`expects post-removal definitions to match [${chalk.blue.bold.italic(baseRoleKeys)}]`, () => {
                const demoGroupRole = Groups[symbolize(demoGroup)][symbolize('roles')][symbolize(key)];

                const demoGroupPreRoleKeys = demoGroupRole[_permittedKeys]().sort();
                demoGroupRole[_restrictedOwnKeysRemove](demoGroupRoleRestrictedKeys);
                const demoGroupPostRoleKeys = demoGroupRole[_permittedKeys]().sort();

                expect(demoGroupPreRoleKeys).toEqual(expect.not.arrayContaining(demoGroupRoleRestrictedKeys));
                expect(demoGroupPostRoleKeys).toEqual(baseRoleKeys);
              });
            });
          }
          if (demoGroup !== 'admin' && restricted()[demoGroup].roles.includes(key)) {
            describe(`restricted "${chalk.green.bold(key)}"`, () => {
              it(`expects initial "${chalk.yellow.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
                const group = Groups[symbolize(demoGroup)][symbolize('roles')];
                const groupRole = group[symbolize(key)];
                expect(groupRole).toBeUndefined();
              });
              it(`expects post-removal type restriction "${chalk.yellow.bold(key)}" to be ${chalk.green.bold('defined')}`, () => {
                const group = Groups[symbolize(demoGroup)][symbolize('roles')];
                group[_restrictedOwnTypesRemove]([key]);
                const groupRole = group[symbolize(key)];
                expect(groupRole).toBeDefined();
              });
            });
          }
        });
      allTypes()
        .getUniqueTypes()
        .forEach(key => {
          const demoGroupRestrictedTypes = demoGroupRestrictedData.types || {};
          const demoGroupTypeRestrictedKeys = demoGroupRestrictedTypes[key] || [];
          if (demoGroupTypeRestrictedKeys.length) {
            describe(`removing "${chalk.yellow.bold(key)}" restrictedKeys [${chalk.blue.italic(demoGroupTypeRestrictedKeys)}] `, () => {
              const baseTypeKeys = allTypes()
                .getUniqueKeys(key)
                .sort();
              it(`expects initial definitions to ${chalk.red.bold.underline('not')} contain [${chalk.blue.bold.italic(
                demoGroupTypeRestrictedKeys,
              )}]`, () => {
                const demoGroupTypeKeys = Groups[symbolize(demoGroup)][symbolize('types')][symbolize(key)][_permittedKeys]().sort();
                expect(demoGroupTypeKeys).toEqual(expect.not.arrayContaining(demoGroupTypeRestrictedKeys));
              });
              it(`expects post-removal definitions to match [${chalk.blue.bold.italic(baseTypeKeys)}]`, () => {
                const demoGroupType = Groups[symbolize(demoGroup)][symbolize('types')][symbolize(key)];

                const demoGroupPreTypeKeys = demoGroupType[_permittedKeys]().sort();
                demoGroupType[_restrictedOwnKeysRemove](demoGroupTypeRestrictedKeys);
                const demoGroupPostTypeKeys = demoGroupType[_permittedKeys]().sort();

                expect(demoGroupPreTypeKeys).toEqual(expect.not.arrayContaining(demoGroupTypeRestrictedKeys));
                expect(demoGroupPostTypeKeys).toEqual(baseTypeKeys);
              });
            });
          }
          if (demoGroup !== 'admin' && restricted()[demoGroup].types.includes(key)) {
            describe(`restricted "${chalk.green.bold(key)}"`, () => {
              it(`expects initial "${chalk.yellow.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
                const group = Groups[symbolize(demoGroup)][symbolize('types')];
                const groupType = group[symbolize(key)];
                expect(groupType).toBeUndefined();
              });
              it(`expects post-removal type restriction "${chalk.yellow.bold(key)}" to be ${chalk.green.bold('defined')}`, () => {
                const group = Groups[symbolize(demoGroup)][symbolize('types')];
                group[_restrictedOwnTypesRemove]([key]);
                const groupType = group[symbolize(key)];
                expect(groupType).toBeDefined();
              });
            });
          }
        });
    });
  });
});
