/// <reference path='./Token.d.ts'/>
var tokenize = require('./tokenize');
function tokenizeString(str) {
    var generator = tokenize();
    var tokens = [];
    tokens = tokens.concat(generator(str));
    tokens = tokens.concat(generator(null));
    return tokens;
}
module.exports = tokenizeString;
