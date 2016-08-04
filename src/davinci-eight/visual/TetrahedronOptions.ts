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
    color?: { r: number; g: number; b: number };
}

export default TetrahedronOptions;
