import { mustSatisfy } from '../checks/mustSatisfy';
import { isDefined } from '../checks/isDefined';
function beDefined() {
    return "not be 'undefined'";
}
export function mustBeDefined(name, value, contextBuilder) {
    mustSatisfy(name, isDefined(value), beDefined, contextBuilder);
    return value;
}
