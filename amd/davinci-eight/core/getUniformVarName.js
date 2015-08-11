define(["require", "exports", '../checks/isDefined', '../checks/expectArg'], function (require, exports, isDefined, expectArg) {
    /**
     * Policy for how an uniform variable name is determined.
     */
    function getUniformVarName(uniform, varName) {
        expectArg('uniform', uniform).toBeObject();
        expectArg('varName', varName).toBeString();
        return isDefined(uniform.name) ? expectArg('uniform.name', uniform.name).toBeString().value : varName;
    }
    return getUniformVarName;
});
