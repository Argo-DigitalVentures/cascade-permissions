import path from 'path';

import Create from './create';
import CloneTypes from './cloneTypes';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = `"CreateCloneTypes" strategy selected`;

export default function CreateCloneTypes(message, caller = defaultCaller, subject = defaultSubject) {
  return function createCloneTypes(prototype, typeList, restricted, name) {
    const clonedType = Create(message, caller, subject)(prototype, restricted, name);
    return CloneTypes(undefined, caller)(clonedType, typeList, restricted, name);
  };
}
