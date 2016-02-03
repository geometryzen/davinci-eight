define(["require", "exports", '../core', '../checks/mustSatisfy', '../checks/isString'], function (require, exports, core_1, mustSatisfy_1, isString_1) {
    function beAString() {
        return "be a string";
    }
    function default_1(name, value, contextBuilder) {
        if (core_1.default.fastPath) {
            if (core_1.default.strict) {
                throw new Error("mustBeString must not be called on the fast path.");
            }
            else {
                console.warn("mustBeString should not be called on the fast path.");
            }
        }
        mustSatisfy_1.default(name, isString_1.default(value), beAString, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});
