"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isLE_1 = require("../checks/isLE");
function mustBeLE(name, value, limit, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isLE_1.isLE(value, limit), function () { return "be less than or equal to " + limit; }, contextBuilder);
    return value;
}
exports.mustBeLE = mustBeLE;
