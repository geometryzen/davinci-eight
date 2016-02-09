import mustSatisfy from '../checks/mustSatisfy';
import isLE from '../checks/isLE';

export default function(name: string, value: number, limit: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isLE(value, limit), () => { return `be less than or equal to ${limit}` }, contextBuilder);
    return value;
}
