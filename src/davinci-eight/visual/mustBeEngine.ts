import { Engine } from '../core/Engine';

/**
 * Helper class to make the context of errors explicit in visual constructors.
 */
export default function mustBeEngine(engine: Engine, className: string): Engine {
    if (engine instanceof Engine) {
        return engine;
    }
    else {
        throw new Error(`Expecting Engine in constructor for class ${className}.`);
    }
}
