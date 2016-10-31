import { Engine } from './Engine';

/**
 * Provides standardization of methods for Engine subscribe.
 */
interface EngineSubscriber {
    subscribe(engine: Engine, synchUp: boolean): void;
    unsubscribe(): void;
}

export default EngineSubscriber;
