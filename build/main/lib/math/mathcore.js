"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Determines whether a property name is callable on an object.
 */
function isCallableMethod(x, name) {
    return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
}
/**
 * Constructs a function that can apply the operator to objects that implement the operator as a method.
 * Falls back to the primitive function when the argument is a number.
 */
function makeUnaryUniversalFunction(methodName, primitiveFunction) {
    return function (x) {
        if (isCallableMethod(x, methodName)) {
            return x[methodName]();
        }
        else if (typeof x === 'number') {
            return primitiveFunction(x);
        }
        else {
            throw new TypeError("x must support " + methodName + "(x)");
        }
    };
}
function coshNumber(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
}
function sinhNumber(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
}
function tanhNumber(x) {
    return sinhNumber(x) / coshNumber(x);
}
exports.acos = makeUnaryUniversalFunction('acos', Math.acos);
exports.asin = makeUnaryUniversalFunction('asin', Math.asin);
exports.atan = makeUnaryUniversalFunction('atan', Math.atan);
exports.cos = makeUnaryUniversalFunction('cos', Math.cos);
exports.cosh = makeUnaryUniversalFunction('cosh', coshNumber);
exports.exp = makeUnaryUniversalFunction('exp', Math.exp);
exports.log = makeUnaryUniversalFunction('log', Math.log);
exports.norm = makeUnaryUniversalFunction('norm', Math.abs);
exports.quad = makeUnaryUniversalFunction('quad', function (x) { return x * x; });
exports.sin = makeUnaryUniversalFunction('sin', Math.sin);
exports.sinh = makeUnaryUniversalFunction('sinh', sinhNumber);
exports.sqrt = makeUnaryUniversalFunction('sqrt', Math.sqrt);
exports.tan = makeUnaryUniversalFunction('tan', Math.tan);
exports.tanh = makeUnaryUniversalFunction('tanh', tanhNumber);
