"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isDefined_1 = require("../checks/isDefined");
var mustBeObject_1 = require("../checks/mustBeObject");
var mustBeString_1 = require("../checks/mustBeString");
/**
 * Policy for how an attribute variable name is determined.
 */
function getAttribVarName(attribute, varName) {
    mustBeObject_1.mustBeObject('attribute', attribute);
    mustBeString_1.mustBeString('varName', varName);
    return isDefined_1.isDefined(attribute.name) ? mustBeString_1.mustBeString('attribute.name', attribute.name) : varName;
}
exports.getAttribVarName = getAttribVarName;
