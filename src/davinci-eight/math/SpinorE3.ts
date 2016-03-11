import Scalar from '../math/Scalar';

/**
 * The even sub-algebra of the <em>Euclidean algebra 𝓖(3, 0)</em>.
 * @class SpinorE3
 * @extends Scalar
 */
interface SpinorE3 extends Scalar {

    /**
     * The <em>bivector</em> yz-coordinate as a <code>number</code>.
     */
    yz: number;

    /**
     * The <em>bivector</em> zx-coordinate as a <code>number</code>.
     */
    zx: number;

    /**
     * The <em>bivector</em> xy-coordinate as a <code>number</code>.
     */
    xy: number;
}

export default SpinorE3;
