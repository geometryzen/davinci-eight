import { isObject } from "../checks/isObject";
import { mustSatisfy } from "../checks/mustSatisfy";

/**
 * @hidden
 */
function beObject() {
    return "be an `object`";
}

/**
 * @hidden
 */
export function mustBeObject<T>(name: string, value: T, contextBuilder?: () => string): T {
    mustSatisfy(name, isObject(value), beObject, contextBuilder);
    return value;
}
