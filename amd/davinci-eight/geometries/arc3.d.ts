import VectorE3 = require('../math/VectorE3');
import SpinorE3 = require('../math/SpinorE3');
import MutableVectorE3 = require('../math/MutableVectorE3');
/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * param begin {VectorE3} The begin position.
 * param angle: {number} The angle of the rotation.
 * param generator {SpinorE3} The generator of the rotation.
 * param segments {number} The number of segments.
 */
declare function arc3(begin: VectorE3, angle: number, generator: SpinorE3, segments: number): MutableVectorE3[];
export = arc3;
