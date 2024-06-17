import { mustBeNonNullObject } from "../checks/mustBeNonNullObject";
import { ContextConsumer } from "./ContextConsumer";
import { ContextManager } from "./ContextManager";
import { ShareableBase } from "./ShareableBase";

/**
 * @hidden
 */
export class ShareableContextConsumer extends ShareableBase implements ContextConsumer {
    /**
     * Keep track of subscription state
     */
    private isSubscribed = false;

    /**
     * Creates a subscription to WebGL rendering context events from the contextManager but
     * defers synchronization (because this is a base class).
     * The contextManager must be defined.
     * @param contextManager The ContextManager that will be subscribed to for WebGL rendering context events.
     */
    constructor(protected contextManager: ContextManager) {
        super();
        // The buck stops here so we must assert the existence of the contextManager.
        mustBeNonNullObject("contextManager", contextManager);
        this.setLoggingName("ShareableContextConsumer");
        contextManager.addRef();
        this.subscribe(false);
    }

    /**
     *
     */
    protected resurrector(levelUp: number): void {
        super.resurrector(levelUp + 1);
        this.setLoggingName("ShareableContextConsumer");
        this.contextManager.addRef();
        this.subscribe(false);
    }

    /**
     *
     */
    protected destructor(levelUp: number): void {
        this.unsubscribe(false);
        this.contextManager.release();
        super.destructor(levelUp + 1);
    }

    /**
     * Instructs the consumer to subscribe to context events.
     *
     * This method is idempotent; calling it more than once with the same <code>ContextManager</code> does not change the state.
     */
    private subscribe(synchUp: boolean): void {
        if (!this.isSubscribed) {
            this.contextManager.addContextListener(this);
            this.isSubscribed = true;
            if (synchUp) {
                this.synchUp();
            }
        }
    }

    /**
     * Instructs the consumer to unsubscribe from context events.
     *
     * This method is idempotent; calling it more than once does not change the state.
     */
    private unsubscribe(cleanUp: boolean): void {
        if (this.isSubscribed) {
            this.contextManager.removeContextListener(this);
            this.isSubscribed = false;
            if (cleanUp) {
                this.cleanUp();
            }
        }
    }

    /**
     *
     */
    public synchUp() {
        this.contextManager.synchronize(this);
    }

    /**
     *
     */
    public cleanUp(): void {
        if (this.gl) {
            if (this.gl.isContextLost()) {
                this.contextLost();
            } else {
                this.contextFree();
            }
        } else {
            // There is no contextProvider so resources should already be clean.
        }
    }

    contextFree(): void {
        // Do nothing.
    }

    contextGain(): void {
        // Do nothing.
    }

    contextLost(): void {
        // Do nothing.
    }

    /**
     * Provides access to the underlying WebGL context.
     */
    get gl(): WebGLRenderingContext {
        return this.contextManager.gl;
    }
}
