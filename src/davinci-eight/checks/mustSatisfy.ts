export default function mustSatisfy(name: string, condition: boolean, messageBuilder: () => string, contextBuilder?: () => string) {
    if (!condition) {
        let message = messageBuilder ? messageBuilder() : "satisfy some condition";
        let context = contextBuilder ? " in " + contextBuilder() : "";
        throw new Error(name + " must " + message + context + ".");
    }
}
