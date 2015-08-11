define(["require", "exports", '../checks/isDefined', '../checks/expectArg'], function (require, exports, isDefined, expectArg) {
    /**
     * Policy for how an attribute variable name is determined.
     */
    function getAttribVarName(attribute, varName) {
        expectArg('attribute', attribute).toBeObject();
        expectArg('varName', varName).toBeString();
        return isDefined(attribute.name) ? expectArg('attribute.name', attribute.name).toBeString().value : varName;
    }
    return getAttribVarName;
});
