import { VectorE3 } from '../math/VectorE3';
import { SpinorE3 } from '../math/SpinorE3';
import { Vector3 } from '../math/Vector3';
/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * begin {VectorE3} The begin position.
 * angle: {number} The angle of the rotation.
 * generator {SpinorE3} The generator of the rotation.
 * segments {number} The number of segments.
 */
export declare function arc3(begin: VectorE3, angle: number, generator: SpinorE3, segments: number): Vector3[];
