import RingOperators = require('../math/RingOperators')
/**
 */
interface DivisionRingOperators<T> extends RingOperators<T> {
    __div__(rhs: any): T
    __rdiv__(lhs: any): T

}

export = DivisionRingOperators