import mustBeNumber from '../../checks/mustBeNumber'
import mustBeString from '../../checks/mustBeString'
import Spinor3 from '../../math/Spinor3'
import Vector3 from '../../math/Vector3'
import VectorE3 from '../../math/VectorE3'
import Vertex from '../primitives/Vertex'
import Transform from '../primitives/Transform'

/**
 * @class CylinderTransform
 */
export default class CylinderTransform implements Transform {
    /**
     * Unit vector pointing along the symmetry axis of the cone.
     */
    private e: Vector3
    /**
     *
     */
    private cutLine: Vector3
    private generator: Spinor3
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
    constructor(e: VectorE3, cutLine: VectorE3, clockwise: boolean, sliceAngle: number, aPosition: string, aTangent: string) {
        this.e = Vector3.copy(e)
        this.cutLine = Vector3.copy(cutLine)
        this.generator = Spinor3.dual(e, clockwise)
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

        const rotor = this.generator.clone().scale(-this.sliceAngle * u / 2).exp()

        /**
         * Point on the wall of the cylinder with no vertical component.
         */
        const ρ = Vector3.copy(this.cutLine).rotate(rotor)

        vertex.attributes[this.aPosition] = ρ.clone().add(this.e, v)
        vertex.attributes[this.aTangent] = Spinor3.dual(ρ, false)
    }
}
