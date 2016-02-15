import Scalar from '../math/Scalar';
import Pseudo from '../math/Pseudo';

/**
 * The even sub-algebra of the <em>Euclidean algebra 𝓖(2, 0)</em>.
 * @class SpinorE2
 * @extends Scalar
 * @extends Pseudo
 */
interface SpinorE2 extends Scalar, Pseudo {
    /**
     * The <em>bivector</em> xy-coordinate as a <code>number</code>.
     */
    xy: number;
}

export default SpinorE2;
