import mustSatisfy from '../checks/mustSatisfy';
import isString from '../checks/isString';

function beAString() {
    return "be a string"
}

export default function mustBeString(name: string, value: string, contextBuilder?: () => string): string {
    mustSatisfy(name, isString(value), beAString, contextBuilder);
    return value;
}
