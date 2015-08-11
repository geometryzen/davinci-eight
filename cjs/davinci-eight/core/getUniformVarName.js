var isDefined = require('../checks/isDefined');
var expectArg = require('../checks/expectArg');
/**
 * Policy for how an uniform variable name is determined.
 */
function getUniformVarName(uniform, varName) {
    expectArg('uniform', uniform).toBeObject();
    expectArg('varName', varName).toBeString();
    return isDefined(uniform.name) ? expectArg('uniform.name', uniform.name).toBeString().value : varName;
}
module.exports = getUniformVarName;
