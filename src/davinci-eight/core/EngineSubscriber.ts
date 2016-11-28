import { Engine } from './Engine';

/**
 * Provides standardization of methods for Engine subscribe.
 */
export interface EngineSubscriber {
    /**
     * Instructs the target to subscribe to context loss and restore events from the engine.
     * The target will usually maintain and addRef a reference to the engine.
     * The target will call addContextListener on the engine.
     * If the synchUp parameter is true, the target will call the synchronize method on the engine.
     */
    subscribe(engine: Engine, synchUp: boolean): void;
    /**
     * Instructs the target to unsubscribe from context loss and restore events from the engine.
     * The target will call removeContextListener on the engine.
     * The target will release its reference to the engine.
     */
    unsubscribe(): void;
}

export default EngineSubscriber;
