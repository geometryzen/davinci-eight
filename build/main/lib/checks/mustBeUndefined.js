"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isUndefined_1 = require("../checks/isUndefined");
function beUndefined() {
    return "be 'undefined'";
}
function mustBeUndefined(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isUndefined_1.isUndefined(value), beUndefined, contextBuilder);
    return value;
}
exports.mustBeUndefined = mustBeUndefined;
