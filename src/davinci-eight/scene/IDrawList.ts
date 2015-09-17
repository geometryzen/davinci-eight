import ContextListener = require('../core/ContextListener');
import IDrawable = require('../core/IDrawable');
import IUnknown = require('../core/IUnknown');
import UniformDataVisitor = require('../core/UniformDataVisitor');

// TODO: Does this hold weak or strong references.
// I'm guessing strong so that drawables added are retained.
// FIXME: Probably should extend IUnknown and rename IDrawList. 99% sure.
// TODO: Relationship to Scene.

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
interface IDrawList extends ContextListener, IUnknown, UniformDataVisitor {
  add(drawable: IDrawable): void;
  remove(drawable: IDrawable): void;
  traverse(callback: (drawable: IDrawable) => void): void;
}

export = IDrawList;
