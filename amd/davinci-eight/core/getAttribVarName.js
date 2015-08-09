define(["require", "exports", '../checks/isDefined'], function (require, exports, isDefined) {
    /**
     * Policy for how an attribute variable name is determined.
     */
    function getAttribVarName(attribute, varName) {
        return isDefined(attribute.name) ? attribute.name : varName;
    }
    return getAttribVarName;
});
