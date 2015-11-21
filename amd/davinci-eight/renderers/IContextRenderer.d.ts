import Capability = require('../commands/Capability');
import IContextConsumer = require('../core/IContextConsumer');
import IContextCommand = require('../core/IContextCommand');
import IUnknownArray = require('../collections/IUnknownArray');
/**
 * This interface is to be implemented by classes associated with a single context.
 * This means that the commands are not shared.
 * @class IContextRenderer
 * @extends IContextConsumer
 */
interface IContextRenderer extends IContextConsumer {
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
     * Specifies color values to use by the <code>clear</code> method to clear the color buffer.
     * <p>
     * @method clearColor
     * @param red {number}
     * @param green {number}
     * @param blue {number}
     * @param alpha {number}
     * @return {void}
     */
    clearColor(red: number, green: number, blue: number, alpha: number): void;
    /**
     * @property commands
     * @type {IUnknownArray}
     * @beta
     */
    commands: IUnknownArray<IContextCommand>;
    /**
     * Turns off specific WebGL capabilities for this context.
     * @method disable
     * @param capability {Capability}
     * @return {void} This method does not return a value.
     */
    disable(capability: Capability): void;
    /**
     * Turns on specific WebGL capabilities for this context.
     * @method enable
     * @param capability {Capability}
     * @return {void} This method does not return a value.
     */
    enable(capability: Capability): void;
    /**
     * Defines what part of the canvas will be used in rendering the drawing buffer.
     * @method viewport
     * @param x {number}
     * @param y {number}
     * @param width {number}
     * @param height {number}
     * @return {void} This method does not return a value.
     */
    viewport(x: number, y: number, width: number, height: number): void;
}
export = IContextRenderer;
