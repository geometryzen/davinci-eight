import { mustSatisfy } from './mustSatisfy';
import { isEQ } from './isEQ';
export function mustBeEQ(name, value, limit, contextBuilder) {
    mustSatisfy(name, isEQ(value, limit), function () { return "be equal to " + limit; }, contextBuilder);
    return value;
}
