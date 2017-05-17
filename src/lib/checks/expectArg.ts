import { isUndefined } from '../checks/isUndefined';
import { mustBeNumber } from '../checks/mustBeNumber';

function message(standard: string, override: () => string): string {
  return isUndefined(override) ? standard : override();
}
// FIXME: This plays havok with the TypeScript compiler stack and encourages temporary object creation.
export function expectArg<T>(name: string, value: T) {
  let arg = {
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
      let typeOfValue: string = typeof value;
      if (typeOfValue !== 'boolean') {
        throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a boolean.", override));
      }
      return arg;
    },
    toBeDefined() {
      let typeOfValue: string = typeof value;
      if (typeOfValue === 'undefined') {
        let message = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
        throw new Error(message);
      }
      return arg;
    },
    toBeInClosedInterval(lower: number, upper: number) {
      let something: any = value;
      let x: number = something;
      mustBeNumber('x', x);
      if (x >= lower && x <= upper) {
        return arg;
      }
      else {
        let message = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
        throw new Error(message);
      }
    },
    toBeFunction() {
      let typeOfValue: string = typeof value;
      if (typeOfValue !== 'function') {
        let message = "Expecting argument " + name + ": " + typeOfValue + " to be a function.";
        throw new Error(message);
      }
      return arg;
    },
    toBeNumber(override?: () => string) {
      let typeOfValue: string = typeof value;
      if (typeOfValue !== 'number') {
        throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be a number.", override));
      }
      return arg;
    },
    toBeObject(override?: () => string) {
      let typeOfValue: string = typeof value;
      if (typeOfValue !== 'object') {
        throw new Error(message("Expecting argument " + name + ": " + typeOfValue + " to be an object.", override));
      }
      return arg;
    },
    toBeString() {
      let typeOfValue: string = typeof value;
      if (typeOfValue !== 'string') {
        let message = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
        throw new Error(message);
      }
      return arg;
    },
    toBeUndefined() {
      let typeOfValue: string = typeof value;
      if (typeOfValue !== 'undefined') {
        let message = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
        throw new Error(message);
      }
      return arg;
    },
    toNotBeNull() {
      if (value === null) {
        let message = "Expecting argument " + name + " to not be null.";
        throw new Error(message);
      }
      else {
        return arg;
      }
    },
    get value(): T {
      return value;
    }
  };
  return arg;
}
