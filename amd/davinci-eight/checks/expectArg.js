define(["require", "exports"], function (require, exports) {
    function expectArg(name, value) {
        var arg = {
            toSatisfy: function (condition, message) {
                if (!condition) {
                    throw new Error(message);
                }
                return arg;
            },
            toBeBoolean: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'boolean') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be a boolean.";
                    throw new Error(message);
                }
                return arg;
            },
            toBeDefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue === 'undefined') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be defined.";
                    throw new Error(message);
                }
                return arg;
            },
            toBeInClosedInterval: function (lower, upper) {
                if (value >= lower && value <= upper) {
                    return arg;
                }
                else {
                    var message = "Expecting argument " + name + " => " + value + " to be in the range [" + lower + ", " + upper + "].";
                    throw new Error(message);
                }
            },
            toBeFunction: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'function') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be a function.";
                    throw new Error(message);
                }
                return arg;
            },
            toBeNumber: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'number') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be a number.";
                    throw new Error(message);
                }
                return arg;
            },
            toBeObject: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'object') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be an object.";
                    throw new Error(message);
                }
                return arg;
            },
            toBeString: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'string') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be a string.";
                    throw new Error(message);
                }
                return arg;
            },
            toBeUndefined: function () {
                var typeOfValue = typeof value;
                if (typeOfValue !== 'undefined') {
                    var message = "Expecting argument " + name + ": " + typeOfValue + " to be undefined.";
                    throw new Error(message);
                }
                return arg;
            },
            toNotBeNull: function () {
                if (value === null) {
                    var message = "Expecting argument " + name + " to not be null.";
                    throw new Error(message);
                }
                else {
                    return arg;
                }
            },
            get value() {
                return value;
            }
        };
        return arg;
    }
    return expectArg;
});
