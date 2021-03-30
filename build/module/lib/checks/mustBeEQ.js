import { isEQ } from './isEQ';
import { mustSatisfy } from './mustSatisfy';
/**
 * @hidden
 */
export function mustBeEQ(name, value, limit, contextBuilder) {
    mustSatisfy(name, isEQ(value, limit), function () { return "be equal to " + limit; }, contextBuilder);
    return value;
}
