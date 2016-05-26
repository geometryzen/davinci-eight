import incLevel from '../base/incLevel';
import ContextProvider from '../core/ContextProvider';
import readOnly from '../i18n/readOnly';
import {ShareableBase} from '../core/ShareableBase';

/**
 * <p>
 * Displays details about the WegGL version to the console.
 * <p> 
 * @class ContextAttributesLogger
 * @extends ShareableBase
 */
export default class ContextAttributesLogger extends ShareableBase {
    /**
     * @class ContextAttributesLogger
     * @constructor
     */
    constructor() {
        super()
    }

    /**
     * @method destructor
     * @param levelUp {number}
     * @return {void}
     */
    protected destructor(levelUp: number): void {
        super.destructor(incLevel(levelUp))
    }

    /**
     * @method contextFree
     * @param manager {ContextProvider}
     * @return {void}
     */
    contextFree(manager: ContextProvider): void {
        // Do nothing.
    }

    /**
     * @method contextGain
     * @param manager {ContextProvider}
     * @return {void}
     */
    contextGain(manager: ContextProvider): void {
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
