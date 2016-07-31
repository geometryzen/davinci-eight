import AbstractColor from '../core/AbstractColor';
import VectorE3 from '../math/VectorE3'
import VisualOptions from './VisualOptions'

/**
 *
 */
interface ArrowOptions extends VisualOptions {

    /**
     * @default <b>e</b><sub>2</sub>
     */
    vector?: VectorE3;
    color?: AbstractColor;
}

export default ArrowOptions
