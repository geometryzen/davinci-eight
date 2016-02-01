define(["require", "exports", '../checks/isDefined', '../checks/expectArg'], function (require, exports, isDefined_1, expectArg_1) {
    function getUniformVarName(uniform, varName) {
        expectArg_1.default('uniform', uniform).toBeObject();
        expectArg_1.default('varName', varName).toBeString();
        return isDefined_1.default(uniform.name) ? expectArg_1.default('uniform.name', uniform.name).toBeString().value : varName;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getUniformVarName;
});
