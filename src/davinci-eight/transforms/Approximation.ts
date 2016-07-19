import mustBeNumber from '../checks/mustBeNumber'
import {Coords} from '../math/Coords'
import {Geometric2} from '../math/Geometric2'
import {Geometric3} from '../math/Geometric3'
import Spinor2 from '../math/Spinor2'
import Spinor3 from '../math/Spinor3'
import {Vector2} from '../math/Vector2'
import Vector3 from '../math/Vector3'
import Vertex from '../atoms/Vertex'
import Transform from '../atoms/Transform'

/**
 * A `Transform` that calls the `approx` method on a `Vertex` attribute.
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
     * @param n The value that will be passed to the `approx` method.
     * @param names The names of the attributes that are affected.
     */
    constructor(n: number, names: string[]) {
        this.n = mustBeNumber('n', n)
        this.names = names
    }

    /**
     * @param vertex
     * @param i
     * @param j
     * @param iLength
     * @param jLength
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
                throw new Error(`Expecting ${aName} to be a VectorN`)
            }
        }
    }
}
