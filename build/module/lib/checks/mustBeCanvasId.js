import { mustSatisfy } from '../checks/mustSatisfy';
import { isInteger } from '../checks/isInteger';
function beCanvasId() {
    return "be a `number` which is also an integer";
}
export function mustBeCanvasId(name, value, contextBuilder) {
    mustSatisfy(name, isInteger(value), beCanvasId, contextBuilder);
    return value;
}
