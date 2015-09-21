define(["require", "exports", '../checks/mustSatisfy', '../checks/isInteger'], function (require, exports, mustSatisfy, isInteger) {
    function beCanvasId() {
        return "be a `number` which is also an integer";
    }
    function mustBeCanvasId(name, value, contextBuilder) {
        mustSatisfy(name, isInteger(value), beCanvasId, contextBuilder);
        return value;
    }
    return mustBeCanvasId;
});
