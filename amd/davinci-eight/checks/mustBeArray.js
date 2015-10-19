define(["require", "exports", '../checks/mustSatisfy', '../checks/isArray'], function (require, exports, mustSatisfy, isArray) {
    function beAnArray() {
        return "be an array";
    }
    function mustBeArray(name, value, contextBuilder) {
        mustSatisfy(name, isArray(value), beAnArray, contextBuilder);
        return value;
    }
    return mustBeArray;
});
