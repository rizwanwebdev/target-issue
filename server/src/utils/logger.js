const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function getTimestamp() {
  return new Date().toISOString();
}

function printBox(text, symbol = "*", color = colors.reset) {
  const terminalWidth = process.stdout.columns || 80;

  const content = ` ${text} `;

  // Use the larger of terminal width or content width
  const width = Math.max(terminalWidth, content.length);

  const padTotal = width - content.length;
  const padLeft = Math.floor(padTotal / 2);
  const padRight = padTotal - padLeft;

  const border = symbol.repeat(width);

  console.log(`${color}${border}${colors.reset}`);

  console.log(
    `${color}${symbol.repeat(padLeft)}${content}${symbol.repeat(padRight)}${colors.reset}`,
  );

  console.log(`${color}${border}${colors.reset}`);
}
const logger = {
  info(message, ...args) {
    printBox(`INFO | ${getTimestamp()} | ${message}`, "*", colors.blue);

    if (args.length) {
      console.log(...args);
    }
  },

  success(message, ...args) {
    printBox(`SUCCESS | ${getTimestamp()} | ${message}`, "+", colors.green);

    if (args.length) {
      console.log(...args);
    }
  },

  warn(message, ...args) {
    printBox(`WARNING | ${getTimestamp()} | ${message}`, "-", colors.yellow);

    if (args.length) {
      console.log(...args);
    }
  },

  error(message, ...args) {
    printBox(`ERROR | ${getTimestamp()} | ${message}`, "#", colors.red);

    if (args.length) {
      console.error(...args);
    }
  },
};

export default logger;
