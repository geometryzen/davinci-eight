import LinearNumber from '../math/LinearNumber';

/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface MutableLinearElement<I, M, S, V, MAGNITUDE, SCALING> extends LinearNumber<I, M, S, V, MAGNITUDE, SCALING> {

    /**
     * Discards coordinates which are significantly smaller than the maximum coordinate.
     */
    approx(n: number): M;

    /**
     * Computes a copy of this element.
     */
    clone(): M;

    /**
     * Copies the source coordinates onto this element.
     */
    copy(source: I): M;

    /**
     * Sets this element to the identity element for addition, <b>0</b>.
     */
    zero(): M;
}

export default MutableLinearElement;
