import VectorE3 from '../math/VectorE3';
import mustBeDefined from '../checks/mustBeDefined';
import mustBeInteger from '../checks/mustBeInteger';
import mustBeNumber from '../checks/mustBeNumber';
import SpinG3m from '../math/SpinG3m';
import SpinorE3 from '../math/SpinorE3';
import R3m from '../math/R3m';

/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * begin {VectorE3} The begin position.
 * angle: {number} The angle of the rotation.
 * generator {SpinorE3} The generator of the rotation.
 * segments {number} The number of segments.
 */
export default function arc3(begin: VectorE3, angle: number, generator: SpinorE3, segments: number): R3m[] {
    mustBeDefined('begin', begin)
    mustBeNumber('angle', angle)
    mustBeDefined('generator', generator)
    mustBeInteger('segments', segments)

    /**
     * The return value is an array of points with length => segments + 1.
     */
    const points: R3m[] = []

    /**
     * Temporary point that we will advance for each segment.
     */
    const point = R3m.copy(begin)

    /**
     * The rotor that advances us through one segment.
     */
    const rotor = SpinG3m.copy(generator).scale((-angle / 2) / segments).exp()

    points.push(point.clone())

    for (let i = 0; i < segments; i++) {
        point.rotate(rotor)
        points.push(point.clone())
    }

    return points
}
