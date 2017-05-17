"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isNull_1 = require("../checks/isNull");
var isNumber_1 = require("../checks/isNumber");
var isObject_1 = require("../checks/isObject");
/**
 * Determines whether the argument supports the VectorE3 interface.
 * The argument must be a non-null object and must support the x, y, and z numeric properties.
 */
function isVectorE3(v) {
    if (isObject_1.isObject(v) && !isNull_1.isNull(v)) {
        return isNumber_1.isNumber(v.x) && isNumber_1.isNumber(v.y) && isNumber_1.isNumber(v.z);
    }
    else {
        return false;
    }
}
exports.isVectorE3 = isVectorE3;
