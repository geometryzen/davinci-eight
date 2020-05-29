"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrowPrimitive = void 0;
var ArrowBuilder_1 = require("../shapes/ArrowBuilder");
var isDefined_1 = require("../checks/isDefined");
var mustBeObject_1 = require("../checks/mustBeObject");
var mustBeNumber_1 = require("../checks/mustBeNumber");
var Vector3_1 = require("../math/Vector3");
var R3_1 = require("../math/R3");
var canonicalAxis = R3_1.vec(0, 1, 0);
var canonicalCutLine = R3_1.vec(0, 0, 1);
var getAxis = function getAxis(options) {
    if (isDefined_1.isDefined(options.axis)) {
        return options.axis;
    }
    else {
        return canonicalAxis;
    }
};
var getCutLine = function getCutLine(options) {
    if (isDefined_1.isDefined(options.meridian)) {
        return options.meridian;
    }
    else {
        return canonicalCutLine;
    }
};
/**
 *
 */
function arrowPrimitive(options) {
    if (options === void 0) { options = { kind: 'ArrowGeometry' }; }
    mustBeObject_1.mustBeObject('options', options);
    var builder = new ArrowBuilder_1.ArrowBuilder(getAxis(options), getCutLine(options), false);
    if (isDefined_1.isDefined(options.radiusCone)) {
        builder.radiusCone = mustBeNumber_1.mustBeNumber("options.radiusCone", options.radiusCone);
    }
    builder.stress.copy(isDefined_1.isDefined(options.stress) ? options.stress : Vector3_1.Vector3.vector(1, 1, 1));
    builder.offset.copy(isDefined_1.isDefined(options.offset) ? options.offset : Vector3_1.Vector3.zero());
    return builder.toPrimitive();
}
exports.arrowPrimitive = arrowPrimitive;
