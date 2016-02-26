import mustBeNumber from '../../checks/mustBeNumber'
import mustBeString from '../../checks/mustBeString'
import R3 from '../../math/R3'
import Spinor3 from '../../math/Spinor3'
import Vector3 from '../../math/Vector3'
import VectorE3 from '../../math/VectorE3'
import Vertex from '../Vertex'
import Transform from './Transform'

/**
 * Unit vector pointing along the symmetry axis of the cone.
 */
const h = R3.e2

/**
 * Unit vector for the major axis of the cone.
 */
const a = R3.e3

/**
 * Unit vector for the minor axis of the cone.
 * We compute this so that the grid wraps around the cone with
 * u increasing with θ and v increasing toward the apex of the cone.
 */
const b = new Vector3().cross2(h, a).direction()

function coneNormal(ρ: VectorE3, h: VectorE3, out: Vector3): void {
    out.copy(ρ)
    const ρ2 = out.squaredNorm()
    out.add(h, ρ2).divByScalar(Math.sqrt(ρ2) * Math.sqrt(1 + ρ2))
}

/**
 * @class ConeTransform
 */
export default class ConeTransform implements Transform {
    private sliceAngle: number
    private aPosition: string
    private aTangent: string

    /**
     * @class ConeTransform
     * @constructor
     * @param sliceAngle {number}
     * @param aPosition {string} The name to use for the position attribute.
     * @param aTangent {string} The name to use for the tangent plane attribute.
     */
    constructor(sliceAngle: number, aPosition: string, aTangent: string) {
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle)
        this.aPosition = mustBeString('aPosition', aPosition)
        this.aTangent = mustBeString('aTangent', aTangent)
    }

    /**
     * @method exec
     * @param vertex {Vertex}
     * @param i {number}
     * @param j {number}
     * @param iLength {number}
     * @param jLength {number}
     */
    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        // Let h be the unit vector in the symmetry axis of the cone.
        // Let ρ be a point on the base of the cone.
        // Then the normal to the cone n is given by
        //
        // n = (ρ * ρ * h + ρ) / (|ρ| * sqrt(1 + ρ * ρ))
        //
        // This formula is derived by finding the vector in the plane of h and ρ
        // That is normal to the vector peak = h - ρ and normalized to unity.
        // The formula always gives a formula that is well defined provided |ρ| is non-zero.
        //
        // In order to account for the stress and tilt operations, compute the normal using
        // the transformed ρ and h
        const uSegments = iLength - 1
        const u = i / uSegments

        const vSegments = jLength - 1
        const v = j / vSegments

        // TODO: We could cache the trig values by u for performance?
        const θ = this.sliceAngle * u
        const cosθ = Math.cos(θ)
        const sinθ = Math.sin(θ)

        /**
         * Point on the base of the cone.
         * TODO: This would be the best thing to cache.
         */
        const ρ = new Vector3().add(a, cosθ).add(b, sinθ)

        /**
         * Point on the standard cone at uIndex, vIndex.
         */
        const x = Vector3.lerp(ρ, h, v)

        vertex.attributes[this.aPosition] = x

        const normal = Vector3.zero()
        coneNormal(ρ, h, normal)

        vertex.attributes[this.aTangent] = Spinor3.dual(normal, false)
    }
}
