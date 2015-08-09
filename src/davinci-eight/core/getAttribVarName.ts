import AttribMetaInfo = require('../core/AttribMetaInfo');
import isDefined = require('../checks/isDefined');

/**
 * Policy for how an attribute variable name is determined.
 */
function getAttribVarName(attribute: AttribMetaInfo, varName: string) {
  return isDefined(attribute.name) ? attribute.name : varName;
}

export = getAttribVarName;
