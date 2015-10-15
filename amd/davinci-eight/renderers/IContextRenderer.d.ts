import IContextConsumer = require('../core/IContextConsumer');
import IContextCommand = require('../core/IContextCommand');
import IUnknown = require('../core/IUnknown');
import IUnknownArray = require('../collections/IUnknownArray');
/**
 * This interface is to be implemented by classes associated with a single context.
 * This does mean that the commands are not shared.
 * @class IContextRenderer
 * @extends IContextConsumer
 * @extends IUnknown
 */
interface IContextRenderer extends IContextConsumer, IUnknown {
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
     *
     */
    commands: IUnknownArray<IContextCommand>;
}
export = IContextRenderer;
