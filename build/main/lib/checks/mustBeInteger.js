"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isInteger_1 = require("../checks/isInteger");
function beAnInteger() {
    return "be an integer";
}
function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isInteger_1.isInteger(value), beAnInteger, contextBuilder);
    return value;
}
exports.mustBeInteger = mustBeInteger;
