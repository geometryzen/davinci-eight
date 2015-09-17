var mustSatisfy = require('../checks/mustSatisfy');
var isString = require('../checks/isString');
function beAString() {
    return "be a string";
}
function mustBeString(name, value, contextBuilder) {
    mustSatisfy(name, isString(value), beAString, contextBuilder);
    return value;
}
module.exports = mustBeString;
