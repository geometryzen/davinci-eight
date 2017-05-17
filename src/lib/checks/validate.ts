import { isDefined } from './isDefined';

/**
 * Helper function for validating a named value and providing a default.
 */
export function validate<T>(name: string, value: T, defaultValue: T, assertFn: (name: string, value: T) => T): T {
    if (isDefined(value)) {
        return assertFn(name, value);
    }
    else {
        return defaultValue;
    }
}
