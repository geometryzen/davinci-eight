import ContextProvider from '../core/ContextProvider';
import readOnly from '../i18n/readOnly';
import { ShareableBase } from '../core/ShareableBase';

/**
 * Displays details about the WegGL version to the console.
 */
export default class ContextAttributesLogger extends ShareableBase {
    /**
     *
     */
    constructor() {
        super();
    }

    protected destructor(levelUp: number): void {
        super.destructor(levelUp + 1);
    }

    contextFree(manager: ContextProvider): void {
        // Do nothing.
    }

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

    contextLost(): void {
        // Do nothing.
    }

    get name(): string {
        return this._type
    }
    set name(unused) {
        throw new Error(readOnly('name').message)
    }
}
