import mustSatisfy from '../checks/mustSatisfy';
import isDefined from '../checks/isDefined';

function beDefined() {
    return "not be be `undefined`"
}

export default function mustBeDefined(name: string, value: any, contextBuilder?: () => string): any {
    mustSatisfy(name, isDefined(value), beDefined, contextBuilder);
    return value;
}
