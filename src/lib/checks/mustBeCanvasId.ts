import { isInteger } from "../checks/isInteger";
import { mustSatisfy } from "../checks/mustSatisfy";

/**
 * @hidden
 */
function beCanvasId() {
    return "be a `number` which is also an integer";
}

/**
 * @hidden
 */
export function mustBeCanvasId(name: string, value: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isInteger(value), beCanvasId, contextBuilder);
    return value;
}
