import { mustSatisfy } from '../checks/mustSatisfy';
import { isObject } from '../checks/isObject';

function beObject() {
    return "be an `object`";
}

export function mustBeObject<T>(name: string, value: T, contextBuilder?: () => string): T {
    mustSatisfy(name, isObject(value), beObject, contextBuilder);
    return value;
}
