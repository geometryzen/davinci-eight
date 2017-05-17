import { mustSatisfy } from '../checks/mustSatisfy';
import { isArray } from '../checks/isArray';

function beAnArray() {
    return "be an array";
}

export function mustBeArray<T>(name: string, value: T[], contextBuilder?: () => string): T[] {
    mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
    return value;
}
