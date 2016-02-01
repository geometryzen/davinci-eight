import VectorE3 from '../math/VectorE3';
import mustBeDefined from '../checks/mustBeDefined';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import SpinG3 from '../math/SpinG3';
import SpinorE3 from '../math/SpinorE3';
import R3 from '../math/R3';

/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * param begin {VectorE3} The begin position.
 * param angle: {number} The angle of the rotation.
 * param generator {SpinorE3} The generator of the rotation.
 * param segments {number} The number of segments.
 */
export default function arc3(begin: VectorE3, angle: number, generator: SpinorE3, segments: number): R3[] {
    mustBeDefined('begin', begin)
    mustBeNumber('angle', angle)
    mustBeDefined('generator', generator)
    mustBeInteger('segments', segments)

    /**
     * The return value is an array of points with length => segments + 1.
     */
    var points: R3[] = []

    /**
     * Temporary point that we will advance for each segment.
     */
    var point = R3.copy(begin)

    /**
     * The rotor that advances us through one segment.
     */
    var rotor = SpinG3.copy(generator).scale((-angle / 2) / segments).exp()

    points.push(point.clone())

    for (var i = 0; i < segments; i++) {
        point.rotate(rotor)
        points.push(point.clone())
    }

    return points
}
