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
const {
  _defineType,
  _inherit,
  _permittedKeys,
  _restrictedOwnKeysAdd,
  _restrictedOwnTypesAdd
} = appSymbols;
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
  admin: {
    roles: [],
    types: []
  },
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
  admin: {
    roles: BaseRoles(),
    types: BaseTypes()
  },
  leastStrict: LeastStrict(),
  mostStrict: MostStrict()
});

//////////////////////////////
// begin tests ///////////////
//////////////////////////////
describe(`${chalk.yellow.bold.underline('Methods')}: applying"${chalk.blue.bold(
  'keys'
)}" and "${chalk.blue.bold('types')}" restrictions`, () => {
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
        {
          message: 'from created "Roles" factory',
          caller: key,
          subject: `defining ${key} for "Types" factory`
        }
      );
    });
    Types = BaseFactory('types', {}, allType(), {
      message: 'from created "Types"'
    });
    allTypeKeys.forEach(key => {
      // const test = TypesDefinedByExclusionKeys()[key];
      // console.log('what is test', test)
      Types[_defineType](
        key,
        {
          restrictedKeys: TypesDefinedByExclusionKeys()[key],
          restrictedTypes: allTypeKeys.filter(item => item !== key)
        },
        undefined,
        {
          message: 'from created "Types" factory',
          caller: key,
          subject: `defining ${key} for "Types" factory`
        }
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
    describe(`${chalk.blue.bold(demoGroup)}`, () => {
      const demoGroupRestrictedData = restrictedData()[demoGroup] || {};

      allRoleKeys.forEach(key => {
        const demoGroupRestrictedRoles = demoGroupRestrictedData.roles || {};
        const demoGroupRoleRestrictedKeys = demoGroupRestrictedRoles[key] || [];
        if (demoGroupRoleRestrictedKeys.length) {
          const modifiedBaseRoleKeys = Object.keys(BaseRoles()[key]())
            .filter(item => !demoGroupRoleRestrictedKeys.includes(item))
            .sort();

          describe(`restricting keys [${chalk.blue.italic(
            demoGroupRoleRestrictedKeys
          )}] to ${chalk.blue.bold(demoGroup)} "${chalk.yellow.bold(
            key
          )}" definitions`, () => {
            it(`restricts [${chalk.blue.italic(
              demoGroupRoleRestrictedKeys
            )}] from ${chalk.blue.bold(demoGroup)} "${chalk.yellow.bold(
              key
            )}" definitions`, () => {
              const demoGroupRole =
                Groups[symbolize(demoGroup)][symbolize('roles')][
                  symbolize(key)
                ];
              const preDemoGroupRoleKeys = demoGroupRole[
                _permittedKeys
              ]().sort();
              // ///////////////////////////////
              // adding restrictedKeys here
              demoGroupRole[_restrictedOwnKeysAdd](demoGroupRoleRestrictedKeys);
              // ///////////////////////////////
              const postdemoGroupRoleKeys = demoGroupRole[
                _permittedKeys
              ]().sort();
              const demoGroupRoleKeys = demoGroupRole[_permittedKeys]().sort();

              expect(postdemoGroupRoleKeys).toEqual(modifiedBaseRoleKeys);
              expect(demoGroupRoleKeys).toEqual(
                expect.not.arrayContaining(demoGroupRoleRestrictedKeys)
              );
              expect(preDemoGroupRoleKeys).not.toEqual(postdemoGroupRoleKeys);
            });
            demoGroups
              .filter(item => item !== demoGroup)
              .forEach(otherDemoGroup => {
                const otherDemoGroupRoles = restrictedData()[otherDemoGroup]
                  .roles;
                const otherDemoGroupRoleRestrictedKeys =
                  otherDemoGroupRoles[key] || [];
                const otherDemoGroupPermittedRoles = Object.keys(
                  otherDemoGroupRoles
                );
                if (
                  otherDemoGroupRoleRestrictedKeys.length &&
                  otherDemoGroupPermittedRoles.length &&
                  otherDemoGroupPermittedRoles.includes(key)
                ) {
                  describe(`restricting keys [${chalk.blue.italic(
                    demoGroupRoleRestrictedKeys
                  )}] to ${chalk.blue.bold(demoGroup)} "${chalk.yellow.bold(
                    key
                  )}" definitions has ${chalk.red.bold.underline(
                    'NO'
                  )} side-effects`, () => {
                    it(`${chalk.blue.bold(otherDemoGroup)} "${chalk.green.bold(
                      key
                    )}" definitions ${chalk.yellow.bold(
                      'STILL'
                    )} contains [${chalk.blue.italic(
                      demoGroupRoleRestrictedKeys
                    )}]`, () => {
                      const demoGroupRole =
                        Groups[symbolize(demoGroup)][symbolize('roles')][
                          symbolize(key)
                        ];
                      const otherDemoGroupRole =
                        Groups[symbolize(otherDemoGroup)][symbolize('roles')][
                          symbolize(key)
                        ];
                      const predemoGroupRoleKeys = demoGroupRole[
                        _permittedKeys
                      ]().sort();
                      const preOtherDemoGroupRoleKeys = otherDemoGroupRole[
                        _permittedKeys
                      ]().sort();
                      // ///////////////////////////////
                      // adding restrictedKeys here
                      demoGroupRole[_restrictedOwnKeysAdd](
                        demoGroupRoleRestrictedKeys
                      );
                      // ///////////////////////////////
                      const postdemoGroupRoleKeys = demoGroupRole[
                        _permittedKeys
                      ]().sort();
                      const postOtherDemoGroupRoleKeys = otherDemoGroupRole[
                        _permittedKeys
                      ]().sort();

                      expect(preOtherDemoGroupRoleKeys).toEqual(
                        postOtherDemoGroupRoleKeys
                      );
                      expect(predemoGroupRoleKeys).not.toEqual(
                        postdemoGroupRoleKeys
                      );
                      expect(postdemoGroupRoleKeys).toEqual(
                        modifiedBaseRoleKeys
                      );
                      expect(postOtherDemoGroupRoleKeys).toEqual(
                        expect.arrayContaining(demoGroupRoleRestrictedKeys)
                      );
                    });
                  });
                }
              });
          });
          describe(`restricting type "${chalk.yellow.bold(
            key
          )}" to ${chalk.blue.bold(demoGroup)}`, () => {
            it(`removes "${chalk.yellow.bold(key)}" from ${chalk.blue.bold(
              demoGroup
            )}`, () => {
              const demoGroupRoles =
                Groups[symbolize(demoGroup)][symbolize('roles')];
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
          demoGroups
            .filter(item => item !== demoGroup)
            .forEach(otherDemoGroup => {
              const otherDemoGroupRoles = restrictedData()[otherDemoGroup]
                .roles;
              const otherDemoGroupRoleRestrictedKeys =
                otherDemoGroupRoles[key] || [];
              const otherDemoGroupPermittedRoles = Object.keys(
                otherDemoGroupRoles
              );
              if (
                otherDemoGroupRoleRestrictedKeys.length &&
                otherDemoGroupPermittedRoles.length &&
                otherDemoGroupPermittedRoles.includes(key)
              ) {
                describe(`restricting type "${chalk.green.bold(
                  key
                )}" to ${chalk.blue.bold(
                  demoGroup
                )} has ${chalk.red.bold.underline('NO')} side-effects`, () => {
                  it(`${chalk.blue.bold(otherDemoGroup)} "${chalk.green.bold(
                    key
                  )}" is ${chalk.yellow.bold.underline(
                    'STILL'
                  )} defined`, () => {
                    const demoGroupRoles =
                      Groups[symbolize(demoGroup)][symbolize('roles')];
                    const otherDemoGroupRoles =
                      Groups[symbolize(otherDemoGroup)][symbolize('roles')];
                    const predemoGroupRole = demoGroupRoles[symbolize(key)];
                    const preOtherDemoGroupRole =
                      otherDemoGroupRoles[symbolize(key)];
                    // ///////////////////////////////
                    // adding restrictedTypes here
                    demoGroupRoles[_restrictedOwnTypesAdd]([key]);
                    // ///////////////////////////////
                    const postdemoGroupRole = demoGroupRoles[symbolize(key)];
                    const postOtherDemoGroupRole =
                      otherDemoGroupRoles[symbolize(key)];
                    expect(predemoGroupRole).toBeDefined();
                    expect(postdemoGroupRole).toBeUndefined();
                    expect(preOtherDemoGroupRole).toBeDefined();
                    expect(postOtherDemoGroupRole).toBeDefined();
                    expect(preOtherDemoGroupRole).toEqual(
                      postOtherDemoGroupRole
                    );
                  });
                });
              }
            });
        }
      });
      allTypeKeys.forEach(key => {
        const demoGroupRestrictedTypes = demoGroupRestrictedData.types || {};
        const demoGroupTypeRestrictedKeys = demoGroupRestrictedTypes[key] || [];
        if (demoGroupTypeRestrictedKeys.length) {
          const modifiedBaseTypeKeys = Object.keys(BaseTypes()[key]())
            .filter(item => !demoGroupTypeRestrictedKeys.includes(item))
            .sort();

          describe(`restricting keys [${chalk.blue.italic(
            demoGroupTypeRestrictedKeys
          )}] to ${chalk.blue.bold(demoGroup)} "${chalk.yellow.bold(
            key
          )}" definitions`, () => {
            it(`restricts [${chalk.blue.italic(
              demoGroupTypeRestrictedKeys
            )}] from ${chalk.blue.bold(demoGroup)} "${chalk.yellow.bold(
              key
            )}" definitions`, () => {
              const demoGroupType =
                Groups[symbolize(demoGroup)][symbolize('types')][
                  symbolize(key)
                ];
              const predemoGroupTypeKeys = demoGroupType[
                _permittedKeys
              ]().sort();
              // ///////////////////////////////
              // adding restrictedKeys here
              demoGroupType[_restrictedOwnKeysAdd](demoGroupTypeRestrictedKeys);
              // ///////////////////////////////
              const postdemoGroupTypeKeys = demoGroupType[
                _permittedKeys
              ]().sort();
              const demoGroupTypeKeys = demoGroupType[_permittedKeys]().sort();

              expect(postdemoGroupTypeKeys).toEqual(modifiedBaseTypeKeys);
              expect(demoGroupTypeKeys).toEqual(
                expect.not.arrayContaining(demoGroupTypeRestrictedKeys)
              );
              expect(predemoGroupTypeKeys).not.toEqual(postdemoGroupTypeKeys);
            });
            demoGroups
              .filter(item => item !== demoGroup)
              .forEach(otherDemoGroup => {
                const otherDemoGroupTypes = restrictedData()[otherDemoGroup]
                  .types;
                const otherDemoGroupTypeRestrictedKeys =
                  otherDemoGroupTypes[key] || [];
                const otherDemoGroupPermittedTypes = Object.keys(
                  otherDemoGroupTypes
                );
                if (
                  otherDemoGroupTypeRestrictedKeys.length &&
                  otherDemoGroupPermittedTypes.length &&
                  otherDemoGroupPermittedTypes.includes(key)
                ) {
                  describe(`restricting keys [${chalk.blue.italic(
                    demoGroupTypeRestrictedKeys
                  )}] to ${chalk.blue.bold(demoGroup)} "${chalk.yellow.bold(
                    key
                  )}" definitions has ${chalk.red.bold.underline(
                    'NO'
                  )} side-effects`, () => {
                    it(`${chalk.blue.bold(otherDemoGroup)} "${chalk.green.bold(
                      key
                    )}" definitions ${chalk.yellow.bold(
                      'STILL'
                    )} contains [${chalk.blue.italic(
                      demoGroupTypeRestrictedKeys
                    )}]`, () => {
                      const demoGroupType =
                        Groups[symbolize(demoGroup)][symbolize('types')][
                          symbolize(key)
                        ];
                      const otherDemoGroupType =
                        Groups[symbolize(otherDemoGroup)][symbolize('types')][
                          symbolize(key)
                        ];
                      const predemoGroupTypeKeys = demoGroupType[
                        _permittedKeys
                      ]().sort();
                      const preOtherDemoGroupTypeKeys = otherDemoGroupType[
                        _permittedKeys
                      ]().sort();
                      // ///////////////////////////////
                      // adding restrictedKeys here
                      demoGroupType[_restrictedOwnKeysAdd](
                        demoGroupTypeRestrictedKeys
                      );
                      // ///////////////////////////////
                      const postdemoGroupTypeKeys = demoGroupType[
                        _permittedKeys
                      ]().sort();
                      const postOtherDemoGroupTypeKeys = otherDemoGroupType[
                        _permittedKeys
                      ]().sort();

                      expect(preOtherDemoGroupTypeKeys).toEqual(
                        postOtherDemoGroupTypeKeys
                      );
                      expect(predemoGroupTypeKeys).not.toEqual(
                        postdemoGroupTypeKeys
                      );
                      expect(postdemoGroupTypeKeys).toEqual(
                        modifiedBaseTypeKeys
                      );
                      expect(postOtherDemoGroupTypeKeys).toEqual(
                        expect.arrayContaining(demoGroupTypeRestrictedKeys)
                      );
                    });
                  });
                }
              });
          });
          describe(`restricting type "${chalk.yellow.bold(
            key
          )}" to ${chalk.blue.bold(demoGroup)}`, () => {
            it(`removes "${chalk.yellow.bold(key)}" from ${chalk.blue.bold(
              demoGroup
            )}`, () => {
              const demoGroupTypes =
                Groups[symbolize(demoGroup)][symbolize('types')];
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
          demoGroups
            .filter(item => item !== demoGroup)
            .forEach(otherDemoGroup => {
              const otherDemoGroupTypes = restrictedData()[otherDemoGroup]
                .types;
              const otherDemoGroupTypeRestrictedKeys =
                otherDemoGroupTypes[key] || [];
              const otherDemoGroupPermittedTypes = Object.keys(
                otherDemoGroupTypes
              );
              if (
                otherDemoGroupTypeRestrictedKeys.length &&
                otherDemoGroupPermittedTypes.length &&
                otherDemoGroupPermittedTypes.includes(key)
              ) {
                describe(`restricting type "${chalk.green.bold(
                  key
                )}" to ${chalk.blue.bold(
                  demoGroup
                )} has ${chalk.red.bold.underline('NO')} side-effects`, () => {
                  it(`${chalk.blue.bold(otherDemoGroup)} "${chalk.green.bold(
                    key
                  )}" is ${chalk.yellow.bold.underline(
                    'STILL'
                  )} defined`, () => {
                    const demoGroupTypes =
                      Groups[symbolize(demoGroup)][symbolize('types')];
                    const otherDemoGroupTypes =
                      Groups[symbolize(otherDemoGroup)][symbolize('types')];
                    const predemoGroupType = demoGroupTypes[symbolize(key)];
                    const preOtherDemoGroupType =
                      otherDemoGroupTypes[symbolize(key)];
                    // ///////////////////////////////
                    // adding restrictedTypes here
                    demoGroupTypes[_restrictedOwnTypesAdd]([key]);
                    // ///////////////////////////////
                    const postdemoGroupType = demoGroupTypes[symbolize(key)];
                    const postOtherDemoGroupType =
                      otherDemoGroupTypes[symbolize(key)];
                    expect(predemoGroupType).toBeDefined();
                    expect(postdemoGroupType).toBeUndefined();
                    expect(preOtherDemoGroupType).toBeDefined();
                    expect(postOtherDemoGroupType).toBeDefined();
                    expect(preOtherDemoGroupType).toEqual(
                      postOtherDemoGroupType
                    );
                  });
                });
              }
            });
        }
      });
    });
  });
});
