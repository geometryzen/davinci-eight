define(["require", "exports", '../checks/isDefined', '../checks/mustBeDefined', '../checks/mustSatisfy'], function (require, exports, isDefined, mustBeDefined, mustSatisfy) {
    function haveOwnProperty(prop) {
        return function () {
            return "have own property `" + prop + "`";
        };
    }
    function mustHaveOwnProperty(name, value, prop, contextBuilder) {
        mustBeDefined('name', name);
        mustBeDefined('prop', prop);
        if (isDefined(value)) {
            if (!value.hasOwnProperty(prop)) {
                mustSatisfy(name, false, haveOwnProperty(prop), contextBuilder);
            }
        }
        else {
            mustBeDefined(name, value, contextBuilder);
        }
    }
    return mustHaveOwnProperty;
});
