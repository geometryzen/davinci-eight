/**
 * @class Vector
 */
interface Vector {
    /**
     * @method sub
     * @param rhs {Vector}
     * @param α [number = 1]
     * @return {Vector}
     */
    sub(rhs: Vector, α?: number): Vector;
}
export = Vector;
