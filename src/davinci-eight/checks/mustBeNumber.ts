import core from '../core';
import mustSatisfy from '../checks/mustSatisfy';
import isNumber from '../checks/isNumber';

function beANumber() {
    return "be a `number`";
}

export default function(name: string, value: number, contextBuilder?: () => string): number {
    if (core.fastPath) {
        if (core.strict) {
            throw new Error("mustBeNumber must not be called on the fast path.");
        }
        else {
            console.warn("mustBeNumber should not be called on the fast path.");
        }
    }
    mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
    return value;
}
