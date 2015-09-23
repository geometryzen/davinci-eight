import ContextListener = require('../core/ContextListener');
import IDrawable = require('../core/IDrawable');
import IMaterial = require('../core/IMaterial');
import IUnknown = require('../core/IUnknown');
import UniformData = require('../core/UniformData');

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
// TODO: Implementing UniformDataVisitor would require buffering uniforms then re-emitting them.
// In that case it may also be the wrong interface.  
interface IDrawList extends ContextListener, IUnknown/*, UniformDataVisitor*/ {
  add(drawable: IDrawable): void;
  remove(drawable: IDrawable): void;
  // FIXME: If we pass in ambients then we should be called draw
  // This is incompatible.
  traverse(callback: (drawable: IDrawable) => void, canvasId: number, prolog: (program: IMaterial) => void): void;
}

export = IDrawList;
