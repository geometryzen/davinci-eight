import { ContextConsumer } from './ContextConsumer';
import { Shareable } from './Shareable';

/**
 * 
 */
export interface ContextManager extends Shareable {
    /**
     * 
     */
    readonly gl: WebGLRenderingContext;
    /**
     * 
     */
    synchronize(consumer: ContextConsumer): void;
    /**
     * 
     */
    addContextListener(consumer: ContextConsumer): void;
    /**
     * 
     */
    removeContextListener(consumer: ContextConsumer): void;
}

export default ContextManager;
