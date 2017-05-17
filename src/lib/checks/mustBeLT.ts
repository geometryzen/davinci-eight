import { mustSatisfy } from '../checks/mustSatisfy';
import { isLT } from '../checks/isLT';

export function mustBeLT(name: string, value: number, limit: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isLT(value, limit), () => { return `be less than ${limit}`; }, contextBuilder);
    return value;
}
