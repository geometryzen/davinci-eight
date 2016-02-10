import Material from './Material';
import IUnknown from './IUnknown';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class PrimitiveBuffers
 * @extends IUnknown
 */
interface PrimitiveBuffers extends IUnknown {

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
