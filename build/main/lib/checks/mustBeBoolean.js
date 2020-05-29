"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustBeBoolean = void 0;
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isBoolean_1 = require("../checks/isBoolean");
function beBoolean() {
    return "be `boolean`";
}
function mustBeBoolean(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isBoolean_1.isBoolean(value), beBoolean, contextBuilder);
    return value;
}
exports.mustBeBoolean = mustBeBoolean;
