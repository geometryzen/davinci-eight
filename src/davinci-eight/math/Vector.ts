/**
 * @class Vector
 */
interface Vector {
    /**
     * @method sub
     * @param rhs {Vector}
     * @param [α = 1] {number}
     * @return {Vector}
     */
    sub(rhs: Vector, α?: number): Vector;
}

export default Vector;
