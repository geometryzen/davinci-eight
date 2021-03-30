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
export function mustBeArray(name, value, contextBuilder) {
    mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
    return value;
}
