//////////////////////////////
// begin imports /////////////
//////////////////////////////
import chalk from 'chalk';
import { appSymbols, BaseFactory, helper, util } from '../../lib';
import { BaseRoles, BaseTypes, LeastStrict, MostStrict, TestRoles } from '../../test_helpers';

//////////////////////////////
// begin setup ///////////////
//////////////////////////////
const { _defineType, _inherit } = appSymbols;
const { DefineByExclusionKeys, getDomainTypes, getRestrictedDomainList, getUniqueKeys } = helper;
const { symbolize } = util;
const { admin, basic, moderator } = BaseRoles();
const { account, forum, message, transaction } = BaseTypes();

const demoGroups = ['admin', 'leastStrict', 'mostStrict'];
const allRoleKeys = getDomainTypes(BaseRoles());
const allTypeKeys = getDomainTypes(BaseTypes());
const { TypeWrapper } = helper;
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
        `defining ${key} for "Types" factory`,
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
        `defining ${key} for "Types" factory`,
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
      allRoleKeys.forEach(key => {
        const testType = 'roles';
        const demoGroupRestrictedRoles = demoGroupRestrictedData.roles || {};
        const demoGroupRoleRestrictedKeys = demoGroupRestrictedRoles[key] || [];
        if (demoGroupRoleRestrictedKeys.length) {
          describe(`wrapping "${chalk.yellow.bold(key)}" with restrictedKeys [${chalk.blue.italic(demoGroupRoleRestrictedKeys)}] `, () => {
            const testData = TestRoles()[key]();
            const modifiedBaseRoleKeys = Object.keys(BaseRoles()[key]())
              .filter(item => !demoGroupRoleRestrictedKeys.includes(item))
              .sort();
            it(`expects definitions to match [${chalk.blue.bold.italic(modifiedBaseRoleKeys)}]`, () => {
              const wrappedData = TypeWrapper(Groups, testType)(demoGroup, key, testData);
              const demoGroupRoleKeys = Object.keys(wrappedData).sort();
              expect(demoGroupRoleKeys).toEqual(modifiedBaseRoleKeys);
            });
            // it(`expects definitions to ${chalk.red.bold.underline('not')} contain [${chalk.blue.bold.italic(
            //   demoGroupRoleRestrictedKeys,
            // )}]`, () => {
            //   const demoGroupRoleKeys = Groups[symbolize(demoGroup)][symbolize('roles')][symbolize(key)][_permittedKeys]().sort();
            //   expect(demoGroupRoleKeys).toEqual(expect.not.arrayContaining(demoGroupRoleRestrictedKeys));
            // });
          });
        }
        // if (demoGroup !== 'admin' && restricted()[demoGroup].roles.includes(key)) {
        //   describe(`restricted "${chalk.green.bold(key)}"`, () => {
        //     it(`expects "${chalk.yellow.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
        //       const group = Groups[symbolize(demoGroup)][symbolize('roles')];
        //       const groupRole = group[symbolize(key)];
        //       expect(groupRole).toBeUndefined();
        //     });
        //   });
        // }
      });
      allTypeKeys.forEach(key => {
        //   const demoGroupRestrictedTypes = demoGroupRestrictedData.types || {};
        //   const demoGroupTypeRestrictedKeys = demoGroupRestrictedTypes[key] || [];
        //   if (demoGroupTypeRestrictedKeys.length) {
        //     describe(`inheriting "${chalk.yellow.bold(key)}" with restrictedKeys [${chalk.blue.italic(
        //       demoGroupTypeRestrictedKeys,
        //     )}] `, () => {
        //       const modifiedBaseTypeKeys = Object.keys(BaseTypes()[key]())
        //         .filter(item => !demoGroupTypeRestrictedKeys.includes(item))
        //         .sort();
        //       it(`expects definitions to match [${chalk.blue.bold.italic(modifiedBaseTypeKeys)}]`, () => {
        //         const demoGroupTypeKeys = Groups[symbolize(demoGroup)][symbolize('types')][symbolize(key)][_permittedKeys]().sort();
        //         expect(demoGroupTypeKeys).toEqual(modifiedBaseTypeKeys);
        //       });
        //       it(`expects definitions to ${chalk.red.bold.underline('not')} contain [${chalk.blue.bold.italic(
        //         demoGroupTypeRestrictedKeys,
        //       )}]`, () => {
        //         const demoGroupTypeKeys = Groups[symbolize(demoGroup)][symbolize('types')][symbolize(key)][_permittedKeys]().sort();
        //         expect(demoGroupTypeKeys).toEqual(expect.not.arrayContaining(demoGroupTypeRestrictedKeys));
        //       });
        //     });
        //   }
        //   if (demoGroup !== 'admin' && restricted()[demoGroup].types.includes(key)) {
        //     describe(`restricted "${chalk.green.bold(key)}"`, () => {
        //       it(`expects "${chalk.yellow.bold(key)}" to be ${chalk.red.bold('undefined')}`, () => {
        //         const group = Groups[symbolize(demoGroup)][symbolize('types')];
        //         const groupType = group[symbolize(key)];
        //         expect(groupType).toBeUndefined();
        //       });
        //     });
        //   }
      });
    });
  });
});
