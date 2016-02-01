define(["require", "exports", '../checks/mustSatisfy', '../checks/isObject'], function (require, exports, mustSatisfy_1, isObject_1) {
    function beObject() {
        return "be an `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isObject_1.default(value), beObject, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeObject;
});
