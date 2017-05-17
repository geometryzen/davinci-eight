"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isFunction_1 = require("../checks/isFunction");
function beFunction() {
    return "be a function";
}
function mustBeFunction(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isFunction_1.isFunction(value), beFunction, contextBuilder);
    return value;
}
exports.mustBeFunction = mustBeFunction;
