import RenderingContextUser = require('../core/RenderingContextUser');
import UniformProvider = require('../core/UniformProvider');
/**
 * The Drawable interface indicates that the implementation can make a call
 * to either drawArrays or drawElements on the WebGLRenderingContext.
 * @class Drawable
 * @extends RenderingContextUser
 */
interface Drawable extends RenderingContextUser {
    /**
     * @property drawGroupName
     * @type string
     */
    drawGroupName: string;
    /**
     * @method useProgram
     */
    useProgram(): any;
    /**
     * @method draw
     * @param view {UniformProvider}
     */
    draw(view: UniformProvider): any;
}
export = Drawable;
