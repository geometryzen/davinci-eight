import { isNumber } from '../checks/isNumber';
import { mustSatisfy } from '../checks/mustSatisfy';
/**
 * @hidden
 */
function beANumber() {
    return "be a `number`";
}
/**
 * @hidden
 */
export function mustBeNumber(name, value, contextBuilder) {
    mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
    return value;
}
