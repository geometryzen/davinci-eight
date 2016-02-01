define(["require", "exports", '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, mustSatisfy_1, isInteger_1) {
    function beAnInteger() {
        return "be an integer";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isInteger_1.default(value), beAnInteger, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeInteger;
});
