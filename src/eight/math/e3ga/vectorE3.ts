import Euclidean3 = require('eight/math/e3ga/Euclidean3');

/**
 * Constructs and returns a Euclidean 3D vector from its cartesian components.
 * @param x The x component of the vector.
 * @param y The y component of the vector.
 * @param z The z component of the vector.
 */ 
var vectorE3 = function(x: number, y: number, z: number): Euclidean3 {
    return new Euclidean3(0, x, y, z, 0, 0, 0, 0);
};
export = vectorE3;
