import { isNumber } from "../checks/isNumber";
import { mustSatisfy } from "../checks/mustSatisfy";

/**
 * @hidden
 */
function beANumber() {
    return "be a `number`";
}

/**
 * @hidden
 */
export function mustBeNumber(name: string, value: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
    return value;
}
