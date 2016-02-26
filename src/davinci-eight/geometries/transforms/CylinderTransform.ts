import mustBeNumber from '../../checks/mustBeNumber'
import mustBeString from '../../checks/mustBeString'
import R3 from '../../math/R3'
import Spinor3 from '../../math/Spinor3'
import Vector3 from '../../math/Vector3'
import Vertex from '../Vertex'
import Transform from './Transform'

/**
 * Unit vector pointing along the symmetry axis of the cone.
 */
const e = R3.e2

/**
 * Unit vector for the major axis of the cone.
 */
const a = R3.e3

const generator = Spinor3.dual(e, false)

/**
 * @class CylinderTransform
 */
export default class CylinderTransform implements Transform {
    private sliceAngle: number
    private aPosition: string
    private aTangent: string

    /**
     * @class CylinderTransform
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
        const uSegments = iLength - 1
        const u = i / uSegments

        const vSegments = jLength - 1
        const v = j / vSegments

        const rotor = generator.clone().scale(-this.sliceAngle * u / 2).exp()

        /**
         * Point on the wall of the cylinder with no vertical component.
         */
        const ρ = Vector3.copy(a).rotate(rotor)
        const x = ρ.clone().add(e, v)

        vertex.attributes[this.aPosition] = x

        const normal = Vector3.copy(a).rotate(rotor)
        vertex.attributes[this.aTangent] = Spinor3.dual(normal, false)
    }
}
