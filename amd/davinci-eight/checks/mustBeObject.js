define(["require", "exports", '../checks/mustSatisfy', '../checks/isObject'], function (require, exports, mustSatisfy, isObject) {
    function beObject() {
        return "be an `object`";
    }
    function mustBeObject(name, value, contextBuilder) {
        mustSatisfy(name, isObject(value), beObject, contextBuilder);
        return value;
    }
    return mustBeObject;
});
