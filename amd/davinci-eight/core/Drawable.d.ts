import RenderingContextUser = require('../core/RenderingContextUser');
import ShaderProgram = require('../core/ShaderProgram');
/**
 * The Drawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGLRenderingContext.
 * @class Drawable
 * @extends RenderingContextUser
 */
interface Drawable extends RenderingContextUser {
    /**
     * @property program
     */
    program: ShaderProgram;
    /**
     * @method draw
     */
    draw(): void;
}
export = Drawable;
