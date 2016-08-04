import SpinorE3 from '../math/SpinorE3';
import VectorE3 from '../math/VectorE3';
import VisualOptions from './VisualOptions';

/**
 * The options for creating a Sphere.
 */
interface SphereOptions extends VisualOptions {

    /**
     *
     */
    color?: { r: number; g: number; b: number };

    /**
     *
     * @default 0
     */
    offset?: VectorE3;

    /**
     *
     * @default 0
     */
    position?: VectorE3;

    /**
     *
     * @default 0.5
     */
    radius?: number

    scale?: VectorE3;
    tilt?: SpinorE3;
}

export default SphereOptions;
