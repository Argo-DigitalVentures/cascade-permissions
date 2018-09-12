//////////////////////////////
// begin imports /////////////
//////////////////////////////
import chalk from 'chalk';
import { appSymbols, helper, util } from '../../lib';
import { BaseRoles, BaseTypes } from '../../test_helpers';

//////////////////////////////
// begin setup ///////////////
//////////////////////////////
const { _permittedKeys } = appSymbols;
const { CreateDomain } = helper;
const { symbolize } = util;
const { admin, basic, moderator } = BaseRoles();
const { account, forum, message, transaction } = BaseTypes();

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

//////////////////////////////
// begin tests ///////////////
//////////////////////////////
describe(chalk.yellow.bold.underline('Define Types'), () => {
  let Roles;
  let Types;
  beforeAll(() => {
    Roles = allRoles().createRules('roles');
    Types = allTypes().createRules('types');
  });
  afterAll(() => {
    Roles = undefined;
    Types = undefined;
  });
  describe(`defining "${chalk.blue.bold('roles')}"`, () => {
    allRoles()
      .getUniqueTypes()
      .forEach(key => {
        const roleKeys = allRoles()
          .getUniqueKeys(key)
          .sort();
        it(`expects "${chalk.green.bold(key)}" to match definitions [${chalk.blue.bold.italic(roleKeys)}]`, () => {
          const Role = Roles[symbolize(key)];
          const permittedRoleKeys = Role[_permittedKeys]().sort();
          expect(permittedRoleKeys).toEqual(roleKeys);
        });
      });
  });
  describe(`defining "${chalk.blue.bold('types')}"`, () => {
    allTypes()
      .getUniqueTypes()
      .forEach(key => {
        const typeKeys = allTypes()
          .getUniqueKeys(key)
          .sort();
        it(`expects "${chalk.green.bold(key)}" to match definitions [${chalk.blue.bold.italic(typeKeys)}]`, () => {
          const targetType = Types[symbolize(key)];
          const permittedTypeKeys = targetType[_permittedKeys]().sort();
          expect(permittedTypeKeys).toEqual(typeKeys);
        });
      });
  });
});
