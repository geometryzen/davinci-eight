var isDefined = require('../checks/isDefined');
/**
 * Policy for how an attribute variable name is determined.
 */
function getAttribVarName(attribute, varName) {
    return isDefined(attribute.name) ? attribute.name : varName;
}
module.exports = getAttribVarName;
