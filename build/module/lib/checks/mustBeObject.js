import { isObject } from '../checks/isObject';
import { mustSatisfy } from '../checks/mustSatisfy';
/**
 * @hidden
 */
function beObject() {
    return "be an `object`";
}
/**
 * @hidden
 */
export function mustBeObject(name, value, contextBuilder) {
    mustSatisfy(name, isObject(value), beObject, contextBuilder);
    return value;
}
