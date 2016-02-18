import Geometric from '../math/MutableGeometricElement';

const sqrt = Math.sqrt

/**
 * Sets this multivector to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * Returns undefined (void 0) if the vectors are anti-parallel.
 */
export default function rotorFromDirections<V, M extends Geometric<any, any, any, any>>(a: V, b: V, quad: (v: V) => number, dot: (a: V, b: V) => number, m: M): M {
    const quadA = quad(a)
    const absA = sqrt(quadA)
    const quadB = quad(b)
    const absB = sqrt(quadB)
    const BA = absB * absA
    const denom = sqrt(2 * (quadB * quadA + BA * dot(b, a)))
    if (denom !== 0) {
        m = m.spinor(b, a)
        m = m.addScalar(BA)
        m = m.divByScalar(denom)
        return m
    }
    else {
        // The denominator is zero when |a||b| + a << b = 0.
        // If θ is the angle between a and b, then  cos(θ) = (a << b) /|a||b| = -1
        // Then a and b are anti-parallel.
        // The plane of the rotation is ambiguous.
        return void 0
    }
}
