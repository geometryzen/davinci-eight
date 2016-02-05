define(["require", "exports", '../checks/isDefined', '../checks/mustBeObject', '../checks/mustBeString'], function (require, exports, isDefined_1, mustBeObject_1, mustBeString_1) {
    function getAttribVarName(attribute, varName) {
        mustBeObject_1.default('attribute', attribute);
        mustBeString_1.default('varName', varName);
        return isDefined_1.default(attribute.name) ? mustBeString_1.default('attribute.name', attribute.name) : varName;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = getAttribVarName;
});
