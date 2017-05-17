"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
var expectArg_1 = require("../checks/expectArg");
/**
 * Policy for how a uniform variable name is determined.
 */
function getUniformVarName(uniform, varName) {
    expectArg_1.expectArg('uniform', uniform).toBeObject();
    expectArg_1.expectArg('varName', varName).toBeString();
    return isDefined_1.isDefined(uniform.name) ? expectArg_1.expectArg('uniform.name', uniform.name).toBeString().value : varName;
}
exports.getUniformVarName = getUniformVarName;
