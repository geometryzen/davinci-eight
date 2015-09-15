define(["require", "exports", '../checks/isNumber'], function (require, exports, isNumber) {
    function isInteger(x) {
        // % coerces its operand to numbers so a type-check first is required.
        // Not ethat ECMAScript 6 provides Number.isInteger().
        return isNumber(x) && x % 1 === 0;
    }
    return isInteger;
});
