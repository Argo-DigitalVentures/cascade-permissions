/* eslint-disable no-console */

import chalk from 'chalk';
import { desymbolize } from './symbolize';

function colorizeDelimiter(str = '', delimiter = '"') {
  return str
    .split(delimiter)
    .reduce(
      (col, item) =>
        !item
          ? col
          : /\s/.test(item)
            ? col + item
            : col + `"${chalk.red.bold(item)}"`,
      ''
    );
}
export function createMessage(
  filename,
  { color = 'yellow', bold = false } = {},
  caller,
  subject
) {
  const callerMessage = `[${chalk.blue.bold.underline(
    'caller'
  )}]: ${chalk.green.italic(desymbolize(caller))}`;

  const subjectMessage = `[${chalk.blue.bold.underline(
    'subject'
  )}]: ${chalk.green(colorizeDelimiter(desymbolize(subject)))}`;

  const fileMessage = `[${chalk.blue.bold.underline(
    'filename'
  )}]: ${chalk.green.italic(filename)}`;

  const message = `${fileMessage}: ${callerMessage} : ${subjectMessage} - `;

  return !bold ? chalk[color](message) : chalk[color].bold(message);
}
export function logMessage(
  filename,
  { color = 'yellow', bold = false } = {},
  caller,
  subject,
  values
) {
  const valuesMessage =
    typeof values === 'string' || typeof values === 'symbol'
      ? `${chalk.blue.bold.underline('[message]')}: ${colorizeDelimiter(
          desymbolize(values)
        )}`
      : values;
  console.log(
    createMessage(filename, { color, bold }, caller, subject),
    valuesMessage
  );
}

/* eslint-enable no-console */
