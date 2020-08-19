import { isNumber } from '../checks/isNumber';

export function isInteger(x: any): x is number {
    // % coerces its operand to numbers so a type guard is required.
    // Note that ECMAScript 6 provides Number.isInteger().
    return isNumber(x) && x % 1 === 0;
}
