import {ContextConsumer} from './ContextConsumer';
import {Shareable} from './Shareable';

interface ContextManager extends Shareable {
    synchronize(consumer: ContextConsumer): void;
    addContextListener(consumer: ContextConsumer): void;
    removeContextListener(consumer: ContextConsumer): void;
}

export default ContextManager;
