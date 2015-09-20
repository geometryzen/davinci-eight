define(["require", "exports", '../checks/mustSatisfy', '../checks/isBoolean'], function (require, exports, mustSatisfy, isBoolean) {
    function beBoolean() {
        return "be boolean";
    }
    function mustBeBoolean(name, value, contextBuilder) {
        mustSatisfy(name, isBoolean(value), beBoolean, contextBuilder);
        return value;
    }
    return mustBeBoolean;
});
