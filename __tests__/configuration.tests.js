/* eslint-disable no-unused-vars */
'use strict';
import { appSymbols, BaseFactory, util, TypeHandler } from '../lib';
import {
  BaseRoles,
  BaseTypes,
  LessRestrictedGroup,
  VeryRestrictedGroup,
} from './util';
import {
  getDomainTypes,
  getUniqueKeys,
  getRestrictedDomainList,
  DefineByExclusionKeys,
} from '../lib/helper';

const { admin, basic, moderator } = BaseRoles();
const { account, forum, message, transaction } = BaseTypes();
const allRole = () => getUniqueKeys(admin(), basic(), moderator());
const allType = () =>
  getUniqueKeys(account(), forum(), message(), transaction());

const RolesDefinedByExclusionKeys = () => DefineByExclusionKeys(BaseRoles());
const TypesDefinedByExclusionKeys = () => DefineByExclusionKeys(BaseTypes());
const {
  _defineType,
  _inherit,
  _permittedTypes,
  _permittedValues,
  _permittedKeys,
  _restrictedKeys,
  _restrictedOwnKeysAdd,
  _restrictedOwnTypesAdd,
} = appSymbols;
const { desymbolize, symbolize } = util;
const superUserType = 'super_users';
const restricted = () => ({
  lessRestrictedGroup: {
    roles: getRestrictedDomainList(
      RolesDefinedByExclusionKeys(),
      LessRestrictedGroup().roles
    ),
    types: getRestrictedDomainList(
      TypesDefinedByExclusionKeys(),
      LessRestrictedGroup().types
    ),
  },
  veryRestrictedGroup: {
    roles: getRestrictedDomainList(
      RolesDefinedByExclusionKeys(),
      VeryRestrictedGroup().roles
    ),
    types: getRestrictedDomainList(
      TypesDefinedByExclusionKeys(),
      VeryRestrictedGroup().types
    ),
  },
});
const restrictedData = () => ({
  lessRestrictedGroup: LessRestrictedGroup(),
  veryRestrictedGroup: VeryRestrictedGroup(),
});

const allTypeKeys = getDomainTypes(BaseTypes());
const allRoleKeys = getDomainTypes(BaseRoles());
// const restrictedGroupRestrictedRoles = allRoleKeys.filter(item => !restrictedGroupRoles.includes(item));
const demoGroups = ['admin', 'lessRestrictedGroup', 'veryRestrictedGroup'];
describe('Configuration', () => {
  let Types;
  let Roles;
  beforeAll(() => {
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
  });
  afterAll(() => {
    Roles = undefined;
    Types = undefined;
  });
  describe('"Basic" DefineType Method', () => {
    describe('Genesis "Types"', () => {
      allTypeKeys.forEach(key => {
        it(`Expects Types.${key} permitted keys to match ${key} keys`, () => {
          const targetType = Types[symbolize(key)];
          const permittedTypeKeys = targetType[_permittedKeys]().sort();
          const typeKeys = Object.keys(BaseTypes()[key]()).sort();
          expect(permittedTypeKeys).toEqual(typeKeys);
        });
      });
    });
    describe('Genesis "Roles"', () => {
      allRoleKeys.forEach(key => {
        it(`Expects Roles.${key} permitted keys to match ${key}`, () => {
          const Role = Roles[symbolize(key)];
          const permittedRoleKeys = Role[_permittedKeys]().sort();
          const roleKeys = Object.keys(BaseRoles()[key]()).sort();
          expect(permittedRoleKeys).toEqual(roleKeys);
        });
      });
    });
  });
  describe('Complex Methods', () => {
    let Groups;
    beforeEach(() => {
      Groups = BaseFactory(
        'bu',
        {},
        { [symbolize('roles')]: Roles, [symbolize('types')]: Types }
      );
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
    });
    demoGroups.forEach(demoGroup => {
      describe(`"Inherit" Custom Types by ${demoGroup}`, () => {
        allTypeKeys.forEach(key => {
          if (
            demoGroup === 'admin' ||
            !restricted()[demoGroup].types.includes(key)
          ) {
            it(`Expects Groups.${demoGroup}.types.${key} permitted keys to match ${key} keys`, () => {
              const group = Groups[symbolize(demoGroup)][symbolize('types')];
              const groupType = group[symbolize(key)];
              const targetTypeKeys = Object.keys(BaseTypes()[key]()).sort();
              const permittedTypeKeys = groupType[_permittedKeys]().sort();
              expect(permittedTypeKeys).toEqual(targetTypeKeys);
            });
          } else {
            it(`Expects Groups.${demoGroup}.types.${key}" to be undefined`, () => {
              const group = Groups[symbolize(demoGroup)][symbolize('types')];
              const groupType = group[symbolize(key)];
              expect(groupType).toBeUndefined();
            });
          }
        });
        allRoleKeys.forEach(key => {
          if (
            demoGroup === 'admin' ||
            !restricted()[demoGroup].roles.includes(key)
          ) {
            it(`Expects Groups.${demoGroup}.roles.${key} permitted keys to match ${key} keys`, () => {
              const group = Groups[symbolize(demoGroup)][symbolize('roles')];
              const groupRole = group[symbolize(key)];
              const targetRoleKeys = Object.keys(BaseRoles()[key]()).sort();
              const permittedRoleKeys = groupRole[_permittedKeys]().sort();
              expect(permittedRoleKeys).toEqual(targetRoleKeys);
            });
          } else {
            it(`Expects Groups.${demoGroup}.roles.${key}" to be undefined`, () => {
              const group = Groups[symbolize(demoGroup)][symbolize('roles')];
              const groupRole = group[symbolize(key)];
              expect(groupRole).toBeUndefined();
            });
          }
        });
      });
    });
    demoGroups.forEach(demoGroup => {
      describe('Helper Method: "_restrictedOwnKeysAdd" post-creation', () => {
        allTypeKeys.forEach(key => {
          const restrictedGroup = restrictedData()[demoGroup] || {};
          const restrictedTypes = restrictedGroup.types || {};
          const restrictedTypeKeys = restrictedTypes[key] || [];

          if (demoGroup !== 'admin' && restrictedTypeKeys.length) {
            it(`Expects adding restrictedKeys to Groups.${demoGroup}.types.${key} to change the ${key} permitted keys minus ${restrictedTypeKeys}`, () => {
              const groupType =
                Groups[symbolize(demoGroup)][symbolize('types')][
                  symbolize(key)
                ];
              groupType[_restrictedOwnKeysAdd](restrictedTypeKeys);
              const modifiedTypeKeys = Object.keys(BaseTypes()[key]())
                .filter(item => !restrictedTypeKeys.includes(item))
                .sort();

              const modifiedPermittedTypeKeys = groupType[
                _permittedKeys
              ]().sort();
              expect(modifiedPermittedTypeKeys).toEqual(modifiedTypeKeys);
              expect(modifiedPermittedTypeKeys).toEqual(
                expect.not.arrayContaining(restrictedTypeKeys)
              );
            });
          } else if (demoGroup === 'admin') {
            demoGroups
              .filter(item => item !== demoGroup)
              .forEach(nonAdminGroup => {
                it(`Expects adding restrictedKeys to Groups.${nonAdminGroup}.types.${key} will not affect Groups.${demoGroup}.types.${key} permitted keys`, () => {
                  const groupType =
                    Groups[symbolize(demoGroup)][symbolize('types')][
                      symbolize(key)
                    ];
                  const nonAdminGroupPermittedTypes = restrictedData()[
                    nonAdminGroup
                  ].types;
                  const nonAdminGroupPermitted = Object.keys(
                    nonAdminGroupPermittedTypes
                  );
                  if (
                    nonAdminGroupPermitted.length &&
                    nonAdminGroupPermitted.includes(key)
                  ) {
                    const nonAdminGroupRestrictedTypeKeys =
                      nonAdminGroupPermittedTypes[key];
                    const typeKeys = Object.keys(BaseTypes()[key]()).sort();
                    const restrictedGroupGroupType =
                      Groups[symbolize(nonAdminGroup)][symbolize('types')][
                        symbolize(key)
                      ];
                    restrictedGroupGroupType[_restrictedOwnKeysAdd](
                      nonAdminGroupPermittedTypes[key]
                    );
                    const modifiedTypeKeys = Object.keys(BaseTypes()[key]())
                      .filter(
                        item => !nonAdminGroupRestrictedTypeKeys.includes(item)
                      )
                      .sort();
                    const restrictedGroupPermittedValues = restrictedGroupGroupType[
                      _permittedKeys
                    ]().sort();
                    const groupTypePermittedValues = groupType[
                      _permittedKeys
                    ]().sort();
                    expect(restrictedGroupPermittedValues).toEqual(
                      modifiedTypeKeys
                    );
                    expect(restrictedGroupPermittedValues).toEqual(
                      expect.not.arrayContaining(
                        nonAdminGroupRestrictedTypeKeys
                      )
                    );
                    expect(groupTypePermittedValues).toEqual(typeKeys);
                    expect(groupTypePermittedValues).not.toEqual(
                      restrictedGroupPermittedValues
                    );
                  }
                });
              });
          }
        });
        allRoleKeys.forEach(key => {
          const restrictedGroup = restrictedData()[demoGroup] || {};
          const restrictedRoles = restrictedGroup.roles || {};
          const restrictedRoleKeys = restrictedRoles[key] || [];

          if (demoGroup !== 'admin' && restrictedRoleKeys.length) {
            it(`Expects adding restrictedKeys to Groups.${demoGroup}.roles.${key} to change the ${key} permitted keys minus ${restrictedRoleKeys}`, () => {
              const groupRole =
                Groups[symbolize(demoGroup)][symbolize('roles')][
                  symbolize(key)
                ];
              groupRole[_restrictedOwnKeysAdd](restrictedRoleKeys);
              const modifiedRoleKeys = Object.keys(BaseRoles()[key]())
                .filter(item => !restrictedRoleKeys.includes(item))
                .sort();

              const modifiedPermittedRoleKeys = groupRole[
                _permittedKeys
              ]().sort();
              expect(modifiedPermittedRoleKeys).toEqual(modifiedRoleKeys);
              expect(modifiedPermittedRoleKeys).toEqual(
                expect.not.arrayContaining(restrictedRoleKeys)
              );
            });
          } else if (demoGroup === 'admin') {
            demoGroups
              .filter(item => item !== demoGroup)
              .forEach(nonAdminGroup => {
                it(`Expects adding restrictedKeys to Groups.${nonAdminGroup}.roles.${key} will not affect Groups.${demoGroup}.roles.${key} permitted keys`, () => {
                  const groupRole =
                    Groups[symbolize(demoGroup)][symbolize('types')][
                      symbolize(key)
                    ];
                  const nonAdminGroupPermittedRoles = restrictedData()[
                    nonAdminGroup
                  ].types;
                  const nonAdminGroupPermitted = Object.keys(
                    nonAdminGroupPermittedRoles
                  );
                  if (
                    nonAdminGroupPermitted.length &&
                    nonAdminGroupPermitted.includes(key)
                  ) {
                    const nonAdminGroupRestrictedRoleKeys =
                      nonAdminGroupPermittedRoles[key];
                    const roleKeys = Object.keys(BaseRoles()[key]()).sort();
                    const restrictedGroupGroupRole =
                      Groups[symbolize(nonAdminGroup)][symbolize('types')][
                        symbolize(key)
                      ];
                    restrictedGroupGroupRole[_restrictedOwnKeysAdd](
                      nonAdminGroupPermittedRoles[key]
                    );
                    const modifiedRoleKeys = Object.keys(BaseRoles()[key]())
                      .filter(
                        item => !nonAdminGroupRestrictedRoleKeys.includes(item)
                      )
                      .sort();
                    const restrictedGroupPermittedValues = restrictedGroupGroupRole[
                      _permittedKeys
                    ]().sort();
                    const groupRolePermittedValues = groupRole[
                      _permittedKeys
                    ]().sort();
                    expect(restrictedGroupPermittedValues).toEqual(
                      modifiedRoleKeys
                    );
                    expect(restrictedGroupPermittedValues).toEqual(
                      expect.not.arrayContaining(
                        nonAdminGroupRestrictedRoleKeys
                      )
                    );
                    expect(groupRolePermittedValues).toEqual(roleKeys);
                    expect(groupRolePermittedValues).not.toEqual(
                      restrictedGroupPermittedValues
                    );
                  }
                });
              });
          }
        });
      });
    });
    demoGroups.forEach(demoGroup => {
      describe('Helper Method: "_restrictedOwnTypesAdd" post-creation', () => {
        allTypeKeys.forEach(key => {
          const restrictedGroup = restrictedData()[demoGroup] || {};
          const restrictedTypes = restrictedGroup.types || {};
          const restrictedType = restrictedTypes[key];

          if (demoGroup === 'admin' || restrictedType) {
            demoGroups
              .filter(item => item !== demoGroup)
              .forEach(otherGroup => {
                const restrictedOtherGroup = restrictedData()[otherGroup] || {};
                const restrictedOtherGroupTypes =
                  restrictedOtherGroup.types || {};
                const restrictedOtherGroupType = restrictedOtherGroupTypes[key];
                if (restrictedOtherGroupType || otherGroup === 'admin') {
                  it(`Expects adding restrictedTypes "${key}" to Groups.${demoGroup}.types will NOT affect Groups.${otherGroup}.types`, () => {
                    const symbolizeName = symbolize(key);
                    const groupTypes =
                      Groups[symbolize(demoGroup)][symbolize('types')];
                    const preGroupType = groupTypes[symbolizeName];
                    groupTypes[_restrictedOwnTypesAdd]([symbolizeName]);
                    const postGroupType = groupTypes[symbolizeName];
                    expect(preGroupType).toBeDefined();
                    expect(postGroupType).toBeUndefined();
                    const otherGroupType =
                      Groups[symbolize(otherGroup)][symbolize('types')][
                        symbolize(key)
                      ];
                    expect(otherGroupType).toBeDefined();
                  });
                }
              });
          }
        });
        allRoleKeys.forEach(key => {
          const restrictedGroup = restrictedData()[demoGroup] || {};
          const restrictedRoles = restrictedGroup.roles || {};
          const restrictedRole = restrictedRoles[key];
          if (demoGroup === 'admin' || restrictedRole) {
            demoGroups
              .filter(item => item !== demoGroup)
              .forEach(otherGroup => {
                const restrictedOtherGroup = restrictedData()[otherGroup] || {};
                const restrictedOtherGroupRoles =
                  restrictedOtherGroup.roles || {};
                const restrictedOtherGroupRole = restrictedOtherGroupRoles[key];
                if (restrictedOtherGroupRole || otherGroup === 'admin') {
                  it(`Expects adding restrictedTypes "${key}" to Groups.${demoGroup}.roles will NOT affect Groups.${otherGroup}.roles`, () => {
                    const symbolizeName = symbolize(key);
                    const groupRoles =
                      Groups[symbolize(demoGroup)][symbolize('roles')];
                    const preGroupRole = groupRoles[symbolizeName];
                    groupRoles[_restrictedOwnTypesAdd]([symbolizeName]);
                    const postGroupRole = groupRoles[symbolizeName];
                    expect(preGroupRole).toBeDefined();
                    expect(postGroupRole).toBeUndefined();
                    const otherGroupRole =
                      Groups[symbolize(otherGroup)][symbolize('roles')][
                        symbolize(key)
                      ];
                    expect(otherGroupRole).toBeDefined();
                  });
                }
              });
          }
        });
      });
    });
  });
});

/* eslint-enable */
