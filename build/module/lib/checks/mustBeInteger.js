import { mustSatisfy } from '../checks/mustSatisfy';
import { isInteger } from '../checks/isInteger';
function beAnInteger() {
    return "be an integer";
}
export function mustBeInteger(name, value, contextBuilder) {
    mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
    return value;
}
