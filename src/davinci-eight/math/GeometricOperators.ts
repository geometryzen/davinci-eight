import LinearOperators from '../math/LinearOperators';
import RingOperators from '../math/RingOperators';

/**
 * Special methods for operators on elements of geometric spaces.
 */
interface GeometricOperators<T, UNIT> extends LinearOperators<T, UNIT>, RingOperators<T, UNIT> {
    __div__(rhs: any): T
    __rdiv__(lhs: any): T

    __vbar__(rhs: any): T
    __rvbar__(lhs: any): T

    __wedge__(rhs: any): T
    __rwedge__(lhs: any): T

    __lshift__(rhs: any): T
    __rlshift__(lhs: any): T

    __rshift__(rhs: any): T
    __rrshift__(lhs: any): T

    /**
     * !x = x.inv()
     */
    __bang__(): T

    /**
     * Inverse (may not exist).
     */
    inv(): T;
}

export default GeometricOperators
