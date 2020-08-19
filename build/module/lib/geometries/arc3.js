import { mustBeDefined } from '../checks/mustBeDefined';
import { mustBeInteger } from '../checks/mustBeInteger';
import { mustBeNumber } from '../checks/mustBeNumber';
import { Spinor3 } from '../math/Spinor3';
import { Vector3 } from '../math/Vector3';
/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * begin {VectorE3} The begin position.
 * angle: {number} The angle of the rotation.
 * generator {SpinorE3} The generator of the rotation.
 * segments {number} The number of segments.
 */
export function arc3(begin, angle, generator, segments) {
    mustBeDefined('begin', begin);
    mustBeNumber('angle', angle);
    mustBeDefined('generator', generator);
    mustBeInteger('segments', segments);
    if (isNaN(begin.x) || isNaN(begin.y) || isNaN(begin.z)) {
        throw new Error("arc3(begin=" + begin.toString() + ")");
    }
    /**
     * The return value is an array of points with length => segments + 1.
     */
    var points = [];
    /**
     * Temporary point that we will advance for each segment.
     */
    var point = Vector3.copy(begin);
    /**
     * The rotor that advances us through one segment.
     */
    var rotor = Spinor3.copy(generator).scale((-angle / 2) / segments).exp();
    points.push(point.clone());
    for (var i = 0; i < segments; i++) {
        point.rotate(rotor);
        points.push(point.clone());
    }
    return points;
}
