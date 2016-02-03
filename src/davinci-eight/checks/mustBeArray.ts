import core from '../core';
import mustSatisfy from '../checks/mustSatisfy';
import isArray from '../checks/isArray';

function beAnArray() {
    return "be an array"
}

export default function <T>(name: string, value: T[], contextBuilder?: () => string): T[] {
    if (core.fastPath) {
        if (core.strict) {
            throw new Error("mustBeArray must not be called on the fast path.");
        }
        else {
            console.warn("mustBeArray should not be called on the fast path.");
        }
    }
    mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
    return value;
}
