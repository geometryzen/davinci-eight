import isUndefined = require('../checks/isUndefined');

function expectArg<T>(name: string, value: T) {
  var arg = {
    toSatisfy(condition: boolean, message: string) {
      if (!condition) {
        throw new Error(message);
      }
      return arg;
    },
    toBeBoolean() {
      let typeOfValue: string = typeof value;
      if (typeOfValue !== 'boolean') {
        let message = "Expecting argument " + name + ": " + typeOfValue + " to be a boolean.";
        throw new Error(message);
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
    toBeInClosedInterval(lower, upper) {
      if (value >= lower && value <= upper) {
        return arg;
      }
      else {
        let message = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
        throw new Error(message);
      }
    },
    toBeNumber() {
      let typeOfValue: string = typeof value;
      if (typeOfValue !== 'number') {
        let message = "Expecting argument " + name + ": " + typeOfValue + " to be a number.";
        throw new Error(message);
      }
      return arg;
    },
    toBeObject() {
      let typeOfValue: string = typeof value;
      if (typeOfValue !== 'object') {
        let message = "Expecting argument " + name + ": " + typeOfValue + " to be an object.";
        throw new Error(message);
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

export = expectArg;