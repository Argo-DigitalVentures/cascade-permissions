//////////////////////////////
// begin imports /////////////
//////////////////////////////
import chalk from 'chalk';
import { appSymbols, BaseFactory, helper, util } from '../../lib';
import { BaseRoles, BaseTypes } from '../../test_helpers';

//////////////////////////////
// begin setup ///////////////
//////////////////////////////
const { _defineType, _permittedKeys } = appSymbols;
const { DefineByExclusionKeys, getDomainTypes, getUniqueKeys } = helper;
const { symbolize } = util;
const { admin, basic, moderator } = BaseRoles();
const { account, forum, message, transaction } = BaseTypes();

const allRole = () => getUniqueKeys(admin(), basic(), moderator());
const allType = () => getUniqueKeys(account(), forum(), message(), transaction());
const RolesDefinedByExclusionKeys = () => DefineByExclusionKeys(BaseRoles());
const TypesDefinedByExclusionKeys = () => DefineByExclusionKeys(BaseTypes());
const allTypeKeys = getDomainTypes(BaseTypes());
const allRoleKeys = getDomainTypes(BaseRoles());

//////////////////////////////
// begin tests ///////////////
//////////////////////////////
describe(chalk.yellow.bold.underline('Define Types'), () => {
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
        `defining ${key} for "Types" factory`,
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
        `defining ${key} for "Types" factory`,
      );
    });
  });
  afterAll(() => {
    Roles = undefined;
    Types = undefined;
  });
  describe(`defining "${chalk.blue.bold('roles')}"`, () => {
    allRoleKeys.forEach(key => {
      const roleKeys = Object.keys(BaseRoles()[key]()).sort();
      it(`expects "${chalk.green.bold(key)}" to match definitions [${chalk.blue.bold.italic(roleKeys)}]`, () => {
        const Role = Roles[symbolize(key)];
        const permittedRoleKeys = Role[_permittedKeys]().sort();
        expect(permittedRoleKeys).toEqual(roleKeys);
      });
    });
  });
  describe(`defining "${chalk.blue.bold('types')}"`, () => {
    allTypeKeys.forEach(key => {
      const typeKeys = Object.keys(BaseTypes()[key]()).sort();
      it(`expects "${chalk.green.bold(key)}" to match definitions [${chalk.blue.bold.italic(typeKeys)}]`, () => {
        const targetType = Types[symbolize(key)];
        const permittedTypeKeys = targetType[_permittedKeys]().sort();
        expect(permittedTypeKeys).toEqual(typeKeys);
      });
    });
  });
});
