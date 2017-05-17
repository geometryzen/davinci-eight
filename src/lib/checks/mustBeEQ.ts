import { mustSatisfy } from './mustSatisfy';
import { isEQ } from './isEQ';

export function mustBeEQ(name: string, value: number, limit: number, contextBuilder?: () => string): number {
    mustSatisfy(name, isEQ(value, limit), () => { return `be equal to ${limit}`; }, contextBuilder);
    return value;
}
