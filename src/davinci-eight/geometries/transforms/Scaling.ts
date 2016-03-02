import mustBeObject from '../../checks/mustBeObject'
import Spinor3 from '../../math/Spinor3'
import Vector3 from '../../math/Vector3'
import VectorE3 from '../../math/VectorE3'
import Vertex from '../primitives/Vertex'
import Transform from './Transform'

/**
 * Applies texture coordinates to a vertex.
 *
 * @class Scaling
 */
export default class Scaling implements Transform {
    private stress: VectorE3
    private names: string[]
    /**
     * @class Scaling
     * @constructor
     * @param stress {VectorE3}
     * @param names {string[]}
     */
    constructor(stress: VectorE3, names: string[]) {
        this.stress = Vector3.copy(mustBeObject('stress', stress))
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
                vector.stress(this.stress)
                vertex.attributes[aName] = vector
            }
            else if (v.length === 4) {
                const spinor = Spinor3.spinor(v.getComponent(0), v.getComponent(1), v.getComponent(2), v.getComponent(3))
                spinor.stress(this.stress)
                vertex.attributes[aName] = spinor
            }
            else {
                throw new Error(`Expecting ${aName} to be a vector with 3 coordinates`)
            }
        }
    }
}
