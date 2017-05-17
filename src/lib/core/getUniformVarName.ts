import { isDefined } from '../checks/isDefined';
import { expectArg } from '../checks/expectArg';

/**
 * Policy for how a uniform variable name is determined.
 */
export function getUniformVarName(uniform: { name?: string }, varName: string) {
    expectArg('uniform', uniform).toBeObject();
    expectArg('varName', varName).toBeString();
    return isDefined(uniform.name) ? expectArg('uniform.name', uniform.name).toBeString().value : varName;
}
