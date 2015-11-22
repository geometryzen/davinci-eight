import Scalar = require('../math/Scalar')

/**
 * The even sub-algebra of the <em>Euclidean algebra 𝓖(2, 0)</em>.
 * @class SpinorE2
 * @extends Scalar
 */
interface SpinorE2 extends Scalar {
    /**
     * The <em>bivector</em> xy-coordinate as a <code>number</code>.
     */
    xy: number;
}

export = SpinorE2;