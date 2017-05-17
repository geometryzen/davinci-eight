import { isNumber } from '../checks/isNumber';
export function isInteger(x) {
    // % coerces its operand to numbers so a typeof test is required.
    // Note that ECMAScript 6 provides Number.isInteger().
    return isNumber(x) && x % 1 === 0;
}
