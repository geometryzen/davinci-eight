import { expectArg } from '../checks/expectArg';
import { isDefined } from '../checks/isDefined';
/**
 * Policy for how a uniform variable name is determined.
 * @hidden
 */
export function getUniformVarName(uniform, varName) {
    expectArg('uniform', uniform).toBeObject();
    expectArg('varName', varName).toBeString();
    return isDefined(uniform.name) ? expectArg('uniform.name', uniform.name).toBeString().value : varName;
}
