import path from 'path';
import { desymbolize, logMessage } from '../util';

const filename = `${path.basename(__dirname)}/${path.basename(__filename)}`;

export default function LogHandler(
  message = 'no message received',
  caller = `default: ${filename}`,
  subject = `${filename}: apply proxy trapped`,
  { color = 'white', bold = false, verbose = false } = {}
) {
  return {
    apply(target, context, args) {
      const { NODE_ENV, npm_config_loglevel } = process.env;
      if (NODE_ENV === 'debug') {
        const isVerboseLogMode = npm_config_loglevel === 'verbose';
        if ((!isVerboseLogMode && !verbose) || (isVerboseLogMode && verbose)) {
          logMessage(
            desymbolize(caller),
            { color, bold },
            target.name,
            desymbolize(subject),
            desymbolize(message)
          );
        }
      }

      return Reflect.apply(target, context, args);
    },
  };
}
