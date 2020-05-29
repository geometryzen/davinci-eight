"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustBeLT = void 0;
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isLT_1 = require("../checks/isLT");
function mustBeLT(name, value, limit, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isLT_1.isLT(value, limit), function () { return "be less than " + limit; }, contextBuilder);
    return value;
}
exports.mustBeLT = mustBeLT;
