import AbelianOperators from '../math/AbelianOperators';
/**
 * A ring is an abelian group with a second binary operation that is associative,
 * is distributive over the abelian group operation and has an identity element.
 */
interface RingOperators<T, UNIT> extends AbelianOperators<T, UNIT> {

    /**
     * Multiplication of the the target from the right.
     */
    __mul__(rhs: any): T

    /**
     * Multiplication of the the target from the left.
     */
    __rmul__(lhs: any): T

    /**
     * The multiplicative inverse is denoted by inv.
     */
    inv(): T

    /**
     * Determines whether this element is the multiplicative identity, <b>1</b>.
     */
    isOne(): boolean
}

export default RingOperators;
