import {Material} from './Material';
import {Shareable} from './Shareable';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class PrimitiveBuffers
 * @extends Shareable
 */
interface PrimitiveBuffers extends Shareable {

    /**
     * @property uuid
     * @type {string}
     */
    uuid: string;

    /**
     * @method bind
     * @param material {Material}
     * @return {void}
     */
    bind(material: Material): void;

    /**
     * @method draw
     * @return {void}
     */
    draw(): void;

    /**
     * @method unbind
     * @return {void}
     */
    unbind(): void;
}

export default PrimitiveBuffers;
