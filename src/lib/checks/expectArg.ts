import { isUndefined } from "../checks/isUndefined";
import { mustBeNumber } from "../checks/mustBeNumber";

/**
 * @hidden
 */
function message(standard: string, override: () => string): string {
    return isUndefined(override) ? standard : override();
}

// FIXME: This plays havok with the TypeScript compiler stack and encourages temporary object creation.
/**
 * @hidden
 */
export function expectArg<T>(name: string, value: T) {
    const arg = {
        toSatisfy(condition: boolean, message: string) {
            if (isUndefined(condition)) {
                throw new Error("condition must be specified");
            }
            if (isUndefined(message)) {
                throw new Error("message must be specified");
            }
            if (!condition) {
                throw new Error(message);
            }
            return arg;
        },
        toBeBoolean(override?: () => string) {
            const typeOfValue: string = typeof value;
            if (typeOfValue !== "boolean") {
                throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a boolean.", override));
            }
            return arg;
        },
        toBeDefined() {
            const typeOfValue: string = typeof value;
            if (typeOfValue === "undefined") {
                const message = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
                throw new Error(message);
            }
            return arg;
        },
        toBeInClosedInterval(lower: number, upper: number) {
            const something: any = value;
            const x: number = something;
            mustBeNumber("x", x);
            if (x >= lower && x <= upper) {
                return arg;
            } else {
                const message = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
                throw new Error(message);
            }
        },
        toBeFunction() {
            const typeOfValue: string = typeof value;
            if (typeOfValue !== "function") {
                const message = "Expecting argument " + name + ": " + typeOfValue + " to be a function.";
                throw new Error(message);
            }
            return arg;
        },
        toBeNumber(override?: () => string) {
            const typeOfValue: string = typeof value;
            if (typeOfValue !== "number") {
                throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a number.", override));
            }
            return arg;
        },
        toBeObject(override?: () => string) {
            const typeOfValue: string = typeof value;
            if (typeOfValue !== "object") {
                throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be an object.", override));
            }
            return arg;
        },
        toBeString() {
            const typeOfValue: string = typeof value;
            if (typeOfValue !== "string") {
                const message = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
                throw new Error(message);
            }
            return arg;
        },
        toBeUndefined() {
            const typeOfValue: string = typeof value;
            if (typeOfValue !== "undefined") {
                const message = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
                throw new Error(message);
            }
            return arg;
        },
        toNotBeNull() {
            if (value === null) {
                const message = "Expecting argument " + name + " to not be null.";
                throw new Error(message);
            } else {
                return arg;
            }
        },
        get value(): T {
            return value;
        }
    };
    return arg;
}
