"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * throws name + " must " + message + [" in " + context] + "."
 */
function mustSatisfy(name, condition, messageBuilder, contextBuilder) {
    if (!condition) {
        var message = messageBuilder ? messageBuilder() : "satisfy some condition";
        var context = contextBuilder ? " in " + contextBuilder() : "";
        throw new Error(name + " must " + message + context + ".");
    }
}
exports.mustSatisfy = mustSatisfy;
