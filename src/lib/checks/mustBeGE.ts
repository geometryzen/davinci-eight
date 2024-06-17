import { isGE } from "../checks/isGE";
import { mustSatisfy } from "../checks/mustSatisfy";

/**
 * @hidden
 */
export function mustBeGE(name: string, value: number, limit: number, contextBuilder?: () => string): number {
    mustSatisfy(
        name,
        isGE(value, limit),
        () => {
            return `be greater than or equal to ${limit}`;
        },
        contextBuilder
    );
    return value;
}
