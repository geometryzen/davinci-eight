define(["require", "exports", '../core'], function (require, exports, core_1) {
    var feedback = {
        warn: function (message) {
            if (core_1.default.strict) {
                throw new Error(message.message);
            }
            else {
                console.warn(message.message);
            }
        }
    };
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = feedback;
});
