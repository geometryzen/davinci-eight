import IContextProvider from '../core/IContextProvider';
import readOnly from '../i18n/readOnly';
import Shareable from '../core/Shareable';

/**
 * <p>
 * Displays details about the WegGL version to the console.
 * <p> 
 * @class ContextAttributesLogger
 * @extends Shareable
 */
export default class ContextAttributesLogger extends Shareable {
    /**
     * @class ContextAttributesLogger
     * @constructor
     */
    constructor() {
        super('ContextAttributesLogger')
    }

    /**
     * @method destructor
     * @return {void}
     */
    protected destructor(): void {
        super.destructor()
    }

    /**
     * @method contextFree
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextFree(manager: IContextProvider): void {
        // Do nothing.
    }

    /**
     * @method contextGain
     * @param manager {IContextProvider}
     * @return {void}
     */
    contextGain(manager: IContextProvider): void {
        const gl = manager.gl
        const attributes: WebGLContextAttributes = gl.getContextAttributes()
        console.log("alpha                 => " + attributes.alpha)
        console.log("antialias             => " + attributes.antialias)
        console.log("depth                 => " + attributes.depth)
        console.log("premultipliedAlpha    => " + attributes.premultipliedAlpha)
        console.log("preserveDrawingBuffer => " + attributes.preserveDrawingBuffer)
        console.log("stencil               => " + attributes.stencil)
    }

    /**
     * @method contextLost
     * @return {void}
     */
    contextLost(): void {
        // Do nothing.
    }

    /**
     * @property name
     * @type string
     * @readOnly
     */
    get name(): string {
        return this._type
    }
    set name(unused) {
        throw new Error(readOnly('name').message)
    }
}
