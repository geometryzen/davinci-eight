define(["require", "exports"], function (require, exports) {
    function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
        if (!condition) {
            var message = messageBuilder();
            var context = contextBuilder();
            throw new Error(name + " must " + message + " in " + context + ".");
        }
    }
    return mustSatisfy;
});
