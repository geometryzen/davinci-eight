define(["require", "exports", '../checks/mustSatisfy'], function (require, exports, mustSatisfy) {
    function makeBuilder(prop) {
        return function () {
            return "have own property " + prop;
        };
    }
    function mustHaveOwnProperty(name, value, prop, contextBuilder) {
        if (!value.hasOwnProperty(prop)) {
            mustSatisfy(name, false, makeBuilder(prop), contextBuilder);
        }
    }
    return mustHaveOwnProperty;
});
