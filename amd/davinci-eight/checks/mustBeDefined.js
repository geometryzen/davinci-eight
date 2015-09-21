define(["require", "exports", '../checks/mustSatisfy', '../checks/isDefined'], function (require, exports, mustSatisfy, isDefined) {
    function beDefined() {
        return "not be be `undefined`";
    }
    function mustBeDefined(name, value, contextBuilder) {
        mustSatisfy(name, isDefined(value), beDefined, contextBuilder);
        return value;
    }
    return mustBeDefined;
});
