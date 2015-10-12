define(["require", "exports", '../core'], function (require, exports, core) {
    var feedback = {
        warn: function (message) {
            if (core.strict) {
                throw new Error(message.message);
            }
            else {
                console.warn(message.message);
            }
        }
    };
    return feedback;
});
