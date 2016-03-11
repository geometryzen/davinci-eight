import RingOperators from '../math/RingOperators';

/**
 *
 */
interface DivisionRingOperators<T, UNIT> extends RingOperators<T, UNIT> {
    __div__(rhs: any): T
    __rdiv__(lhs: any): T
}

export default DivisionRingOperators;
