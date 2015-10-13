import IContextProvider = require('../core/IContextProvider');
import IUnknown = require('../core/IUnknown');
/**
 * This interface standardizes the concept of an implementation being dependent upon
 * a WebGL rendering context. The notification methods for context gain, loss, and free
 * allow the implementation to participate in the dynamic and volatile environment
 * whereupon a browser may reset its WebGL rendering contexts.
 * @class IContextConsumer
 * @extends IUnknown
 */
interface IContextConsumer extends IUnknown {
    /**
     * Called to request the dependent to free any WebGL resources acquired and owned.
     * The dependent may assume that its cached context is still valid in order
     * to properly dispose of any cached resources. In the case of shared objects, this
     * method may be called multiple times for what is logically the same context. In such
     * cases the dependent must be idempotent and respond only to the first request.
     * @method contextFree
     * @param canvasId {number} Determines the context for which resources are being freed.
     */
    contextFree(canvasId: number): void;
    /**
     * Called to inform the dependent of a new WebGL rendering context.
     * The implementation should ignore the notification if it has already
     * received the same context.
     * @method contextGain
     * @param manager {IContextProvider} If there's something strange in your neighborhood.
     */
    contextGain(manager: IContextProvider): void;
    /**
     * Called to inform the dependent of a loss of WebGL rendering context.
     * The dependent must assume that any cached context is invalid.
     * The dependent must not try to use and cached context to free resources.
     * The dependent should reset its state to that for which there is no context.
     * @method contextLost
     * @param canvasId {number} Determines the context for which resources are being lost.
     *
     * The canvasId is provided, rather than the manager, to remind implementors
     * that resources have been lost and cannot be freed by the application.
     */
    contextLost(canvasId: number): void;
}
export = IContextConsumer;
