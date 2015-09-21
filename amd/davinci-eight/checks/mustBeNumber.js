define(["require", "exports", '../checks/mustSatisfy', '../checks/isNumber'], function (require, exports, mustSatisfy, isNumber) {
    function beANumber() {
        return "be a `number`";
    }
    function mustBeInteger(name, value, contextBuilder) {
        mustSatisfy(name, isNumber(value), beANumber, contextBuilder);
        return value;
    }
    return mustBeInteger;
});
