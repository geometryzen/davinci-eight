import Material from './Material';
import IUnknown from './IUnknown';

/**
 * @module EIGHT
 * @submodule core
 */

/**
 * @class IBufferGeometry
 * @extends IUnkown
 */
interface IBufferGeometry extends IUnknown {

    /**
     * @property uuid
     * @type {string}
     */
    uuid: string;

    /**
     * @method bind
     * @param program {Material}
     * @param aNameToKeyName
     * @return {void}
     */
    bind(program: Material, aNameToKeyName?: { [name: string]: string }): void;

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

export default IBufferGeometry;
