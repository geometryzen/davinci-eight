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
export var acos = makeUnaryUniversalFunction('acos', Math.acos);
export var asin = makeUnaryUniversalFunction('asin', Math.asin);
export var atan = makeUnaryUniversalFunction('atan', Math.atan);
export var cos = makeUnaryUniversalFunction('cos', Math.cos);
export var cosh = makeUnaryUniversalFunction('cosh', coshNumber);
export var exp = makeUnaryUniversalFunction('exp', Math.exp);
export var log = makeUnaryUniversalFunction('log', Math.log);
export var norm = makeUnaryUniversalFunction('norm', Math.abs);
export var quad = makeUnaryUniversalFunction('quad', function (x) { return x * x; });
export var sin = makeUnaryUniversalFunction('sin', Math.sin);
export var sinh = makeUnaryUniversalFunction('sinh', sinhNumber);
export var sqrt = makeUnaryUniversalFunction('sqrt', Math.sqrt);
export var tan = makeUnaryUniversalFunction('tan', Math.tan);
export var tanh = makeUnaryUniversalFunction('tanh', tanhNumber);
