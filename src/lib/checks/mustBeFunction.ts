import { isFunction } from '../checks/isFunction';
import { mustSatisfy } from '../checks/mustSatisfy';

/**
 * @hidden
 */
function beFunction() {
    return "be a function";
}

/**
 * @hidden
 */
export function mustBeFunction(name: string, value: any, contextBuilder?: () => string): any {
    mustSatisfy(name, isFunction(value), beFunction, contextBuilder);
    return value;
}
