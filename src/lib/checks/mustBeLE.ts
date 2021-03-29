import { isLE } from '../checks/isLE';
import { mustSatisfy } from '../checks/mustSatisfy';

/**
 * @hidden
 */
export function mustBeLE(name: string, value: number, limit: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isLE(value, limit), () => { return `be less than or equal to ${limit}`; }, contextBuilder);
    return value;
}
