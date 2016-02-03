define(["require", "exports", '../core', '../checks/mustSatisfy', '../checks/isArray'], function (require, exports, core_1, mustSatisfy_1, isArray_1) {
    function beAnArray() {
        return "be an array";
    }
    function default_1(name, value, contextBuilder) {
        if (core_1.default.fastPath) {
            if (core_1.default.strict) {
                throw new Error("mustBeArray must not be called on the fast path.");
            }
            else {
                console.warn("mustBeArray should not be called on the fast path.");
            }
        }
        mustSatisfy_1.default(name, isArray_1.default(value), beAnArray, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});
