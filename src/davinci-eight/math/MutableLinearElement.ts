import LinearElement from '../math/LinearElement';

/**
 * This interface is provided to ensure consistency.
 * It is not part of the documented API.
 */
interface MutableLinearElement<I, M, S, V> extends LinearElement<I, M, S, V> {

    /**
     * <p>
     * <code>this ⟼ a * α + b * β</code>
     * </p>
     */
    add2(a: I, b: I, α?: number, β?: number): M;

    /**
     * Computes a copy of this element.
     */
    clone(): M;

    /**
     * Copies the source coordinates onto this element.
     */
    copy(source: I): M;

    /**
     * <p>
     * <code>this ⟼ a * α - b * β</code>
     * </p>
     */
    sub2(a: I, b: I): M;

    /**
     * Sets this element to the identity element for addition, <b>0</b>.
     */
    zero(): M;
}

export default MutableLinearElement;
