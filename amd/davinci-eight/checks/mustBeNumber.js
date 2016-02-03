define(["require", "exports", '../core', '../checks/mustSatisfy', '../checks/isNumber'], function (require, exports, core_1, mustSatisfy_1, isNumber_1) {
    function beANumber() {
        return "be a `number`";
    }
    function default_1(name, value, contextBuilder) {
        if (core_1.default.fastPath) {
            if (core_1.default.strict) {
                throw new Error("mustBeNumber must not be called on the fast path.");
            }
            else {
                console.warn("mustBeNumber should not be called on the fast path.");
            }
        }
        mustSatisfy_1.default(name, isNumber_1.default(value), beANumber, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});
