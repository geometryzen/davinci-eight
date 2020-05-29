"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustBeArray = void 0;
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isArray_1 = require("../checks/isArray");
function beAnArray() {
    return "be an array";
}
function mustBeArray(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isArray_1.isArray(value), beAnArray, contextBuilder);
    return value;
}
exports.mustBeArray = mustBeArray;
