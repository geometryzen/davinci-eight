import Geometric = require('../math/MutableGeometricElement')

let sqrt = Math.sqrt

/**
 * Sets this multivector to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 */
function rotorFromDirections<V, M extends Geometric<any, any, any, any>>(a: V, b: V, quad: (v: V) => number, dot: (a: V, b: V) => number, m: M): M {
    let quadA = quad(a)
    let absA = sqrt(quadA)
    let quadB = quad(b)
    let absB = sqrt(quadB)
    let BA = absB * absA
    let denom = sqrt(2 * (quadB * quadA + BA * dot(b, a)))
    if (denom !== 0) {
        m = m.spinor(b, a)
        m = m.addScalar(BA)
        m = m.divByScalar(denom)
        return m
    }
    else {
        // The denominator is zero when |a||b| + a << b = 0 => cos(θ) = -1 (i.e. a, b anti-parallel)
        // The plane of the rotation in such a case is ambiguous.
        console.warn("rotorFromDirections(" + a + ", " + b + ") is undefined.")
        return void 0
    }
}

export = rotorFromDirections
