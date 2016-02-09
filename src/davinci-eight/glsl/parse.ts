import Node from './Node'
import Token from './Token'
import tokenizeString from './tokenizeString'
import parser from './parser'

export default function(code: string): Node {
  var tokens: Token[] = tokenizeString(code);
  var reader = parser();
  for (var i = 0; i < tokens.length;i++) {
    reader(tokens[i]);
  }
  var ast = reader(null);
  return ast;
}
