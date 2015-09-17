define(["require", "exports"], function (require, exports) {
    function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
        if (!condition) {
            if (messageBuilder) {
                var message = messageBuilder();
                if (contextBuilder) {
                    var context = contextBuilder();
                    throw new Error(name + " must " + message + " in " + context + ".");
                }
                else {
                    throw new Error(name + " must " + message + ".");
                }
            }
            else {
                var message = "satisfy some condition";
                if (contextBuilder) {
                    var context = contextBuilder();
                    throw new Error(name + " must " + message + " in " + context + ".");
                }
                else {
                    throw new Error(name + " must " + message + ".");
                }
            }
        }
    }
    return mustSatisfy;
});
