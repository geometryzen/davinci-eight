"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isNumber_1 = require("../checks/isNumber");
function isInteger(x) {
    // % coerces its operand to numbers so a typeof test is required.
    // Note that ECMAScript 6 provides Number.isInteger().
    return isNumber_1.isNumber(x) && x % 1 === 0;
}
exports.isInteger = isInteger;
