import ShareableWebGLProgram from './ShareableWebGLProgram';
import IUnknown from './IUnknown';

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
     * @param program {ShareableWebGLProgram}
     * @param aNameToKeyName
     * @return {void}
     */
    bind(program: ShareableWebGLProgram, aNameToKeyName?: { [name: string]: string }): void;

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
