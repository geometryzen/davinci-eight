"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mustBeDefined = void 0;
var mustSatisfy_1 = require("../checks/mustSatisfy");
var isDefined_1 = require("../checks/isDefined");
function beDefined() {
    return "not be 'undefined'";
}
function mustBeDefined(name, value, contextBuilder) {
    mustSatisfy_1.mustSatisfy(name, isDefined_1.isDefined(value), beDefined, contextBuilder);
    return value;
}
exports.mustBeDefined = mustBeDefined;
