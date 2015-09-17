var mustSatisfy = require('../checks/mustSatisfy');
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
module.exports = mustHaveOwnProperty;
