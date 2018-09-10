import { basename } from 'path';

import { CloneTypesSignature, LoggerSignature } from '../../compiler/types';
import CloneTypes from './cloneTypes';
import Create from './create';

const filename = `${basename(__dirname)}/${basename(__filename)}`;
const defaultCaller = filename;
const defaultSubject = '"CreateCloneTypes" strategy selected';

const CreateCloneTypes: LoggerSignature<CloneTypesSignature> = (message, caller = defaultCaller, subject = defaultSubject) => (
  prototype,
  typeList,
  restricted,
  name
) => {
  const createdCloneType = Create(message, caller, subject)(prototype, restricted, name);
  return CloneTypes(undefined, caller)(createdCloneType, typeList, restricted, name);
};

export default CreateCloneTypes;
