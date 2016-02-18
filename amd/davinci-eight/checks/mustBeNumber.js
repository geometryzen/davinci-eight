define(["require", "exports", '../checks/mustSatisfy', '../checks/isNumber'], function (require, exports, mustSatisfy_1, isNumber_1) {
    function beANumber() {
        return "be a `number`";
    }
    function default_1(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isNumber_1.default(value), beANumber, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = default_1;
});
