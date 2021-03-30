import { isNumber } from '../checks/isNumber';
/**
 * @hidden
 */
export function isInteger(x) {
    // % coerces its operand to numbers so a type guard is required.
    // Note that ECMAScript 6 provides Number.isInteger().
    return isNumber(x) && x % 1 === 0;
}
