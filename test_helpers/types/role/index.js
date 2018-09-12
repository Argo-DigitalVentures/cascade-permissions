import admin from './admin';
import basic from './basic';
import moderator from './moderator';

export default function BaseRoles() {
  return {
    admin,
    basic,
    moderator,
  };
}
