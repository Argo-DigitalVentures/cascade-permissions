import Admin from './admin';
import Basic from './basic';
import Moderator from './moderator';

export default function BaseRoles() {
  return {
    admin: () => Admin(),
    basic: () => Basic(),
    moderator: () => Moderator(),
  };
}
