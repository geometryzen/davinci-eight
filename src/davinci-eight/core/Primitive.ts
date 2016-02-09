import Attribute from './Attribute';
import DrawMode from './DrawMode';

/**
 * @module EIGHT
 * @submodule core
 * @class Primitive
 */
interface Primitive {
    /**
     * @property mode
     * @type {DrawMode}
     */
    mode: DrawMode;

    /**
     * @property indices
     * @type {number[]}
     */
    indices: number[];

    /**
     * @property attributes
     * @type {{[name: string]: Attribute}}
     */
    attributes: { [name: string]: Attribute };
}

export default Primitive;
