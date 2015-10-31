import Scalar = require('../math/Scalar')

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
    /**
     * Computes the <em>square root</em> of the <em>squared norm</em>.
     * @method magnitude
     * @return {number}
     */
    magnitude(): number;
    squaredNorm(): number;
}

export = SpinorE3;