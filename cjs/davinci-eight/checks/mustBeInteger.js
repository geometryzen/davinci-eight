var mustSatisfy = require('../checks/mustSatisfy');
var isInteger = require('../checks/isInteger');
function beAnInteger() {
    return "be an integer";
}
function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
    return value;
}
module.exports = mustBeInteger;
