import ContextManager from '../core/ContextManager';
import isDefined from '../checks/isDefined';
import VisualOptions from './VisualOptions';

/**
 * Helper function to extract ContextManager because engine is an alias.
 * Remarks:
 * 1) contextManager exists because it reflects the interface.
 * 2) engine exists because it provides a convenient shortcut.
 */
export default function contextManagerFromOptions(options: VisualOptions): ContextManager {
    if (isDefined(options.engine)) {
        return options.engine;
    }
    else if (isDefined(options.contextManager)) {
        return options.contextManager;
    }
    else {
        return void 0;
    }
}
