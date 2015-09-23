import ContextListener = require('../core/ContextListener');
import IDrawable = require('../core/IDrawable');
import IMaterial = require('../core/IMaterial');
import IUnknown = require('../core/IUnknown');
/**
 * @interface IDrawList
 * @extends ContextListener
 * @extends IUnknown
 * @extends UniformDataVisitor
 *
 * ContextListener because it prefers a WebGLRenderingContext outside the animation loop.
 * IUnknown because it is responsible for holding references to the drawables.
 * UniformDataVisitor because... FIXME
 */
interface IDrawList extends ContextListener, IUnknown {
    add(drawable: IDrawable): void;
    remove(drawable: IDrawable): void;
    traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (program: IMaterial) => void): void;
}
export = IDrawList;
