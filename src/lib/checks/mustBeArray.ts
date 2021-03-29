import { isArray } from '../checks/isArray';
import { mustSatisfy } from '../checks/mustSatisfy';

/**
 * @hidden
 */
function beAnArray() {
    return "be an array";
}

/**
 * @hidden
 */
export function mustBeArray<T>(name: string, value: T[], contextBuilder?: () => string): T[] {
    mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
    return value;
}
