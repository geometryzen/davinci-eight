import mustBeBoolean from '../checks/mustBeBoolean'
import mustBeNumber from '../checks/mustBeNumber'
import mustBeString from '../checks/mustBeString'
import Spinor3 from '../math/Spinor3'
import Vector3 from '../math/Vector3'
import VectorE3 from '../math/VectorE3'
import Vertex from '../atoms/Vertex'
import Transform from '../atoms/Transform'

function coneNormal(ρ: VectorE3, h: VectorE3, out: Vector3): void {
    out.copy(ρ)
    const ρ2 = out.squaredNorm()
    out.add(h, ρ2).divByScalar(Math.sqrt(ρ2) * Math.sqrt(1 + ρ2))
}

/**
 *
 */
export default class ConeTransform implements Transform {

    /**
     * The vector from the base of the cone to the apex.
     * The default is e2.
     */
    public h = Vector3.vector(0, 1, 0);

    /**
     * The radius vector and the initial direction for a slice.
     * The default is e3.
     */
    public a = Vector3.vector(0, 0, 1);

    /**
     * The perpendicular radius vector.
     * We compute this so that the grid wraps around the cone with
     * u increasing with θ and v increasing toward the apex of the cone.
     * The default is e1.
     */
    public b = Vector3.vector(1, 0, 0);

    public clockwise: boolean
    public sliceAngle: number
    public aPosition: string
    public aTangent: string

    /**
     * @param clockwise {boolean}
     * @param sliceAngle {number}
     * @param aPosition {string} The name to use for the position attribute.
     * @param aTangent {string} The name to use for the tangent plane attribute.
     */
    constructor(clockwise: boolean, sliceAngle: number, aPosition: string, aTangent: string) {
        this.clockwise = mustBeBoolean('clockwise', clockwise)
        this.sliceAngle = mustBeNumber('sliceAngle', sliceAngle)
        this.aPosition = mustBeString('aPosition', aPosition)
        this.aTangent = mustBeString('aTangent', aTangent)
    }

    exec(vertex: Vertex, i: number, j: number, iLength: number, jLength: number): void {
        // Let e be the unit vector in the symmetry axis of the cone.
        // Let ρ be a point on the base of the cone.
        // Then the normal to the cone n is given by
        //
        // n = (ρ * ρ * e + ρ) / (|ρ| * sqrt(1 + ρ * ρ))
        //
        // This formula is derived by finding the vector in the plane of e and ρ
        // that is normal to the vector (e - ρ) and normalized to unity.
        // The formula always gives a formula that is well defined provided |ρ| is non-zero.
        //
        // In order to account for the stress and tilt operations, compute the normal using
        // the transformed ρ and h
        const uSegments = iLength - 1
        const u = i / uSegments

        const vSegments = jLength - 1
        const v = j / vSegments

        const sign = this.clockwise ? -1 : +1
        const θ = sign * this.sliceAngle * u
        const cosθ = Math.cos(θ)
        const sinθ = Math.sin(θ)

        /**
         * Point on the base of the cone.
         */
        const ρ = new Vector3().add(this.a, cosθ).add(this.b, sinθ)

        /**
         * Point on the standard cone at uIndex, vIndex.
         */
        const x = Vector3.lerp(ρ, this.h, v)

        vertex.attributes[this.aPosition] = x

        const normal = Vector3.zero()
        coneNormal(ρ, this.h, normal)

        vertex.attributes[this.aTangent] = Spinor3.dual(normal, false)
    }
}
