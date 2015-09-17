var mustSatisfy = require('../checks/mustSatisfy');
var isNumber = require('../checks/isNumber');
function beANumber() {
    return "be a number";
}
function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
    return value;
}
module.exports = mustBeInteger;
