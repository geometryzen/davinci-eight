import { ContextConsumer } from './ContextConsumer';
import { ContextManager } from './ContextManager';
import { ShareableBase } from './ShareableBase';
/**
 *
 */
export declare class ShareableContextConsumer extends ShareableBase implements ContextConsumer {
    protected contextManager: ContextManager;
    /**
     * Keep track of subscription state
     */
    private isSubscribed;
    /**
     *
     */
    constructor(contextManager: ContextManager);
    /**
     *
     */
    protected resurrector(levelUp: number): void;
    /**
     *
     */
    protected destructor(levelUp: number): void;
    /**
     * Instructs the consumer to subscribe to context events.
     *
     * This method is idempotent; calling it more than once with the same <code>ContextManager</code> does not change the state.
     */
    private subscribe(synchUp);
    /**
     * Instructs the consumer to unsubscribe from context events.
     *
     * This method is idempotent; calling it more than once does not change the state.
     */
    private unsubscribe(cleanUp);
    /**
     *
     */
    synchUp(): void;
    /**
     *
     */
    cleanUp(): void;
    contextFree(): void;
    contextGain(): void;
    contextLost(): void;
    /**
     * Provides access to the underlying WebGL context.
     */
    readonly gl: WebGLRenderingContext;
}
