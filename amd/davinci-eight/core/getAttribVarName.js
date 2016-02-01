define(["require", "exports", '../checks/isDefined', '../checks/expectArg'], function (require, exports, isDefined_1, expectArg_1) {
    function getAttribVarName(attribute, varName) {
        expectArg_1.default('attribute', attribute).toBeObject();
        expectArg_1.default('varName', varName).toBeString();
        return isDefined_1.default(attribute.name) ? expectArg_1.default('attribute.name', attribute.name).toBeString().value : varName;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getAttribVarName;
});
