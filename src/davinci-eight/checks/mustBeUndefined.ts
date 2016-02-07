import mustSatisfy from '../checks/mustSatisfy';
import isUndefined from '../checks/isUndefined';

function beUndefined() {
    return "be 'undefined'"
}

export default function(name: string, value: any, contextBuilder?: () => string): any {
    mustSatisfy(name, isUndefined(value), beUndefined, contextBuilder);
    return value;
}
