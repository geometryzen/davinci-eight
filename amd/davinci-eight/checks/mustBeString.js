define(["require", "exports", '../checks/mustSatisfy', '../checks/isString'], function (require, exports, mustSatisfy, isString) {
    function beAString() {
        return "be a string";
    }
    function mustBeString(name, value, contextBuilder) {
        mustSatisfy(name, isString(value), beAString, contextBuilder);
        return value;
    }
    return mustBeString;
});
