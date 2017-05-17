import { canonicalAxis, canonicalMeridian } from '../core/tiltFromOptions';
import { Geometric3 } from '../math/Geometric3';
import { vec } from '../math/R3';
/**
 * This function computes the reference meridian of an object.
 */
export function referenceMeridian(options, fallback) {
    if (options.tilt) {
        var meridian = Geometric3.fromVector(canonicalMeridian).rotate(options.tilt);
        return vec(meridian.x, meridian.y, meridian.z);
    }
    else if (options.meridian) {
        var meridian = options.meridian;
        return vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else if (options.cutLine) {
        console.warn("cutLine is deprecated. Please use meridian instead.");
        var meridian = options.cutLine;
        return vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else if (options.axis) {
        var B = Geometric3.dualOfVector(canonicalMeridian);
        var tilt = Geometric3.rotorFromVectorToVector(canonicalAxis, options.axis, B);
        var meridian = Geometric3.fromVector(canonicalMeridian).rotate(tilt);
        return vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else if (typeof options.height === 'object') {
        console.warn("height is deprecated. Please use axis instead.");
        var axis = options.height;
        var B = Geometric3.dualOfVector(canonicalMeridian);
        var tilt = Geometric3.rotorFromVectorToVector(canonicalAxis, axis, B);
        var meridian = Geometric3.fromVector(canonicalMeridian).rotate(tilt);
        return vec(meridian.x, meridian.y, meridian.z).direction();
    }
    else {
        return vec(fallback.x, fallback.y, fallback.z);
    }
}
