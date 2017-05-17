import { Geometric3 } from '../math/Geometric3';
import { isDefined } from '../checks/isDefined';
import { vec } from '../math/R3';
export var canonicalAxis = vec(0, 1, 0);
export var canonicalMeridian = vec(0, 0, 1);
/**
 * tilt takes precedence over axis and meridian.
 */
export function tiltFromOptions(options) {
    if (isDefined(options.tilt)) {
        return options.tilt;
    }
    else if (isDefined(options.axis)) {
        if (isDefined(options.meridian)) {
            var axis = vec(options.axis.x, options.axis.y, options.axis.z);
            var meridian = options.meridian;
            return Geometric3.rotorFromFrameToFrame([canonicalAxis, canonicalMeridian, canonicalAxis.cross(canonicalMeridian)], [axis, meridian, axis.cross(meridian)]);
        }
        else {
            return Geometric3.rotorFromDirections(canonicalAxis, options.axis);
        }
    }
    else if (isDefined(options.meridian)) {
        return Geometric3.rotorFromDirections(canonicalMeridian, options.meridian);
    }
    else {
        return { a: 1, xy: 0, yz: 0, zx: 0 };
    }
}
