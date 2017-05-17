/**
 * throws name + " must " + message + [" in " + context] + "."
 */
export function mustSatisfy(name: string, condition: boolean, messageBuilder: () => string, contextBuilder?: () => string) {
    if (!condition) {
        const message = messageBuilder ? messageBuilder() : "satisfy some condition";
        const context = contextBuilder ? " in " + contextBuilder() : "";
        throw new Error(name + " must " + message + context + ".");
    }
}
