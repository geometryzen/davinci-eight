import ReferenceCounted = require('../core/ReferenceCounted');
/**
 * This interface standardizes the concept of an implementation being dependent upon
 * a WebGLRenderingContext. The notification methods for context gain, loss, and free
 * allow the implementation to participate in the dynamic and volatile environment
 * whereupon a browser may reset its WebGLRenderingContext(s).
 * @class RenderingContextUser
 */
interface RenderingContextUser extends ReferenceCounted {
  /**
   * Called to inform the dependent of a new WebGLRenderingContext.
   * The implementation should ignore thenotification if it has already
   * received the same context.
   * @method contextGain
   * @param context {WebGLRenderingContext} The WebGL rendering context.
   */
  contextGain(context: WebGLRenderingContext): void;
  /**
   * Called to inform the dependent of a loss of WebGLRenderingContext.
   * The dependent must assume that any cached context is invalid.
   * The dependent must not try to use and cached context to free resources.
   * The dependent should reset its state to that for which there is no context.
   * @method contextLoss
   */
  contextLoss(): void;
  /**
   * Determines whether the context user has a context.
   * @method hasContext
   */ 
  hasContext(): boolean;
}

export = RenderingContextUser;
