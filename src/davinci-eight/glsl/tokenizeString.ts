/// <reference path='./Token.d.ts'/>
import tokenize = require('./tokenize');

function tokenizeString(str: string): Token[] {
  var generator = tokenize();
  var tokens: Token[] = [];

  tokens = tokens.concat(generator(str))
  tokens = tokens.concat(generator(null))

  return tokens;
}

export = tokenizeString;