import { isString } from '../checks/isString';
import { mustSatisfy } from '../checks/mustSatisfy';

/**
 * @hidden
 */
function beAString() {
    return "be a string";
}

/**
 * @hidden
 */
export function mustBeString(name: string, value: string, contextBuilder?: () => string): string {
    mustSatisfy(name, isString(value), beAString, contextBuilder);
    return value;
}
