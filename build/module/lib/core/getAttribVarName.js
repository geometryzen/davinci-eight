import { isDefined } from '../checks/isDefined';
import { mustBeObject } from '../checks/mustBeObject';
import { mustBeString } from '../checks/mustBeString';
/**
 * Policy for how an attribute variable name is determined.
 */
export function getAttribVarName(attribute, varName) {
    mustBeObject('attribute', attribute);
    mustBeString('varName', varName);
    return isDefined(attribute.name) ? mustBeString('attribute.name', attribute.name) : varName;
}
