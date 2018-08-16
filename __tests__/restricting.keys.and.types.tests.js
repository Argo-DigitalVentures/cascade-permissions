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
const { _defineType, _inherit, _permittedKeys, _restrictedOwnKeysAdd, _restrictedOwnTypesAdd } = appSymbols;
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
  admin: {
    roles: [],
    types: [],
  },
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
  admin: {
    roles: BaseRoles(),
    types: BaseTypes(),
  },
  leastStrict: LeastStrict(),
  mostStrict: MostStrict(),
});

//////////////////////////////
// begin tests ///////////////
//////////////////////////////
describe(chalk.yellow.bold.underline('Restricting Inherited Definitions'), () => {
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
    const demoGroupRestrictedData = restrictedData()[demoGroup] || {};
    allTypeKeys.forEach(key => {
      const demoGroupRestrictedTypes = demoGroupRestrictedData.types || {};
      const demoGroupTypeRestrictedKeys = demoGroupRestrictedTypes[key] || [];
      if (demoGroupTypeRestrictedKeys.length) {
        const modifiedBaseTypeKeys = Object.keys(BaseTypes()[key]())
          .filter(item => !demoGroupTypeRestrictedKeys.includes(item))
          .sort();

        describe(`${chalk.blue.bold(demoGroup)}: "${chalk.yellow.bold(key)}" ${chalk.underline('restrictedKeys')} [${chalk.blue.italic(
          demoGroupTypeRestrictedKeys
        )}]`, () => {
          it(`restricts "${chalk.red.bold(key)}" keys from viewing [${chalk.red.italic(demoGroupTypeRestrictedKeys)}]`, () => {
            const demoGroupType = Groups[symbolize(demoGroup)][symbolize('types')][symbolize(key)];
            const predemoGroupTypeKeys = demoGroupType[_permittedKeys]().sort();
            // ///////////////////////////////
            // adding restrictedKeys here
            demoGroupType[_restrictedOwnKeysAdd](demoGroupTypeRestrictedKeys);
            // ///////////////////////////////
            const postdemoGroupTypeKeys = demoGroupType[_permittedKeys]().sort();
            const demoGroupTypeKeys = demoGroupType[_permittedKeys]().sort();

            expect(postdemoGroupTypeKeys).toEqual(modifiedBaseTypeKeys);
            expect(demoGroupTypeKeys).toEqual(expect.not.arrayContaining(demoGroupTypeRestrictedKeys));
            expect(predemoGroupTypeKeys).not.toEqual(postdemoGroupTypeKeys);
          });
          demoGroups.filter(item => item !== demoGroup).forEach(otherDemoGroup => {
            const otherdemoGroupTypes = restrictedData()[otherDemoGroup].types;
            const otherdemoGroupTypeRestrictedKeys = otherdemoGroupTypes[key] || [];
            const otherdemoGroupPermittedTypes = Object.keys(otherdemoGroupTypes);
            if (
              otherdemoGroupTypeRestrictedKeys.length &&
              otherdemoGroupPermittedTypes.length &&
              otherdemoGroupPermittedTypes.includes(key)
            ) {
              describe(`${chalk.underline('No side-effect')} restricting ${chalk.blue.bold(demoGroup)} "${chalk.green.bold(
                key
              )}"`, () => {
                it(`${chalk.blue.bold(otherDemoGroup)} "${chalk.green.bold(key)}" definitions ${chalk.yellow.bold(
                  'STILL'
                )} contains [${chalk.blue.italic(demoGroupTypeRestrictedKeys)}]`, () => {
                  const demoGroupType = Groups[symbolize(demoGroup)][symbolize('types')][symbolize(key)];
                  const otherdemoGroupType = Groups[symbolize(otherDemoGroup)][symbolize('types')][symbolize(key)];
                  const predemoGroupTypeKeys = demoGroupType[_permittedKeys]().sort();
                  const preOtherdemoGroupTypeKeys = otherdemoGroupType[_permittedKeys]().sort();
                  // ///////////////////////////////
                  // adding restrictedKeys here
                  demoGroupType[_restrictedOwnKeysAdd](demoGroupTypeRestrictedKeys);
                  // ///////////////////////////////
                  const postdemoGroupTypeKeys = demoGroupType[_permittedKeys]().sort();
                  const postOtherdemoGroupTypeKeys = otherdemoGroupType[_permittedKeys]().sort();

                  expect(preOtherdemoGroupTypeKeys).toEqual(postOtherdemoGroupTypeKeys);
                  expect(predemoGroupTypeKeys).not.toEqual(postdemoGroupTypeKeys);
                  expect(postdemoGroupTypeKeys).toEqual(modifiedBaseTypeKeys);
                  expect(postOtherdemoGroupTypeKeys).toEqual(expect.arrayContaining(demoGroupTypeRestrictedKeys));
                });
              });
            }
          });
        });
        describe(`${chalk.blue.bold(demoGroup)}: "${chalk.yellow.bold(key)}" ${chalk.underline(
          'restrictedTypes'
        )} [${chalk.blue.italic(key)}]`, () => {
          // describe(`Restricting "${chalk.blue.italic(key)}" to ${demoGroup}.types`, () => {
          it(chalk.red.bold(`removes "${key}"`), () => {
            const demoGroupTypes = Groups[symbolize(demoGroup)][symbolize('types')];
            const predemoGroupType = demoGroupTypes[symbolize(key)];
            // ///////////////////////////////
            // adding restrictedTypes here
            demoGroupTypes[_restrictedOwnTypesAdd]([key]);
            // ///////////////////////////////
            const postdemoGroupType = demoGroupTypes[symbolize(key)];
            expect(predemoGroupType).toBeDefined();
            expect(postdemoGroupType).toBeUndefined();
          });
        });
        demoGroups.filter(item => item !== demoGroup).forEach(otherDemoGroup => {
          const otherdemoGroupTypes = restrictedData()[otherDemoGroup].types;
          const otherdemoGroupTypeRestrictedKeys = otherdemoGroupTypes[key] || [];
          const otherdemoGroupPermittedTypes = Object.keys(otherdemoGroupTypes);
          if (
            otherdemoGroupTypeRestrictedKeys.length &&
            otherdemoGroupPermittedTypes.length &&
            otherdemoGroupPermittedTypes.includes(key)
          ) {
            describe(`${chalk.underline('No side-effect')} restricting ${chalk.blue.bold(demoGroup)} "${chalk.green.bold(
              key
            )}"`, () => {
              it(`${chalk.blue.bold(otherDemoGroup)} "${chalk.green.bold(key)}" definitions ${chalk.yellow.bold.underline(
                'STILL'
              )} contains [${chalk.blue.italic(key)}]`, () => {
                const demoGroupTypes = Groups[symbolize(demoGroup)][symbolize('types')];
                const otherdemoGroupTypes = Groups[symbolize(otherDemoGroup)][symbolize('types')];
                const predemoGroupType = demoGroupTypes[symbolize(key)];
                const preOtherdemoGroupType = otherdemoGroupTypes[symbolize(key)];
                // ///////////////////////////////
                // adding restrictedTypes here
                demoGroupTypes[_restrictedOwnTypesAdd]([key]);
                // ///////////////////////////////
                const postdemoGroupType = demoGroupTypes[symbolize(key)];
                const postOtherdemoGroupType = otherdemoGroupTypes[symbolize(key)];
                expect(predemoGroupType).toBeDefined();
                expect(postdemoGroupType).toBeUndefined();
                expect(preOtherdemoGroupType).toBeDefined();
                expect(postOtherdemoGroupType).toBeDefined();
                expect(preOtherdemoGroupType).toEqual(postOtherdemoGroupType);
              });
            });
          }
        });
      }
    });

    allRoleKeys.forEach(key => {
      const demoGroupRestrictedRoles = demoGroupRestrictedData.roles || {};
      const demoGroupRoleRestrictedKeys = demoGroupRestrictedRoles[key] || [];
      if (demoGroupRoleRestrictedKeys.length) {
        const modifiedBaseRoleKeys = Object.keys(BaseRoles()[key]())
          .filter(item => !demoGroupRoleRestrictedKeys.includes(item))
          .sort();

        describe(`${chalk.blue.bold(demoGroup)}: "${chalk.yellow.bold(key)}" ${chalk.underline('restrictedKeys')} [${chalk.blue.italic(
          demoGroupRoleRestrictedKeys
        )}]`, () => {
          it(`restricts "${chalk.red.bold(key)}" keys from viewing [${chalk.red.italic(demoGroupRoleRestrictedKeys)}]`, () => {
            const demoGroupRole = Groups[symbolize(demoGroup)][symbolize('roles')][symbolize(key)];
            const predemoGroupRoleKeys = demoGroupRole[_permittedKeys]().sort();
            // ///////////////////////////////
            // adding restrictedKeys here
            demoGroupRole[_restrictedOwnKeysAdd](demoGroupRoleRestrictedKeys);
            // ///////////////////////////////
            const postdemoGroupRoleKeys = demoGroupRole[_permittedKeys]().sort();
            const demoGroupRoleKeys = demoGroupRole[_permittedKeys]().sort();

            expect(postdemoGroupRoleKeys).toEqual(modifiedBaseRoleKeys);
            expect(demoGroupRoleKeys).toEqual(expect.not.arrayContaining(demoGroupRoleRestrictedKeys));
            expect(predemoGroupRoleKeys).not.toEqual(postdemoGroupRoleKeys);
          });
          demoGroups.filter(item => item !== demoGroup).forEach(otherDemoGroup => {
            const otherdemoGroupRoles = restrictedData()[otherDemoGroup].roles;
            const otherdemoGroupRoleRestrictedKeys = otherdemoGroupRoles[key] || [];
            const otherdemoGroupPermittedRoles = Object.keys(otherdemoGroupRoles);
            if (
              otherdemoGroupRoleRestrictedKeys.length &&
              otherdemoGroupPermittedRoles.length &&
              otherdemoGroupPermittedRoles.includes(key)
            ) {
              describe(`${chalk.underline('No side-effect')} restricting ${chalk.blue.bold(demoGroup)} "${chalk.green.bold(
                key
              )}"`, () => {
                it(`${chalk.blue.bold(otherDemoGroup)} "${chalk.green.bold(key)}" definitions ${chalk.yellow.bold(
                  'STILL'
                )} contains [${chalk.blue.italic(demoGroupRoleRestrictedKeys)}]`, () => {
                  const demoGroupRole = Groups[symbolize(demoGroup)][symbolize('roles')][symbolize(key)];
                  const otherdemoGroupRole = Groups[symbolize(otherDemoGroup)][symbolize('roles')][symbolize(key)];
                  const predemoGroupRoleKeys = demoGroupRole[_permittedKeys]().sort();
                  const preOtherdemoGroupRoleKeys = otherdemoGroupRole[_permittedKeys]().sort();
                  // ///////////////////////////////
                  // adding restrictedKeys here
                  demoGroupRole[_restrictedOwnKeysAdd](demoGroupRoleRestrictedKeys);
                  // ///////////////////////////////
                  const postdemoGroupRoleKeys = demoGroupRole[_permittedKeys]().sort();
                  const postOtherdemoGroupRoleKeys = otherdemoGroupRole[_permittedKeys]().sort();

                  expect(preOtherdemoGroupRoleKeys).toEqual(postOtherdemoGroupRoleKeys);
                  expect(predemoGroupRoleKeys).not.toEqual(postdemoGroupRoleKeys);
                  expect(postdemoGroupRoleKeys).toEqual(modifiedBaseRoleKeys);
                  expect(postOtherdemoGroupRoleKeys).toEqual(expect.arrayContaining(demoGroupRoleRestrictedKeys));
                });
              });
            }
          });
        });
        describe(`${chalk.blue.bold(demoGroup)}: "${chalk.yellow.bold(key)}" ${chalk.underline(
          'restrictedTypes'
        )} [${chalk.blue.italic(key)}]`, () => {
          // describe(`Restricting "${chalk.blue.italic(key)}" to ${demoGroup}.roles`, () => {
          it(chalk.red.bold(`removes "${key}"`), () => {
            const demoGroupRoles = Groups[symbolize(demoGroup)][symbolize('roles')];
            const predemoGroupRole = demoGroupRoles[symbolize(key)];
            // ///////////////////////////////
            // adding restrictedTypes here
            demoGroupRoles[_restrictedOwnTypesAdd]([key]);
            // ///////////////////////////////
            const postdemoGroupRole = demoGroupRoles[symbolize(key)];
            expect(predemoGroupRole).toBeDefined();
            expect(postdemoGroupRole).toBeUndefined();
          });
        });
        demoGroups.filter(item => item !== demoGroup).forEach(otherDemoGroup => {
          const otherdemoGroupRoles = restrictedData()[otherDemoGroup].roles;
          const otherdemoGroupRoleRestrictedKeys = otherdemoGroupRoles[key] || [];
          const otherdemoGroupPermittedRoles = Object.keys(otherdemoGroupRoles);
          if (
            otherdemoGroupRoleRestrictedKeys.length &&
            otherdemoGroupPermittedRoles.length &&
            otherdemoGroupPermittedRoles.includes(key)
          ) {
            describe(`${chalk.underline('No side-effect')} restricting ${chalk.blue.bold(demoGroup)} "${chalk.green.bold(
              key
            )}"`, () => {
              it(`${chalk.blue.bold(otherDemoGroup)} "${chalk.green.bold(key)}" definitions ${chalk.yellow.bold.underline(
                'STILL'
              )} contains [${chalk.blue.italic(key)}]`, () => {
                const demoGroupRoles = Groups[symbolize(demoGroup)][symbolize('roles')];
                const otherdemoGroupRoles = Groups[symbolize(otherDemoGroup)][symbolize('roles')];
                const predemoGroupRole = demoGroupRoles[symbolize(key)];
                const preOtherdemoGroupRole = otherdemoGroupRoles[symbolize(key)];
                // ///////////////////////////////
                // adding restrictedTypes here
                demoGroupRoles[_restrictedOwnTypesAdd]([key]);
                // ///////////////////////////////
                const postdemoGroupRole = demoGroupRoles[symbolize(key)];
                const postOtherdemoGroupRole = otherdemoGroupRoles[symbolize(key)];
                expect(predemoGroupRole).toBeDefined();
                expect(postdemoGroupRole).toBeUndefined();
                expect(preOtherdemoGroupRole).toBeDefined();
                expect(postOtherdemoGroupRole).toBeDefined();
                expect(preOtherdemoGroupRole).toEqual(postOtherdemoGroupRole);
              });
            });
          }
        });
      }
    });
  });
});
