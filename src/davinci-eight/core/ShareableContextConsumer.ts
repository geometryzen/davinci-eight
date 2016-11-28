import { ContextConsumer } from './ContextConsumer';
import ContextManager from './ContextManager';
import EngineSubscriber from './EngineSubscriber';
import isUndefined from '../checks/isUndefined';
import isNull from '../checks/isNull';
import mustBeNonNullObject from '../checks/mustBeNonNullObject';
import readOnly from '../i18n/readOnly';
import { ShareableBase } from './ShareableBase';

/**
 * <p>
 * A base <code>class</class> for <code>ContextConsumer</code>(s).
 * </p>
 * <p>
 * Using this base <code>class</code> provides a standard and reliable way to
 * subscribe to <code>ContextManager</code> events. Extending this class provides automatic
 * subscribe at construction time and automatic unsubscribe in destruction. However,
 * it does not provide automatic synchronization (contextGain events) or automatic clean up
 * (contextFree or contextLost events) as these would violate the principle that the base
 * class should not call derived class methods during construction or destruction.
 * </p>
 *
 *
 *     class MyContextConsumer extends EIGHT.ShareableContextConsumer {
 *       constructor(contextManager: EIGHT.ContextManager, levelUp = 0) {
 *         super(contextManager);
 *         this.setLoggingName('MyContextConsumer');
 *         // Allocate your own resources here or on-demand.
 *         if (levelUp === 0) {
 *           this.synchUp();
 *         }
 *       }
 *       protected destructor(levelUp: number): void {
 *         if (levelUp === 0) {
 *           this.cleanUp();
 *         }
 *         // Deallocate your own resources here.
 *         super.destructor(levelUp + 1);
 *       }
 *     }
 *
 */
export class ShareableContextConsumer extends ShareableBase implements ContextConsumer, EngineSubscriber {

    /**
     * The <code>ContextManager</code> to which this consumer is subscribed.
     * The existence of this property indicates a subscription.
     * Therefore, before releasing this reference, be sure to unsubscribe.
     */
    protected contextManager: ContextManager;

    /**
     * We hold onto the context provider after a contextGain event.
     * However, this is only a convenience for derived classes.
     * (Maybe we should not do this).
     * We only need to release this property in our destructor.
     * We must not try to trigger a contextFree as that would violate Implementation Hierarchy Principle.
     */
    // private contextProvider: ContextProvider;

    constructor(contextManager: ContextManager) {
        super();

        mustBeNonNullObject('contextManager', contextManager);

        this.setLoggingName('ShareableContextConsumer');

        if (!isNull(contextManager) && !isUndefined(contextManager)) {
            this.subscribe(contextManager, false);
        }
    }

    protected destructor(levelUp: number): void {
        this.unsubscribe();
        super.destructor(levelUp + 1);
    }

    /**
     * <p>
     * Instructs the consumer to subscribe to context events.
     * </p>
     * <p>
     * This method is idempotent; calling it more than once with the same <code>ContextManager</code> does not change the state.
     * </p>
     */
    subscribe(contextManager: ContextManager, synchUp: boolean): void {
        contextManager = mustBeNonNullObject('contextManager', contextManager);
        if (!this.contextManager) {
            contextManager.addRef();
            this.contextManager = contextManager;
            contextManager.addContextListener(this);
            if (synchUp) {
                this.synchUp();
            }
        }
        else {
            if (this.contextManager !== contextManager) {
                // We can only subscribe to one ContextManager at at time.
                this.unsubscribe();
                this.subscribe(contextManager, synchUp);
            }
            else {
                // We are already subscribed to this ContextManager (Idempotentency)
            }
        }
    }

    /**
     *
     */
    public synchUp() {
        const manager = this.contextManager;
        if (manager) {
            manager.synchronize(this);
        }
    }

    /**
     *
     */
    public cleanUp(): void {
        if (this.contextManager && this.contextManager.gl) {
            if (this.contextManager.gl.isContextLost()) {
                this.contextLost();
            }
            else {
                this.contextFree();
            }
        }
        else {
            // There is no contextProvider so resources should already be clean.
        }
    }

    /**
     * <p>
     * Instructs the consumer to unsubscribe from context events.
     * </p>
     * <p>
     * This method is idempotent; calling it more than once does not change the state.
     * </p>
     */
    unsubscribe(): void {
        if (this.contextManager) {
            this.contextManager.removeContextListener(this);
            this.contextManager.release();
            this.contextManager = void 0;
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
        if (this.contextManager) {
            return this.contextManager.gl;
        }
        else {
            return void 0;
        }
    }
    set gl(unused: WebGLRenderingContext) {
        throw new Error(readOnly('gl').message);
    }
}
