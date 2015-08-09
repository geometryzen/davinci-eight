import UniformMetaInfo = require('../core/UniformMetaInfo');
import isDefined = require('../checks/isDefined');
import expectArg = require('../checks/expectArg');

/**
 * Policy for how an uniform variable name is determined.
 */
function getUniformVarName(uniform: UniformMetaInfo, varName: string) {
  return isDefined(uniform.name) ? expectArg('uniform.name', uniform.name).toBeString().value : varName;
}

export = getUniformVarName;
