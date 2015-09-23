import ContextListener = require('../core/ContextListener');
import IContextCommand = require('../core/IContextCommand');
import IDrawList = require('../scene/IDrawList');
import IUnknown = require('../core/IUnknown');
import UniformData = require('../core/UniformData');
/**
 * This interface is to be implemented by classes associated with a single context.
 * This does mean that the commands are not shared.
 * @class ContextRenderer
 * @extends ContextListener
 * @extends IUnknown
 */
interface ContextRenderer extends ContextListener, IUnknown {
    /**
     * The (readonly) cached WebGL rendering context. The context may sometimes be undefined.
     * @property gl
     * @type {WebGLRenderingContext}
     * @readOnly
     */
    gl: WebGLRenderingContext;
    /**
     * @property canvasElement
     * @type {HTMLCanvasElement}
     * @readOnly
     */
    canvasElement: HTMLCanvasElement;
    /**
     * <p>
     * Determines whether the prolog commands are run automatically as part of the render method.
     * </p>
     * @property autoProlog
     * @type {boolean}
     */
    autoProlog: boolean;
    /**
     * Executes the prolog commands.
     * @method prolog
     * @return {void}
     */
    prolog(): void;
    /**
     * @method pushProlog
     * @param command {IContextCommand}
     * @return {void}
     */
    pushProlog(command: IContextCommand): void;
    /**
     * @method pushStartUp
     * @param command {IContextCommand}
     * @return {void}
     */
    pushStartUp(command: IContextCommand): void;
    /**
     * Render the contents of the drawList.
     * This is a convenience method that calls clear and then traverses the DrawList calling draw on each Drawable.
     * @method render
     * @param drawList {IDrawList} A traversable list of things to be drawn.
     * @param ambients {UniformData}
     * @return {void}
     */
    render(drawList: IDrawList, ambients: UniformData): void;
}
export = ContextRenderer;
