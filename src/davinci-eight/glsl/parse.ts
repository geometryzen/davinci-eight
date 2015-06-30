/// <reference path='Node.d.ts'/>
import tokenizeString = require('../glsl/tokenizeString');
import parser = require('../glsl/parser');

function parse(code: string): GLSL.Node {
  var tokens: Token[] = tokenizeString(code);
  var reader = parser();
  for (var i = 0; i < tokens.length;i++) {
    reader(tokens[i]);
  }
  var ast = reader(null);
  return ast;
}

export = parse;
