import ContextListener = require('../core/ContextListener');
import IDrawList = require('../scene/IDrawList');
import UniformData = require('../core/UniformData');
/**
 * @interface Renderer
 * @extends ContextListener
 */
interface Renderer extends ContextListener {
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
     * Render the contents of the drawList.
     * This is a convenience method that calls clear and then traverses the DrawList calling draw on each Drawable.
     */
    render(drawList: IDrawList, ambients: UniformData): void;
}
export = Renderer;
