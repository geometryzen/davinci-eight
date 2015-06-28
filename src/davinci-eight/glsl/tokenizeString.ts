import tokenize = require('./tokenize');

function tokenizeString(str: string) {
  var generator = tokenize();
  var tokens = [];

  tokens = tokens.concat(generator(str))
  tokens = tokens.concat(generator(null))

  return tokens;
}

export = tokenizeString;