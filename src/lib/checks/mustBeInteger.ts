import { isInteger } from '../checks/isInteger';
import { mustSatisfy } from '../checks/mustSatisfy';

/**
 * @hidden
 */
function beAnInteger() {
    return "be an integer";
}

/**
 * @hidden
 */
export function mustBeInteger(name: string, value: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
    return value;
}
