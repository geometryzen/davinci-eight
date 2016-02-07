import IContextCommand from '../core/IContextCommand';
import IContextProvider from '../core/IContextProvider';
import Shareable from '../core/Shareable';

var QUALIFIED_NAME = 'EIGHT.ContextAttributesLogger'

/**
 * <p>
 * Displays details about the WegGL version to the console.
 * <p> 
 * @class ContextAttributesLogger
 * @extends Shareable
 * @implements IContextCommand
 */
export default class ContextAttributesLogger extends Shareable implements IContextCommand {
    constructor() {
        super(QUALIFIED_NAME)
    }
    contextFree(manager: IContextProvider): void {
        // Do nothing.
    }
    contextGain(manager: IContextProvider): void {
        let gl = manager.gl
        let attributes: WebGLContextAttributes = gl.getContextAttributes()
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
    destructor(): void {
        super.destructor()
    }
    get name(): string {
        return QUALIFIED_NAME
    }
}
