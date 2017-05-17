"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isGE_1 = require("../checks/isGE");
function mustBeGE(name, value, limit, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isGE_1.isGE(value, limit), function () { return "be greater than or equal to " + limit; }, contextBuilder);
    return value;
}
exports.mustBeGE = mustBeGE;
