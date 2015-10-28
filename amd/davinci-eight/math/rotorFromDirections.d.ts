import Geometric = require('../math/MutableGeometricElement');
/**
 * Sets this multivector to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 */
declare function rotorFromDirections<V, M extends Geometric<any, any, any, any>>(a: V, b: V, quad: (v: V) => number, dot: (a: V, b: V) => number, m: M): M;
export = rotorFromDirections;
