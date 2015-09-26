import IContextConsumer = require('../core/IContextConsumer');
import IContextCommand = require('../core/IContextCommand');
import IPrologCommand = require('../core/IPrologCommand');
import IUnknown = require('../core/IUnknown');
/**
 * This interface is to be implemented by classes associated with a single context.
 * This does mean that the commands are not shared.
 * @class ContextRenderer
 * @extends IContextConsumer
 * @extends IUnknown
 */
interface ContextRenderer extends IContextConsumer, IUnknown {
    /**
     * The (readonly) cached WebGL rendering context. The context may sometimes be undefined.
     * @property gl
     * @type {WebGLRenderingContext}
     * @readOnly
     */
    gl: WebGLRenderingContext;
    /**
     * @property canvas
     * @type {HTMLCanvasElement}
     * @readOnly
     */
    canvas: HTMLCanvasElement;
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
     * Adds a command to the `prolog` that will be executed as part of the render() call, before drawing.
     * @method addPrologCommand
     * @param command {IPrologCommand}
     * @return {void}
     */
    addPrologCommand(command: IPrologCommand): void;
    /**
     * @method addContextGainCommand
     * @param command {IContextCommand}
     * @return {void}
     */
    addContextGainCommand(command: IContextCommand): void;
}
export = ContextRenderer;
