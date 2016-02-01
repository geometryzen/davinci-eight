define(["require", "exports", '../checks/mustSatisfy', '../checks/isFunction'], function (require, exports, mustSatisfy_1, isFunction_1) {
    function beFunction() {
        return "be a function";
    }
    function mustBeFunction(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isFunction_1.default(value), beFunction, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeFunction;
});
