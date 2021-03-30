import { isBoolean } from '../checks/isBoolean';
import { mustSatisfy } from '../checks/mustSatisfy';
/**
 * @hidden
 */
function beBoolean() {
    return "be `boolean`";
}
/**
 * @hidden
 */
export function mustBeBoolean(name, value, contextBuilder) {
    mustSatisfy(name, isBoolean(value), beBoolean, contextBuilder);
    return value;
}
