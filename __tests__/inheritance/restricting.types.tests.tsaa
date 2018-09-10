//////////////////////////////
// begin imports /////////////
//////////////////////////////
import chalk from 'chalk';
import { appSymbols, BaseFactory, helper, util } from '../../lib';
import {
  BaseRoles,
  BaseTypes,
  LeastStrict,
  MostStrict
} from '../../test_helpers';

//////////////////////////////
// begin setup ///////////////
//////////////////////////////
const { _defineType, _inherit, _permittedKeys } = appSymbols;
const {
  DefineByExclusionKeys,
  getDomainTypes,
  getRestrictedDomainList,
  getUniqueKeys
} = helper;
const { symbolize } = util;
const { admin, basic, moderator } = BaseRoles();
const { account, forum, message, transaction } = BaseTypes();

const demoGroups = ['admin', 'leastStrict', 'mostStrict'];
const allRoleKeys = getDomainTypes(BaseRoles());
const allTypeKeys = getDomainTypes(BaseTypes());
const allRole = () => getUniqueKeys(admin(), basic(), moderator());
const allType = () =>
  getUniqueKeys(account(), forum(), message(), transaction());
const baseObjects = {
  roles: BaseRoles,
  types: BaseTypes
};
const RolesDefinedByExclusionKeys = () => DefineByExclusionKeys(BaseRoles());
const TypesDefinedByExclusionKeys = () => DefineByExclusionKeys(BaseTypes());
const restricted = () => ({
  leastStrict: {
    roles: getRestrictedDomainList(
      RolesDefinedByExclusionKeys(),
      LeastStrict().roles
    ),
    types: getRestrictedDomainList(
      TypesDefinedByExclusionKeys(),
      LeastStrict().types
    )
  },
  mostStrict: {
    roles: getRestrictedDomainList(
      RolesDefinedByExclusionKeys(),
      MostStrict().roles
    ),
    types: getRestrictedDomainList(
      TypesDefinedByExclusionKeys(),
      MostStrict().types
    )
  }
});
const restrictedData = () => ({
  leastStrict: LeastStrict(),
  mostStrict: MostStrict()
});

//////////////////////////////
// begin tests ///////////////
//////////////////////////////
describe(`${chalk.yellow.bold.underline(
  'Inheritance'
)}: applying "${chalk.blue.bold('types')}" restrictions`, () => {
  let Groups;
  let Roles;
  let Types;
  beforeEach(() => {
    Roles = BaseFactory('roles', {}, allRole(), {
      message: 'from created "Roles"'
    });
    allRoleKeys.forEach(key => {
      Roles[_defineType](
        key,
        {
          restrictedKeys: RolesDefinedByExclusionKeys()[key],
          restrictedTypes: allRoleKeys.filter(target => target !== key)
        },
        undefined,
        'from created "Roles" factory',
        key,
        `defining ${key} for "Types" factory`
      );
    });
    Types = BaseFactory('types', {}, allType(), {
      message: 'from created "Types"'
    });
    allTypeKeys.forEach(key => {
      Types[_defineType](
        key,
        {
          restrictedKeys: TypesDefinedByExclusionKeys()[key],
          restrictedTypes: allTypeKeys.filter(item => item !== key)
        },
        undefined,
        'from created "Types" factory',
        key,
        `defining ${key} for "Types" factory`
      );
    });
    Groups = BaseFactory(
      'demo',
      {},
      { [symbolize('roles')]: Roles, [symbolize('types')]: Types }
    );
    demoGroups.forEach(demoGroup => {
      const otherDemoGroups = demoGroups.filter(item => item !== demoGroup);
      if (demoGroup === 'admin') {
        Groups[_inherit](demoGroup, {
          restrictedTypes: otherDemoGroups
        });
      } else {
        const { roles = [], types = [] } = restricted()[demoGroup];
        Groups[_inherit](demoGroup, {
          restrictedTypes: [...roles, ...types, ...otherDemoGroups]
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
        const demoGroupRestricted = demoGroupRestrictedData[testType] || {};
        const demoGroupRestrictedKeys = demoGroupRestricted[key] || [];
        if (demoGroupRestrictedKeys.length) {
          describe(`inheriting "${chalk.yellow.bold(key)}"`, () => {
            const modifiedBaseKeys = Object.keys(
              baseObjects[testType]()[key]()
            ).sort();
            it(`expects definitions to match [${chalk.blue.bold.italic(
              modifiedBaseKeys
            )}]`, () => {
              const demoGroupKeys = Groups[symbolize(demoGroup)][
                symbolize(testType)
              ][symbolize(key)]
                [_permittedKeys]()
                .sort();
              expect(demoGroupKeys).toEqual(modifiedBaseKeys);
            });
          });
        }
        if (
          demoGroup !== 'admin' &&
          restricted()[demoGroup][testType].includes(key)
        ) {
          describe(`restricted "${chalk.green.bold(key)}"`, () => {
            it(`expects "${chalk.yellow.bold(key)}" to be ${chalk.red.bold(
              'undefined'
            )}`, () => {
              const group = Groups[symbolize(demoGroup)][symbolize(testType)];
              const groupType = group[symbolize(key)];
              expect(groupType).toBeUndefined();
            });
          });
        }
      });
      allTypeKeys.forEach(key => {
        const testType = 'types';
        const demoGroupRestricted = demoGroupRestrictedData[testType] || {};
        const demoGroupRestrictedKeys = demoGroupRestricted[key] || [];
        if (demoGroupRestrictedKeys.length) {
          describe(`inheriting "${chalk.yellow.bold(key)}"`, () => {
            const modifiedBaseKeys = Object.keys(
              baseObjects[testType]()[key]()
            ).sort();
            it(`expects definitions to match [${chalk.blue.bold.italic(
              modifiedBaseKeys
            )}]`, () => {
              const demoGroupKeys = Groups[symbolize(demoGroup)][
                symbolize(testType)
              ][symbolize(key)]
                [_permittedKeys]()
                .sort();
              expect(demoGroupKeys).toEqual(modifiedBaseKeys);
            });
          });
        }
        if (
          demoGroup !== 'admin' &&
          restricted()[demoGroup][testType].includes(key)
        ) {
          describe(`restricted "${chalk.green.bold(key)}"`, () => {
            it(`expects "${chalk.yellow.bold(key)}" to be ${chalk.red.bold(
              'undefined'
            )}`, () => {
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
