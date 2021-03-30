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
export function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
    return value;
}
