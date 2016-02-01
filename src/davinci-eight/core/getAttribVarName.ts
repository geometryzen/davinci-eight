import isDefined from '../checks/isDefined';
import expectArg from '../checks/expectArg';

/**
 * Policy for how an attribute variable name is determined.
 */
export default function getAttribVarName(attribute: { name?: string }, varName: string) {
    expectArg('attribute', attribute).toBeObject();
    expectArg('varName', varName).toBeString();
    return isDefined(attribute.name) ? expectArg('attribute.name', attribute.name).toBeString().value : varName;
}
