define(["require", "exports", '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, mustSatisfy, isInteger) {
    function beAnInteger() {
        return "be an integer";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy(name, isInteger(value), beAnInteger, contextBuilder);
        return value;
    }
    return mustBeInteger;
});
