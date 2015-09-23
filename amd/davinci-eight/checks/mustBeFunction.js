define(["require", "exports", '../checks/mustSatisfy', '../checks/isFunction'], function (require, exports, mustSatisfy, isFunction) {
    function beFunction() {
        return "be a function";
    }
    function mustBeFunction(name, value, contextBuilder) {
        mustSatisfy(name, isFunction(value), beFunction, contextBuilder);
        return value;
    }
    return mustBeFunction;
});
