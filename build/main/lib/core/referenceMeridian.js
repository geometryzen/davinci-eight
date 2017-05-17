"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tiltFromOptions_1 = require("../core/tiltFromOptions");
var Geometric3_1 = require("../math/Geometric3");
var R3_1 = require("../math/R3");
/**
 * This function computes the reference meridian of an object.
 */
function referenceMeridian(options, fallback) {
    if (options.tilt) {
        var meridian = Geometric3_1.Geometric3.fromVector(tiltFromOptions_1.canonicalMeridian).rotate(options.tilt);
        return R3_1.vec(meridian.x, meridian.y, meridian.z);
    }
    else if (options.meridian) {
        var meridian = options.meridian;
        return R3_1.vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else if (options.cutLine) {
        console.warn("cutLine is deprecated. Please use meridian instead.");
        var meridian = options.cutLine;
        return R3_1.vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else if (options.axis) {
        var B = Geometric3_1.Geometric3.dualOfVector(tiltFromOptions_1.canonicalMeridian);
        var tilt = Geometric3_1.Geometric3.rotorFromVectorToVector(tiltFromOptions_1.canonicalAxis, options.axis, B);
        var meridian = Geometric3_1.Geometric3.fromVector(tiltFromOptions_1.canonicalMeridian).rotate(tilt);
        return R3_1.vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else if (typeof options.height === 'object') {
        console.warn("height is deprecated. Please use axis instead.");
        var axis = options.height;
        var B = Geometric3_1.Geometric3.dualOfVector(tiltFromOptions_1.canonicalMeridian);
        var tilt = Geometric3_1.Geometric3.rotorFromVectorToVector(tiltFromOptions_1.canonicalAxis, axis, B);
        var meridian = Geometric3_1.Geometric3.fromVector(tiltFromOptions_1.canonicalMeridian).rotate(tilt);
        return R3_1.vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else {
        return R3_1.vec(fallback.x, fallback.y, fallback.z);
    }
}
exports.referenceMeridian = referenceMeridian;
