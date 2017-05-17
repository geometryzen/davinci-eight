"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mustSatisfy_1 = require("./mustSatisfy");
var isEQ_1 = require("./isEQ");
function mustBeEQ(name, value, limit, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isEQ_1.isEQ(value, limit), function () { return "be equal to " + limit; }, contextBuilder);
    return value;
}
exports.mustBeEQ = mustBeEQ;
