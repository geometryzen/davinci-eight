import { mustSatisfy } from '../checks/mustSatisfy';
import { isInteger } from '../checks/isInteger';

function beAnInteger() {
    return "be an integer";
}

export function mustBeInteger(name: string, value: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
    return value;
}
