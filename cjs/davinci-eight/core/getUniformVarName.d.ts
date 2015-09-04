import UniformMetaInfo = require('../core/UniformMetaInfo');
/**
 * Policy for how a uniform variable name is determined.
 */
declare function getUniformVarName(uniform: UniformMetaInfo, varName: string): string;
export = getUniformVarName;
