import Account from './account';
import Forum from './forum';
import Message from './message';
import Transaction from './transaction';

export default function BaseTypes() {
  return {
    account: () => Account(),
    forum: () => Forum(),
    message: () => Message(),
    transaction: () => Transaction(),
  };
}
