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

const demoGroups = ['super_user', 'leastStrict', 'mostStrict'];
const allRoles = CreateDomain(BaseRoles());
const allTypes = CreateDomain(BaseTypes());
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
      if (demoGroup === 'super_user') {
        Groups[_inherit](demoGroup, {
          restrictedTypes: otherDemoGroups,
        });
      } else {
        const { roles = [], types = [] } = restricted()[demoGroup];
        Groups[_inherit](demoGroup, {
          restrictedTypes: [{ [symbolize('roles')]: roles }, { [symbolize('types')]: types }, ...otherDemoGroups],
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
          const domainType = 'roles';
          const demoGroupRestricted = demoGroupRestrictedData[domainType] || {};
          const demoGroupRestrictedKeys = demoGroupRestricted[key] || [];
          if (demoGroupRestrictedKeys.length) {
            describe(`inheriting "${chalk.yellow.bold(key)}"`, () => {
              const modifiedBaseRoleKeys = allRoles()
                .getUniqueKeys(key)
                .sort();
              it(`expects definitions to match [${chalk.blue.bold.italic(modifiedBaseRoleKeys)}]`, () => {
                const demoGroupKeys = Groups[symbolize(demoGroup)][symbolize(domainType)][symbolize(key)][_permittedKeys]().sort();
                expect(demoGroupKeys).toEqual(modifiedBaseRoleKeys);
              });
            });
          }
          if (demoGroup !== 'super_user' && restricted()[demoGroup][domainType].includes(key)) {
            describe(`restricted "${chalk.green.bold(key)}"`, () => {
              it(`expects "${chalk.yellow.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
                const group = Groups[symbolize(demoGroup)][symbolize(domainType)];
                const groupType = group[symbolize(key)];
                expect(groupType).toBeUndefined();
              });
            });
          }
        });
      allTypes()
        .getUniqueTypes()
        .forEach(key => {
          const domainType = 'types';
          const demoGroupRestricted = demoGroupRestrictedData[domainType] || {};
          const demoGroupRestrictedKeys = demoGroupRestricted[key] || [];
          if (demoGroupRestrictedKeys.length) {
            describe(`inheriting "${chalk.yellow.bold(key)}"`, () => {
              const modifiedBaseTypeKeys = allTypes()
                .getUniqueKeys(key)
                .sort();
              it(`expects definitions to match [${chalk.blue.bold.italic(modifiedBaseTypeKeys)}]`, () => {
                const demoGroupKeys = Groups[symbolize(demoGroup)][symbolize(domainType)][symbolize(key)][_permittedKeys]().sort();
                expect(demoGroupKeys).toEqual(modifiedBaseTypeKeys);
              });
            });
          }
          if (demoGroup !== 'super_user' && restricted()[demoGroup][domainType].includes(key)) {
            describe(`restricted "${chalk.green.bold(key)}"`, () => {
              it(`expects "${chalk.yellow.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
                const group = Groups[symbolize(demoGroup)][symbolize(domainType)];
                const groupType = group[symbolize(key)];
                expect(groupType).toBeUndefined();
              });
            });
          }
        });
    });
  });
});
