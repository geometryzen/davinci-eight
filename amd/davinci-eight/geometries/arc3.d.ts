import Cartesian3 = require('../math/Cartesian3');
import Spinor3Coords = require('../math/Spinor3Coords');
import Vector3 = require('../math/Vector3');
/**
 * Computes a list of points corresponding to an arc centered on the origin.
 * param begin {Cartesian3} The begin position.
 * param angle: {number} The angle of the rotation.
 * param generator {Spinor3Coords} The generator of the rotation.
 * param segments {number} The number of segments.
 */
declare function arc3(begin: Cartesian3, angle: number, generator: Spinor3Coords, segments: number): Vector3[];
export = arc3;
