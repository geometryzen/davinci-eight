import ContextListener = require('../core/ContextListener');
import IContextCommand = require('../core/IContextCommand');
import IDrawList = require('../scene/IDrawList');
import IUnknown = require('../core/IUnknown');
import UniformData = require('../core/UniformData');
/**
 * @interface ContextRenderer
 * @extends ContextListener
 * @extends IUnknown
 */
interface ContextRenderer extends ContextListener, IUnknown {
    /**
     * The (readonly) cached WebGL rendering context. The context may sometimes be undefined.
     */
    gl: WebGLRenderingContext;
    /**
     * Executes the prolog commands.
     */
    prolog(): void;
    /**
     * @method pushProlog
     * @param command {IContextCommand}
     */
    pushProlog(command: IContextCommand): any;
    /**
     * @method pushStartUp
     * @param command {IContextCommand}
     */
    pushStartUp(command: IContextCommand): any;
    /**
     * Render the contents of the drawList.
     * This is a convenience method that calls clear and then traverses the DrawList calling draw on each Drawable.
     */
    render(drawList: IDrawList, ambients: UniformData): void;
}
export = ContextRenderer;
