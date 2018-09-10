import { PropIdInterface } from '../../../compiler/interfaces';
import { _propId } from '../../symbols';
import { symbolize } from '../../util';

const CreatePropId = (name: string | symbol): PropIdInterface => ({
  [_propId]: {
    configurable: false,
    enumerable: false,
    value: symbolize(name),
    writable: false,
  },
});

export default CreatePropId;
