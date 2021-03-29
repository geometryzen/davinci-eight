import { isUndefined } from '../checks/isUndefined';
import { mustSatisfy } from '../checks/mustSatisfy';

/**
 * @hidden
 */
function beUndefined() {
    return "be 'undefined'";
}

/**
 * @hidden
 */
export function mustBeUndefined(name: string, value: any, contextBuilder?: () => string): any {
    mustSatisfy(name, isUndefined(value), beUndefined, contextBuilder);
    return value;
}
