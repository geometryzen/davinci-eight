"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isNull_1 = require("../checks/isNull");
var isObject_1 = require("../checks/isObject");
function beObject() {
    return "be a non-null `object`";
}
function mustBeNonNullObject(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isObject_1.isObject(value) && !isNull_1.isNull(value), beObject, contextBuilder);
    return value;
}
exports.mustBeNonNullObject = mustBeNonNullObject;
