import Attribute from './Attribute';
import BeginMode from './BeginMode';

/**
 * @module EIGHT
 * @submodule core
 * @class Primitive
 */
interface Primitive {
    /**
     *
     */
    mode: BeginMode;

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
