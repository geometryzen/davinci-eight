"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometric3_1 = require("../math/Geometric3");
var isDefined_1 = require("../checks/isDefined");
var R3_1 = require("../math/R3");
exports.canonicalAxis = R3_1.vec(0, 1, 0);
exports.canonicalMeridian = R3_1.vec(0, 0, 1);
/**
 * tilt takes precedence over axis and meridian.
 */
function tiltFromOptions(options) {
    if (isDefined_1.isDefined(options.tilt)) {
        return options.tilt;
    }
    else if (isDefined_1.isDefined(options.axis)) {
        if (isDefined_1.isDefined(options.meridian)) {
            var axis = R3_1.vec(options.axis.x, options.axis.y, options.axis.z);
            var meridian = options.meridian;
            return Geometric3_1.Geometric3.rotorFromFrameToFrame([exports.canonicalAxis, exports.canonicalMeridian, exports.canonicalAxis.cross(exports.canonicalMeridian)], [axis, meridian, axis.cross(meridian)]);
        }
        else {
            return Geometric3_1.Geometric3.rotorFromDirections(exports.canonicalAxis, options.axis);
        }
    }
    else if (isDefined_1.isDefined(options.meridian)) {
        return Geometric3_1.Geometric3.rotorFromDirections(exports.canonicalMeridian, options.meridian);
    }
    else {
        return { a: 1, xy: 0, yz: 0, zx: 0 };
    }
}
exports.tiltFromOptions = tiltFromOptions;
