define(["require", "exports", './tokenize'], function (require, exports, tokenize) {
    function tokenizeString(str) {
        var generator = tokenize();
        var tokens = [];
        tokens = tokens.concat(generator(str));
        tokens = tokens.concat(generator(null));
        return tokens;
    }
    return tokenizeString;
});
