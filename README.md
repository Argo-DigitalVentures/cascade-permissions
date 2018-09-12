# Cascade-Permissions

### Description

This package addresses the burden of managing multiple types of users with different, or at times, overlapping permissions.

<details><summary>Background</summary>

#### Scaling
While working on an MVP application with role-based users that were:

1. restricted from viewing a particular type of data
2. restricted from viewing a property / properties on an authorized data.

We ran into issues scaling to other business-units as the legacy code base used conditionals which I named "multiple conditional hell"

##### Multiple-Conditional-Hell Example

###### Assume this object represents the relevant data

```javascript
const dataFromStore = {
  username: 'someName',
  message: 'some message',
  chat_room: 'some chat room topic',
  creation_date: '2018-08-09',
  modified_data: '2018-08-10',
};
```

##### 1. Started with an innucous conditional authorizing the "power_user" role users

```javascript
// Using an ES6-Promise
return getUser(id).then(user => {
  if (user.role === 'power_user') {
    return dataFromStore;
  } else {
    return Promise.reject(user);
  }
});
```

##### 2. As the application grew, the use-cases expanded

```javascript
return getUser(id).then(user => {
  if (user.role === 'power_user' || user.seniority === 'senior') {
    return dataFromStore;
  } else {
    return Promise.reject(user);
  }
});
```

##### 3. Expanded some more

```javascript
return getUser(id).then(user => {
  if (user.role === 'power_user' || user.seniority === 'senior' || (user.role === 'basic_user' && user.associations.includes('permitted_data'))) {
    return dataFromStore;
  } else {
    return Promise.reject(user);
  }
});
```

##### 4. When we moved out of the MVP phase, we encountered the problem that an authorized user required a subset of the permissions.

```javascript
return getUser(id).then(user => {
  if (user.role === 'power_user' || user.seniority === 'senior' || (user.role === 'basic_user' && user.associations.includes('permitted_data'))) {
    if (user.role === 'basic_user' && user.associations.includes('permitted_data')) {
      // have to remove data the user is not authorized to see.
      delete dataFromStore.creation_date;
    }
    return dataFromStore;
  } else {
    return Promise.reject(user);
  }
});
```

</details>

### Package Details

<details><summary>How It Works</summary>

Using the Javascript's native **prototype-chain** and an "**exclusion**" list approach, role-based permissions become inheritable and therefore, may be cascaded across different groups / subgroups.
</details>

<details><summary>Package Features</summary>

1. **Inheritable permissions**
  - rules changes in the parent is dynamically reflected in the child.

2. **Restrictinng data access**
Using ES6-proxies (sorry IE users) and the user's runtime permissions:
  - accessing a restricted property will return undefined
  - setting a restricted property will result in an authorization error

</details>
<details>
<summary>Package Limitations</summary>

- Still a Proof-of-concept,
- Limited to shallow objects (1 layer deep)

</details>

### **Installation**

<details><summary>install package from npm with node 8+ or transpile the package</summary>

```sh
npm i cascade-permissions
```
</details>

### Step 1: Basic Definitions

Define the properties that represents your application's data shape.

##### The example creates two domains, "roles" and "types"

<details>
<summary>Roles definition </summary>

```javascript
// assume there are just three roles, "Admin", "Basic", "Moderator"

// the "values" can be any thing in this POC.
export default function Admin() {
return {
  authorized_date: '2018-01-30',
  id: 10,
  last_active_date: '2018-08-10',
  username: 'admin.doe',
};
}
export default function Basic() {
return {
  id: 7,
  last_active_date: '2018-08-01',
  signup_date: '2018-07-25',
  username: 'basic.doe',
};
}
export default function Moderator() {
return {
  authorized_date: '2018-07-23',
  id: 6,
  last_active_date: '2018-08-16',
  signup_date: '2018-03-20',
  username: 'moderator.doe',
};
}
```

</details>

<details>
<summary>Types definition</summary>

##### Define Types (of data)

```javascript
// assume there are just three types, "Account", "Message", "Transaction"

// the values "true" can be any thing in this POC.
// account.js
export default function Account() {
return {
  first_name: true,
  id: true,
  last_name: true,
  last_active_date: true,
  signup_date: true,
  username: true,
};
}
// message.js
export default function Message() {
return {
  account_id: true,
  date: true,
  forum: true,
  id: true,
  message: true,
  modified_date: true,
  receiver_username: true,
};
}
// transaction.js
export default function Transaction() {
return {
  account_id: true,
  date: true,
  id: true,
  invoice_amount: true,
  product: true,
  purchase_amount: true,
  purchase_method: true,
  repeated_purchase: true,
  tax_amount: true,
};
}
```

</details>

### Step 2: Create Domain Rules

Create the rules-specific to a domain (ie. rules for the "Roles")

<details>
<summary>1. Create domain dictionary (unique keys)</summary>
For example, the "roles" dictionary contains the unqiue keys of the keys that define "admin", "basic", and "moderator";
</details>

<details>
<summary>2. Create "exclusion list" domain representation</summary>

Invert the definition of an "admin" role to the keys that **do not** represent an "admin" role based of the dictionary (hence "exclusion-list").

#### Exclusion-list formula is [uniqueKeys] - [typeDefinitionKeys] = typeExclusionKeys

</details>

<details>
<summary>3. Create inheritable domain-rules</summary>
Create an domain dictionary with its specific types defined by the exclusion list.

```javascript
const Roles = {
  authorized_date: true,
  id: true,
  last_active_date: true,
  signup_date: true,
  username: true,
  [Symbol('admin')]: [
    /* adminExclusionList */
  ],
  [Symbol('basic')]: [
    /* basicExclusionList */
  ],
  [Symbol('moderator')]: [
    /* moderatorExclusionList */
  ],
};
```

</details>

</details>

#### Create Domain Rules: Implementation Options

<details>
<summary>Option 1: Easy way</summary>

Provide the definitions as an object to the **CreateDomain** and call the **createRules** helper method

<details><summary>Roles-domain rules</summary>

```javascript
import { helper } from 'cascade-permissions';

const { CreateDomain } = helper;

// application-defined types
import admin from './admin';
import basic from './basic';
import moderator from './moderator';
const allRoles = CreateDomain({
  admin,
  basic,
  moderator,
});

const Roles = AllRoles.createRules('roles');
```

</details>

<details><summary>Types-domain rules</summary>

```javascript
import { helper } from 'cascade-permissions';

const { CreateDomain } = helper;

// application-defined types
import account from './account';
import message from './message';
import transaction from './transaction';
const allTypes = CreateDomain({
  account,
  **message**,
  transaction,
});

const Types = AllTypes.createRules('types');
```

  </details>

</details>

<details>
<summary>Option 2: Hard / "understand-how-it-works" way</summary>

##### A. Create a dictionary / unique list of keys for a domain

###### this is a naive method that works only for shallow objects.

<details>
<summary>Roles dictionary</summary>

```javascript
// using the roles already created above
import account from '../someDirectory/account';
import message from '../someDirectory/message';
import transaction from '../someDirectory/transaction';

const allTypes = Object.assign({}, account(), message(), transaction());
```

</details>

<details>
<summary>Types dictionary</summary>

```javascript
// using the roles already created above
import admin from '../someDirectory/admin';
import basic from '../someDirectory/basic';
import moderator from '../someDirectory/moderator';

const allRoles = Object.assign({}, admin(), basic(), moderataor());
```

</details>

##### B. Define each type based on an "exclusion list" of keys.

###### The exclusion list formula is **[uniqueKeys] - [typeDefinitionKeys] = typeExclusionKeys**

<details>
<summary>Example: admin role</summary>

###### For example, to define an admin data object

```javascript
const adminObj = {
  first_name: 'someFirstName',
  last_name: 'someLastName',
  username: 'someUsername',
};
const messageObj = {
  message: 'some text written here',
  username: 'someUserName',
  createdDate: '2018-01-01',
  modifiedDate: '2018-01-03',
};
const allRolesKeys = ['createdDate', 'first_name', 'last_name', 'message', 'modifiedDate', 'username'];
const adminExclusionKeys = allRolesKeys.filter(item => !Object.keys(adminObj).includes(item)); // ['createdDate', 'message', 'modifiedDate'];
```

</details>

##### C. Create domain-rules object via "BaseFactory"

<details>
<summary>Roles-domain rules</summary>

```javascript
import { appSymbols, BaseFactory } from 'cascade-permissions';
const { _defineType } = appSymbols;

const allRolesDictionary = {
// list of unique key + arbitrary values
};
const adminExclusionKeys = [// uniqueKeys that do not represent an admin]
const basicExclusionKeys = [// uniqueKeys that do not represent an basic]
const moderatorExclusionKeys = [// uniqueKeys that do not represent an moderator]

// this return an object that includes a _defineType method;
const Roles = BaseFactory('roles', {}, allRolesDictionary);
Roles[_defineType]('admin', {
restrictedKeys: adminExclusionKeys,
restrictedTypes: ['basic','moderator']
})

Roles[_defineType]('basic', {
restrictedKeys: basicExclusionKeys,
restrictedTypes: ['admin','moderator']
})

Roles[_defineType]('moderator', {
restrictedKeys: moderatorExclusionKeys,
restrictedTypes: ['admin','basic']
})
```

</details>

<details>
<summary>Types-domain rules</summary>

```javascript
import { appSymbols, BaseFactory } from 'cascade-permissions';
const { _defineType } = appSymbols;

const allTypesDictionary = {
// list of unique key + arbitrary values
};
const accountExclusionKeys = [// uniqueKeys that do not represent an account]
const messageExclusionKeys = [// uniqueKeys that do not represent an message]
const transactionExclusionKeys = [// uniqueKeys that do not represent an transaction]

// this return an object that includes a _defineType method;
const Types = BaseFactory('types', {}, allTypesDictionary);
Types[_defineType]('account', {
restrictedKeys: accountExclusionKeys,
restrictedTypes: ['message','transaction']
})

Types[_defineType]('message', {
restrictedKeys: messageExclusionKeys,
restrictedTypes: ['account','transaction']
})

Types[_defineType]('transaction', {
restrictedKeys: transactionExclusionKeys,
restrictedTypes: ['account','message']
})
```

</details>

</details>

### Step 3: Inherit Domain Rules
The fun part begins. How do you inherit these rules for your application?

##### Example assumes application has 2 groups of users "internal" and "external".

```javascript
import { appSymbols, BaseFactory, helper } from 'cascade-permissions'

// assume allRoles is defined as we did earlier
const Roles = allRoles().createRules('rules')
// assume allTypes is defined as we did earlier
const Types = allTypes().createRules('types')

// create a Groups object
const Groups = BaseFactory('groups', {}, {
  [Symbol('roles')]: Roles,
  [Symbol('types')]: Types
})

```

#### Scenarios

<details>
<summary>1. Inherting all the rules</summary>

##### Situation: "internal" users have zero restrictions

```javascript
Groups[_inherit]('internal', {
  restrictedTypes: ['external']
})
```

The interal user will have all "roles" and all "types"

</details>

<details><summary>2. Inherting a subset of the rules</summary>

##### Situation: "external" users are restricted from "admin" role and "transaction" type
```javascript
Groups[_inherit]('internal', {
  restrictedTypes: ['internal', 'admin', 'transaction']
})
```

The external user will have all "roles" except the "admin" role, and all "types" except the "transaction" types.

</details>

<details><summary>3. Inherting a subset of the rules + global domain key restrictions</summary>

#### Situation: "external" users are restricted from "admin" role and "transaction" type. In addition, the "id" property is not authorized any domains.

```javascript
Groups[_inherit]('internal', {
  restrictedKeys: ['id'],
  restrictedTypes: ['internal', 'admin', 'transaction']
})
```

The external user will have all "roles" except the "admin" role, and all "types" except the "transaction" types. In addition, any domain types with an "id" property is not visible to the user.

</details>


<details><summary>4. Inherting a subset of the rules + domain specific restrictions</summary>

#### Situation: "external" users are restricted from "admin" role and "transaction" type. In addition, the "account" type ['first_name', 'last_name'] and "basic" role ['last_active_date'] are not authorized.

```javascript
Groups[_inherit]('internal', {
  restrictedKeys: {
    account: ['first_name', 'last_name'],
    basic: ['last_active_date']
  },
  restrictedTypes: ['internal', 'admin', 'transaction']
})
```

The external user will have all "roles" except the "admin" role, and all "types" except the "transaction" types. In addition, the "basic" role's "last_active_date" and the "account" type's "first_name" & "last_name" are not visible.

</details>

### Step 4. Wrapping Application Data with the TypeWrapper

#### Situation: Assume an interal user is restricted the "basic" role's "last_active_date" and receives data representing another user's "basic" data.

```javascript
import { helper } from 'cascade-permissions';

const { TypeWrapper } = helper;

const someUsersBasicData = {
    id: 1023,
    last_active_date: '2018-01-18',
    signup_date: '2017-10-14',
    username: 'john.doe'
}

//assume the Roles and Types is already defined;
const Groups = BaseFactory('groups', {}, {
  [Symbol('roles')]: Roles,
  [Symbol('types')]: Types
})
Groups[_inherit]('internal', {
  restrictedKeys: {
    account: ['first_name', 'last_name'],
    basic: ['last_active_date']
  },
  restrictedTypes: ['internal', 'admin', 'transaction']
})
const wrappedData = TypeWrapper(Groups, 'roles')('internal', 'basic', someUsersBasicData);

wrapperData.id // 1023
wrappedData.last_active_date // undefined
wrappedData.last_active_date = Date() // the key "last_active_date" is restricted and cannot be set

```
