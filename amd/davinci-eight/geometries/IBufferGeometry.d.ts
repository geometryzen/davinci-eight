import IGraphicsProgram = require('../core/IGraphicsProgram');
import IUnknown = require('../core/IUnknown');
/**
 * A buffer geometry is implicitly bound to a single context.
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
     * @param program {IGraphicsProgram}
     * @param aNameToKeyName
     * @return {void}
     */
    bind(program: IGraphicsProgram, aNameToKeyName?: {
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
