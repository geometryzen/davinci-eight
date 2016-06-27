import {Engine} from './Engine';

/**
 * Provides standardization of methods for Engine subscribe.
 */
interface EngineSubscriber {
    subscribe(engine: Engine): void;
    unsubscribe(): void;
}

export default EngineSubscriber;
