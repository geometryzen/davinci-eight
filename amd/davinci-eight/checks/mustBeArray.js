define(["require", "exports", '../checks/mustSatisfy', '../checks/isArray'], function (require, exports, mustSatisfy_1, isArray_1) {
    function beAnArray() {
        return "be an array";
    }
    function mustBeArray(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isArray_1.default(value), beAnArray, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeArray;
});
