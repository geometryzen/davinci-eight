define(["require", "exports", '../checks/isNumber'], function (require, exports, isNumber_1) {
    function isInteger(x) {
        return isNumber_1.default(x) && x % 1 === 0;
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = isInteger;
});
