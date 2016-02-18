define(["require", "exports", '../checks/mustSatisfy', '../checks/isString'], function (require, exports, mustSatisfy_1, isString_1) {
    function beAString() {
        return "be a string";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isString_1.default(value), beAString, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});
