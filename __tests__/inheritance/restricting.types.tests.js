//////////////////////////////
// begin imports /////////////
//////////////////////////////
import chalk from 'chalk';
import { appSymbols, BaseFactory, helper, util } from '../../lib';
import { BaseRoles, BaseTypes, LeastStrict, MostStrict } from '../../test_helpers';

//////////////////////////////
// begin setup ///////////////
//////////////////////////////
const { _inherit, _permittedKeys } = appSymbols;
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
describe(`${chalk.yellow.bold.underline('Inheritance')}: applying "${chalk.blue.bold('types')}" restrictions`, () => {
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
          const testType = 'roles';
          const demoGroupRestricted = demoGroupRestrictedData[testType] || {};
          const demoGroupRestrictedKeys = demoGroupRestricted[key] || [];
          if (demoGroupRestrictedKeys.length) {
            describe(`inheriting "${chalk.yellow.bold(key)}"`, () => {
              const modifiedBaseRoleKeys = allRoles()
                .getUniqueKeys(key)
                .sort();
              it(`expects definitions to match [${chalk.blue.bold.italic(modifiedBaseRoleKeys)}]`, () => {
                const demoGroupKeys = Groups[symbolize(demoGroup)][symbolize(testType)][symbolize(key)][_permittedKeys]().sort();
                expect(demoGroupKeys).toEqual(modifiedBaseRoleKeys);
              });
            });
          }
          if (demoGroup !== 'admin' && restricted()[demoGroup][testType].includes(key)) {
            describe(`restricted "${chalk.green.bold(key)}"`, () => {
              it(`expects "${chalk.yellow.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
                const group = Groups[symbolize(demoGroup)][symbolize(testType)];
                const groupType = group[symbolize(key)];
                expect(groupType).toBeUndefined();
              });
            });
          }
        });
      allTypes()
        .getUniqueTypes()
        .forEach(key => {
          const testType = 'types';
          const demoGroupRestricted = demoGroupRestrictedData[testType] || {};
          const demoGroupRestrictedKeys = demoGroupRestricted[key] || [];
          if (demoGroupRestrictedKeys.length) {
            describe(`inheriting "${chalk.yellow.bold(key)}"`, () => {
              const modifiedBaseTypeKeys = allTypes()
                .getUniqueKeys(key)
                .sort();
              it(`expects definitions to match [${chalk.blue.bold.italic(modifiedBaseTypeKeys)}]`, () => {
                const demoGroupKeys = Groups[symbolize(demoGroup)][symbolize(testType)][symbolize(key)][_permittedKeys]().sort();
                expect(demoGroupKeys).toEqual(modifiedBaseTypeKeys);
              });
            });
          }
          if (demoGroup !== 'admin' && restricted()[demoGroup][testType].includes(key)) {
            describe(`restricted "${chalk.green.bold(key)}"`, () => {
              it(`expects "${chalk.yellow.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
                const group = Groups[symbolize(demoGroup)][symbolize(testType)];
                const groupType = group[symbolize(key)];
                expect(groupType).toBeUndefined();
              });
            });
          }
        });
    });
  });
});
