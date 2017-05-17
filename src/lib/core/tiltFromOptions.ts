import { Geometric3 } from '../math/Geometric3';
import { isDefined } from '../checks/isDefined';
import { SpinorE3 } from '../math/SpinorE3';
import { VectorE3 } from '../math/VectorE3';
import { R3 } from '../math/R3';
import { vec } from '../math/R3';

export const canonicalAxis: Readonly<R3> = vec(0, 1, 0);
export const canonicalMeridian: Readonly<R3> = vec(0, 0, 1);

/**
 * tilt takes precedence over axis and meridian.
 */
export function tiltFromOptions(options: { axis?: VectorE3, meridian?: VectorE3, tilt?: SpinorE3 }): SpinorE3 {
    if (isDefined(options.tilt)) {
        return options.tilt;
    }
    else if (isDefined(options.axis)) {
        if (isDefined(options.meridian)) {
            const axis = vec(options.axis.x, options.axis.y, options.axis.z);
            const meridian = options.meridian;
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
