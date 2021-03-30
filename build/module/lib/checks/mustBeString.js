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
export function mustBeString(name, value, contextBuilder) {
    mustSatisfy(name, isString(value), beAString, contextBuilder);
    return value;
}
