"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isNumber_1 = require("../checks/isNumber");
function beANumber() {
    return "be a `number`";
}
function mustBeNumber(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isNumber_1.isNumber(value), beANumber, contextBuilder);
    return value;
}
exports.mustBeNumber = mustBeNumber;
