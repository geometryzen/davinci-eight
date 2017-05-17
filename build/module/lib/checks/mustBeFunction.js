import { mustSatisfy } from '../checks/mustSatisfy';
import { isFunction } from '../checks/isFunction';
function beFunction() {
    return "be a function";
}
export function mustBeFunction(name, value, contextBuilder) {
    mustSatisfy(name, isFunction(value), beFunction, contextBuilder);
    return value;
}
