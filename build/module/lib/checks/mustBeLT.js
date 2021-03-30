import { isLT } from '../checks/isLT';
import { mustSatisfy } from '../checks/mustSatisfy';
/**
 * @hidden
 */
export function mustBeLT(name, value, limit, contextBuilder) {
    mustSatisfy(name, isLT(value, limit), function () { return "be less than " + limit; }, contextBuilder);
    return value;
}
