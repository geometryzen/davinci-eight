define(["require", "exports", '../checks/mustSatisfy', '../checks/isBoolean'], function (require, exports, mustSatisfy_1, isBoolean_1) {
    function beBoolean() {
        return "be `boolean`";
    }
    function mustBeBoolean(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isBoolean_1.default(value), beBoolean, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeBoolean;
});
