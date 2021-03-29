import { isBoolean } from '../checks/isBoolean';
import { mustSatisfy } from '../checks/mustSatisfy';

/**
 * @hidden
 */
function beBoolean(): string {
    return "be `boolean`";
}

/**
 * @hidden
 */
export function mustBeBoolean(name: string, value: boolean, contextBuilder?: () => string): boolean {
    mustSatisfy(name, isBoolean(value), beBoolean, contextBuilder);
    return value;
}
