import mustBeNumber from '../../checks/mustBeNumber'
import Coords from '../../math/Coords'
import {Geometric2} from '../../math/Geometric2'
import {Geometric3} from '../../math/Geometric3'
import Spinor2 from '../../math/Spinor2'
import Spinor3 from '../../math/Spinor3'
import Vector2 from '../../math/Vector2'
import Vector3 from '../../math/Vector3'
import Vertex from '../primitives/Vertex'
import Transform from '../primitives/Transform'

/**
 * @class Approximation
 */
export default class Approximation implements Transform {

    /**
     * @property n
     * @type {number}
     * @private
     */
    private n: number

    /**
     * The names of the attributes that will be affected.
     *
     * @property names
     * @type string[]
     * @private
     */
    private names: string[]

    /**
     * @class Approximation
     * @constructor
     * @param n {number}
     * @param names {string[]}
     */
    constructor(n: number, names: string[]) {
        this.n = mustBeNumber('n', n)
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

            if (v instanceof Coords) {
                v.approx(this.n)
            }
            else if (v instanceof Vector3) {
                v.approx(this.n)
            }
            else if (v instanceof Spinor3) {
                v.approx(this.n)
            }
            else if (v instanceof Vector2) {
                v.approx(this.n)
            }
            else if (v instanceof Spinor2) {
                v.approx(this.n)
            }
            else if (v instanceof Geometric2) {
                v.approx(this.n)
            }
            else if (v instanceof Geometric3) {
                v.approx(this.n)
            }
            else {
                throw new Error(`Expecting ${aName} to be a Coords`)
            }
        }
    }
}
