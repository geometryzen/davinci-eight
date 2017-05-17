"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isString_1 = require("../checks/isString");
function beAString() {
    return "be a string";
}
function mustBeString(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isString_1.isString(value), beAString, contextBuilder);
    return value;
}
exports.mustBeString = mustBeString;
