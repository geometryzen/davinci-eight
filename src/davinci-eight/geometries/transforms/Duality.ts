import mustBeBoolean from '../../checks/mustBeBoolean'
import mustBeString from '../../checks/mustBeString'
import notImplemented from '../../i18n/notImplemented'
import Spinor2 from '../../math/Spinor2'
import Spinor3 from '../../math/Spinor3'
import Vector2 from '../../math/Vector2'
import Vector3 from '../../math/Vector3'
import Vertex from '../Vertex'
import Transform from './Transform'

/**
 * Applies a duality transformation to the specified attributes of a vertex, creating a new attribute.
 * The convention used is pre-multiplication by the pseudoscalar.
 *
 * @class Duality
 */
export default class Duality implements Transform {

    /**
     * @property sourceName
     * @type string
     * @private
     */
    private sourceName: string

    /**
     * @property outputName
     * @type string
     * @private
     */
    private outputName: string

    /**
     * Determines whether to change the sign from the <code>dual(m) = I * m</code> convention.
     *
     * @property changeSign
     * @type boolean
     * @private
     */
    private changeSign: boolean

    /**
     * Determines whether to remove the source attribute.
     *
     * @property removeSource
     * @type boolean
     * @private
     */
    private removeSource: boolean

    /**
     * @class Duality
     * @constructor
     * @param names {string[]}
     */
    constructor(sourceName: string, outputName: string, changeSign: boolean, removeSource: boolean) {
        this.sourceName = mustBeString('sourceName', sourceName)
        this.outputName = mustBeString('outputName', outputName)
        this.changeSign = mustBeBoolean('changeSign', changeSign)
        this.removeSource = mustBeBoolean('removeSource', removeSource)
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
        const v = vertex.attributes[this.sourceName]
        if (v) {
            if (v instanceof Vector3) {
                const spinor = Spinor3.dual(v, this.changeSign)
                vertex.attributes[this.outputName] = spinor
            }
            else if (v instanceof Spinor3) {
                const vector = Vector3.dual(v, this.changeSign)
                vertex.attributes[this.outputName] = vector
            }
            else if (v instanceof Vector2) {
                throw new Error(notImplemented('dual(vector: Vector2)').message)
            }
            else if (v instanceof Spinor2) {
                throw new Error(notImplemented('dual(spinor: Spinor2)').message)
            }
            else {
                throw new Error(`Expecting ${this.sourceName} to be a Vector3 or Spinor`)
            }
            if (this.removeSource) {
                delete vertex.attributes[this.sourceName]
            }
        }
        else {
            throw new Error(`Vertex attribute ${this.sourceName} was not found`)
        }
    }
}
