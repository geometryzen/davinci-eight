"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isObject_1 = require("../checks/isObject");
function beObject() {
    return "be an `object`";
}
function mustBeObject(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isObject_1.isObject(value), beObject, contextBuilder);
    return value;
}
exports.mustBeObject = mustBeObject;
