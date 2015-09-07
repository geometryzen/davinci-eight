import IUnknown = require('../core/IUnknown');
/**
 * This interface standardizes the concept of an implementation being dependent upon
 * a WebGLRenderingContext. The notification methods for context gain, loss, and free
 * allow the implementation to participate in the dynamic and volatile environment
 * whereupon a browser may reset its WebGLRenderingContext(s).
 * @class RenderingContextUser
 */
interface RenderingContextUser extends IUnknown {
  /**
   * Called to request the dependent to free any WebGL resources acquired and owned.
   * The dependent may assume that its cached context is still valid in order
   * to properly dispose of any cached resources. In the case of shared objects, this
   * method may be called multiple times for what is logically the same context. In such
   * cases the dependent must be idempotent and respond only to the first request.
   * @method contextFree
   */
  contextFree(): void;
  /**
   * Called to inform the dependent of a new WebGLRenderingContext.
   * The implementation should ignore the notification if it has already
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
}

export = RenderingContextUser;
