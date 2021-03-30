import { isUndefined } from '../checks/isUndefined';
import { mustSatisfy } from '../checks/mustSatisfy';
/**
 * @hidden
 */
function beUndefined() {
    return "be 'undefined'";
}
/**
 * @hidden
 */
export function mustBeUndefined(name, value, contextBuilder) {
    mustSatisfy(name, isUndefined(value), beUndefined, contextBuilder);
    return value;
}
