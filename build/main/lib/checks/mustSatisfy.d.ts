/**
 * throws name + " must " + message + [" in " + context] + "."
 */
export declare function mustSatisfy(name: string, condition: boolean, messageBuilder: () => string, contextBuilder?: () => string): void;
