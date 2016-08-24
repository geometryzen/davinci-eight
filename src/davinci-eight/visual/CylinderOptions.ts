import VisualOptions from './VisualOptions';
import VectorE3 from '../math/VectorE3';

/**
 *
 */
interface CylinderOptions extends VisualOptions {

    /**
     * @default e2
     */
    axis?: VectorE3;

    /**
     *
     * @default 1
     */
    length?: number;

    /**
     *
     * @default false
     */
    openBase?: boolean;

    /**
     *
     * @default false
     */
    openCap?: boolean;

    /**
     *
     * @default false
     */
    openWall?: boolean;

    /**
     *
     * @default 1
     */
    radius?: number;
}

export default CylinderOptions;
