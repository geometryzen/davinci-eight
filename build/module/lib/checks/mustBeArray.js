import { mustSatisfy } from '../checks/mustSatisfy';
import { isArray } from '../checks/isArray';
function beAnArray() {
    return "be an array";
}
export function mustBeArray(name, value, contextBuilder) {
    mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
    return value;
}
