define(["require", "exports", '../checks/mustSatisfy', '../checks/isDefined'], function (require, exports, mustSatisfy, isDefined) {
    function beDefined() {
        return "be defined";
    }
    function mustBeDefined(name, value, contextBuilder) {
        mustSatisfy(name, isDefined(value), beDefined, contextBuilder);
        return value;
    }
    return mustBeDefined;
});
