import core from '../core';
import mustSatisfy from '../checks/mustSatisfy';
import isString from '../checks/isString';

function beAString() {
    return "be a string"
}

export default function(name: string, value: string, contextBuilder?: () => string): string {
    if (core.fastPath) {
        if (core.strict) {
            throw new Error("mustBeString must not be called on the fast path.");
        }
        else {
            console.warn("mustBeString should not be called on the fast path.");
        }
    }
    mustSatisfy(name, isString(value), beAString, contextBuilder);
    return value;
}
