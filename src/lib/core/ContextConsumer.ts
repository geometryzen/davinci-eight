import { Shareable } from './Shareable';

/**
 * This interface standardizes the concept of an implementation being dependent upon
 * a WebGL rendering context. The notification methods for context gain, loss, and free
 * allow the implementation to participate in the dynamic and volatile environment
 * whereupon a browser may reset its WebGL rendering contexts.
 */
export interface ContextConsumer extends Shareable {

    /**
     * Called to request the consumer to free any WebGL resources acquired and owned.
     * The consumer may assume that its cached context is still valid in order
     * to properly dispose of any cached resources. In the case of shared objects, this
     * method may be called multiple times for what is logically the same context. In such
     * cases the consumer must be idempotent and respond only to the first request.
     */
    contextFree?(): void;

    /**
     * Called to inform the dependent of a new WebGL rendering context.
     * The implementation should ignore the notification if it has already
     * received the same context.
     */
    contextGain?(): void;

    /**
     * Called to inform the dependent of a loss of WebGL rendering context.
     * The dependent must assume that any cached context is invalid.
     * The dependent must not try to use and cached context to free resources.
     * The dependent should reset its state to that for which there is no context.
     */
    contextLost?(): void;
}
