import { mustSatisfy } from '../checks/mustSatisfy';
import { isNumber } from '../checks/isNumber';

function beANumber() {
    return "be a `number`";
}

export function mustBeNumber(name: string, value: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
    return value;
}
