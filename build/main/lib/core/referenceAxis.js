"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Geometric3_1 = require("../math/Geometric3");
var R3_1 = require("../math/R3");
var tiltFromOptions_1 = require("../core/tiltFromOptions");
/**
 * This function computes the reference axis of an object.
 */
function referenceAxis(options, fallback) {
    if (options.tilt) {
        var axis = Geometric3_1.Geometric3.fromVector(tiltFromOptions_1.canonicalAxis).rotate(options.tilt);
        return R3_1.vec(axis.x, axis.y, axis.z);
    }
    else if (options.axis) {
        var axis = options.axis;
        return R3_1.vec(axis.x, axis.y, axis.z).direction();
    }
    else if (typeof options.height === 'object') {
        console.warn("height is deprecated. Please use axis instead.");
        var axis = options.height;
        return R3_1.vec(axis.x, axis.y, axis.z).direction();
    }
    else if (options.meridian) {
        var B = Geometric3_1.Geometric3.dualOfVector(tiltFromOptions_1.canonicalAxis);
        var tilt = Geometric3_1.Geometric3.rotorFromVectorToVector(tiltFromOptions_1.canonicalMeridian, options.meridian, B);
        var axis = Geometric3_1.Geometric3.fromVector(tiltFromOptions_1.canonicalAxis).rotate(tilt);
        return R3_1.vec(axis.x, axis.y, axis.z).direction();
    }
    else if (options.cutLine) {
        console.warn("cutLine is deprecated. Please use meridian instead.");
        var B = Geometric3_1.Geometric3.dualOfVector(tiltFromOptions_1.canonicalAxis);
        var tilt = Geometric3_1.Geometric3.rotorFromVectorToVector(tiltFromOptions_1.canonicalMeridian, options.cutLine, B);
        var axis = Geometric3_1.Geometric3.fromVector(tiltFromOptions_1.canonicalAxis).rotate(tilt);
        return R3_1.vec(axis.x, axis.y, axis.z).direction();
    }
    else {
        return R3_1.vec(fallback.x, fallback.y, fallback.z);
    }
}
exports.referenceAxis = referenceAxis;
