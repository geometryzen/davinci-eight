import mustBeObject from '../checks/mustBeObject'
import Vector3 from '../math/Vector3'
import VectorE3 from '../math/VectorE3'
import Vertex from '../atoms/Vertex'
import Transform from '../atoms/Transform'

/**
 * Applies a translation to the specified attributes of a vertex.
 */
export default class Translation implements Transform {

    /**
     * The translation to be applied.
     *
     * @property s
     * @type {VectorE3}
     * @private
     */
    private s: VectorE3

    /**
     * The names of the attributes that will be affected.
     *
     * @property names
     * @type string[]
     * @private
     */
    private names: string[]

    /**
     * @class Translation
     * @constructor
     * @param s {VectorE3}
     * @param names {string[]}
     */
    constructor(s: VectorE3, names: string[]) {
        this.s = Vector3.copy(mustBeObject('s', s))
        this.names = names
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
        const nLength = this.names.length;
        for (let k = 0; k < nLength; k++) {
            const aName = this.names[k]
            const v = vertex.attributes[aName]
            if (v.length === 3) {
                const vector = Vector3.vector(v.getComponent(0), v.getComponent(1), v.getComponent(2))
                vector.add(this.s)
                vertex.attributes[aName] = vector
            }
            else {
                throw new Error(`Expecting ${aName} to be a vector with 3 coordinates`)
            }
        }
    }
}
