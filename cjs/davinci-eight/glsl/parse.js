/// <reference path='Node.d.ts'/>
var tokenizeString = require('../glsl/tokenizeString');
var parser = require('../glsl/parser');
function parse(code) {
    var tokens = tokenizeString(code);
    var reader = parser();
    for (var i = 0; i < tokens.length; i++) {
        reader(tokens[i]);
    }
    var ast = reader(null);
    return ast;
}
module.exports = parse;
