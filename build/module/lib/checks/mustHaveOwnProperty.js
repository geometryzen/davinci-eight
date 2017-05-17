import { isDefined } from '../checks/isDefined';
import { mustBeDefined } from '../checks/mustBeDefined';
import { mustSatisfy } from '../checks/mustSatisfy';
function haveOwnProperty(prop) {
    return function () {
        return "have own property `" + prop + "`";
    };
}
export function mustHaveOwnProperty(name, value, prop, contextBuilder) {
    mustBeDefined('name', name);
    mustBeDefined('prop', prop);
    if (isDefined(value)) {
        if (!value.hasOwnProperty(prop)) {
            mustSatisfy(name, false, haveOwnProperty(prop), contextBuilder);
        }
    }
    else {
        mustBeDefined(name, value, contextBuilder);
    }
}
