define(["require", "exports", '../checks/mustSatisfy', '../checks/isDefined'], function (require, exports, mustSatisfy_1, isDefined_1) {
    function beDefined() {
        return "not be 'undefined'";
    }
    function mustBeDefined(name, value, contextBuilder) {
        mustSatisfy_1.default(name, isDefined_1.default(value), beDefined, contextBuilder);
        return value;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = mustBeDefined;
});
