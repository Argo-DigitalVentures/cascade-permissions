//////////////////////////////
// begin imports /////////////
//////////////////////////////
import chalk from 'chalk';
import { appSymbols, BaseFactory, helper, util } from '../../lib';
import { BaseRoles, BaseTypes, LeastStrict, MostStrict, TestRoles } from '../../test_helpers';

//////////////////////////////
// begin setup ///////////////
//////////////////////////////
const { _inherit } = appSymbols;
const { CreateDomain, TypeWrapper } = helper;
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
describe(`${chalk.yellow.bold.underline('Wrapping Data')}: with applied "${chalk.blue.bold('keys')}" and "${chalk.blue.bold(
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
      if (demoGroup === 'super_user') {
        Groups[_inherit](demoGroup, {
          restrictedTypes: otherDemoGroups,
        });
      } else {
        const { roles = [], types = [] } = restricted()[demoGroup];
        Groups[_inherit](demoGroup, {
          restrictedKeys: restrictedData()[demoGroup],
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
          const demoGroupRestrictedRoles = demoGroupRestrictedData[domainType] || {};
          const demoGroupRoleRestrictedKeys = demoGroupRestrictedRoles[key] || [];

          if (demoGroupRestrictedRoles[key]) {
            describe(`wrapping "${chalk.yellow.bold(key)}" with restrictedKeys [${chalk.blue.italic(
              demoGroupRoleRestrictedKeys,
            )}] `, () => {
              const testData = TestRoles()[key]();
              const modifiedBaseRoleKeys = allRoles()
                .getUniqueKeys(key)
                .filter(item => !demoGroupRoleRestrictedKeys.includes(item))
                .sort();
              it(`expects definitions to match [${chalk.blue.bold.italic(modifiedBaseRoleKeys)}]`, () => {
                const wrappedData = TypeWrapper(Groups, domainType)(demoGroup, key, testData);
                const demoGroupRoleKeys = Object.keys(wrappedData).sort();
                expect(demoGroupRoleKeys).toEqual(modifiedBaseRoleKeys);
              });
            });
          }
        });
    });
  });
});
