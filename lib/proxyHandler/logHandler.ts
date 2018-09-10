import { basename } from 'path';
import { desymbolize, logMessage } from '../util';

const filename = `${basename(__dirname)}/${basename(__filename)}`;

export default function LogHandler(
  message = 'no message received',
  caller = `default: ${filename}`,
  subject = `${filename}: apply proxy trapped`,
  { color = 'white', bold = false } = {}
) {
  return {
    apply(target, context, args) {
      if (process.env.NODE_ENV === 'debug') {
        logMessage(desymbolize(caller), { color, bold }, target.name, desymbolize(subject), desymbolize(message));
      }

      return Reflect.apply(target, context, args);
    },
  };
}
