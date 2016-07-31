import AbstractColor from '../core/AbstractColor';
import VisualOptions from './VisualOptions';

/**
 * @module EIGHT
 * @submodule visual
 */

/**
 * @class TetrahedronOptions
 * @extends VisualOptions
 */
interface TetrahedronOptions extends VisualOptions {
    /**
     * 
     */
    color?: AbstractColor;
}

export default TetrahedronOptions;
