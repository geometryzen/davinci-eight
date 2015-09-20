import isDefined = require('../checks/isDefined');
import expectArg = require('../checks/expectArg');

/**
 * Policy for how a uniform variable name is determined.
 */
function getUniformVarName(uniform: {name?: string}, varName: string) {
  expectArg('uniform', uniform).toBeObject();
  expectArg('varName', varName).toBeString();
  return isDefined(uniform.name) ? expectArg('uniform.name', uniform.name).toBeString().value : varName;
}

export = getUniformVarName;
