import dot from './dotVectorE2'
import quad from './quadVectorE2'
import Vector from './VectorE2'
import Spinor from './SpinorE2'

const sqrt = Math.sqrt

interface Output extends Spinor {
    versor(a: Vector, b: Vector): Output
    addScalar(α: number): Output
    divByScalar(α: number): Output
}

/**
 * Sets this multivector to a rotor representing a rotation from a to b.
 * R = (|b||a| + b * a) / sqrt(2 * |b||a|(|b||a| + b << a))
 * Returns undefined (void 0) if the vectors are anti-parallel.
 */
export default function(a: Vector, b: Vector, m: Output): void {
    const quadA = quad(a)
    const absA = sqrt(quadA)
    const quadB = quad(b)
    const absB = sqrt(quadB)
    const BA = absB * absA
    const dotBA = dot(b, a)
    const denom = sqrt(2 * (quadB * quadA + BA * dotBA))
    if (denom !== 0) {
        m = m.versor(b, a)
        m = m.addScalar(BA)
        m = m.divByScalar(denom)
    }
    else {
        // The denominator is zero when |a||b| + a << b = 0.
        // If θ is the angle between a and b, then  cos(θ) = (a << b) /|a||b| = -1
        // Then a and b are anti-parallel.
        // The plane of the rotation is ambiguous.
        return void 0
    }
}
