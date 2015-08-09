import AttribMetaInfo = require('../core/AttribMetaInfo');
/**
 * Policy for how an attribute variable name is determined.
 */
declare function getAttribVarName(attribute: AttribMetaInfo, varName: string): string;
export = getAttribVarName;
