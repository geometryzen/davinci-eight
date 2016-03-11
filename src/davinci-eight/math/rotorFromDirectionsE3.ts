import dot from './dotVectorE3'
import quad from './quadVectorE3'
import Vector from './VectorE3'
import Spinor from './SpinorE3'
import wedgeXY from './wedgeXY'
import wedgeYZ from './wedgeYZ'
import wedgeZX from './wedgeZX'

const sqrt = Math.sqrt

interface Output extends Spinor {
    versor(a: Vector, b: Vector): Output
    addScalar(α: number): Output
    normalize(): Output
    divByScalar(α: number): Output
    rotorFromGeneratorAngle(G: Spinor, θ: number): Output
    zero(): Output
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
        // Compute a random bivector containing the start vector, then turn
        // it into a rotor that achieves the 180-degree rotation.
        const rx = Math.random()
        const ry = Math.random()
        const rz = Math.random()

        m.zero()
        m.yz = wedgeYZ(rx, ry, rz, a.x, a.y, a.z)
        m.zx = wedgeZX(rx, ry, rz, a.x, a.y, a.z)
        m.xy = wedgeXY(rx, ry, rz, a.x, a.y, a.z)
        m.normalize()
        m.rotorFromGeneratorAngle(m, Math.PI)
    }
}
