import { Geometric3 } from '../math/Geometric3';
import { vec } from '../math/R3';
import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';
/**
 * This function computes the reference axis of an object.
 */
export function referenceAxis(options, fallback) {
    if (options.tilt) {
        var axis = Geometric3.fromVector(canonicalAxis).rotate(options.tilt);
        return vec(axis.x, axis.y, axis.z);
    }
    else if (options.axis) {
        var axis = options.axis;
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (typeof options.height === 'object') {
        console.warn("height is deprecated. Please use axis instead.");
        var axis = options.height;
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (options.meridian) {
        var B = Geometric3.dualOfVector(canonicalAxis);
        var tilt = Geometric3.rotorFromVectorToVector(canonicalMeridian, options.meridian, B);
        var axis = Geometric3.fromVector(canonicalAxis).rotate(tilt);
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else if (options.cutLine) {
        console.warn("cutLine is deprecated. Please use meridian instead.");
        var B = Geometric3.dualOfVector(canonicalAxis);
        var tilt = Geometric3.rotorFromVectorToVector(canonicalMeridian, options.cutLine, B);
        var axis = Geometric3.fromVector(canonicalAxis).rotate(tilt);
        return vec(axis.x, axis.y, axis.z).direction();
    }
    else {
        return vec(fallback.x, fallback.y, fallback.z);
    }
}
