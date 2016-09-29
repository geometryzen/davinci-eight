import ContextManager from '../core/ContextManager';

/**
 *
 */
interface BasisOptions {

    /**
     * The manager of the WebGL context.
     */
    contextManager?: ContextManager;

    /**
     * The manager of the WebGL context (alias for contextManager).
     */
    engine?: ContextManager;
}

export default BasisOptions;
