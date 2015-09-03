import RenderingContextUser = require('../core/RenderingContextUser');
import DrawList = require('../drawLists/DrawList');
/**
 * @class Renderer
 * @extends RenderingContextUser
 */
interface Renderer extends RenderingContextUser {
    /**
     * The (readonly) cached WebGLRenderingContext. The context may sometimes be undefined.
     */
    context: WebGLRenderingContext;
    /**
    * @property autoClear
    * Defines whether the renderer should automatically clear its output before rendering.
    */
    autoClear: boolean;
    /**
     *
     */
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    /**
     * Clears buffers to preset values specified by clearColor(), clearDepth() and clearStencil().
     * @method clear
     * @param mask {number} A bitwise OR of masks that indicates the buffers to be cleared.
     */
    clear(mask: number): void;
    /**
     * Render the contents of the drawList.
     * This is a convenience method that calls clear and then traverses the DrawList calling draw on each Drawable.
     */
    render(drawList: DrawList): void;
    /**
     *
     */
    COLOR_BUFFER_BIT: number;
    DEPTH_BUFFER_BIT: number;
    STENCIL_BUFFER_BIT: number;
}
export = Renderer;
