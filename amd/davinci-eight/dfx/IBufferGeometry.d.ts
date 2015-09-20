import IProgram = require('../core/IProgram');
import IUnknown = require('../core/IUnknown');
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
     * @param program {IProgram}
     * @param aNameToKeyName
     * @return {void}
     */
    bind(program: IProgram, aNameToKeyName?: {
        [name: string]: string;
    }): void;
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
export = IBufferGeometry;
