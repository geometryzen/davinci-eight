import { mustSatisfy } from '../checks/mustSatisfy';
import { isObject } from '../checks/isObject';
function beObject() {
    return "be an `object`";
}
export function mustBeObject(name, value, contextBuilder) {
    mustSatisfy(name, isObject(value), beObject, contextBuilder);
    return value;
}
