/**
 * Determines whether a property name is callable on an object.
 * @hidden
 */
function isCallableMethod(x, name) {
    return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
}
/**
 * Constructs a function that can apply the operator to objects that implement the operator as a method.
 * Falls back to the primitive function when the argument is a number.
 * @hidden
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
/**
 * @hidden
 */
function coshNumber(x) {
    return (Math.exp(x) + Math.exp(-x)) / 2;
}
/**
 * @hidden
 */
function sinhNumber(x) {
    return (Math.exp(x) - Math.exp(-x)) / 2;
}
/**
 * @hidden
 */
function tanhNumber(x) {
    return sinhNumber(x) / coshNumber(x);
}
/**
 * @hidden
 */
export var acos = makeUnaryUniversalFunction('acos', Math.acos);
/**
 * @hidden
 */
export var asin = makeUnaryUniversalFunction('asin', Math.asin);
/**
 * @hidden
 */
export var atan = makeUnaryUniversalFunction('atan', Math.atan);
/**
 * @hidden
 */
export var cos = makeUnaryUniversalFunction('cos', Math.cos);
/**
 * @hidden
 */
export var cosh = makeUnaryUniversalFunction('cosh', coshNumber);
/**
 * @hidden
 */
export var exp = makeUnaryUniversalFunction('exp', Math.exp);
/**
 * @hidden
 */
export var log = makeUnaryUniversalFunction('log', Math.log);
/**
 * @hidden
 */
export var norm = makeUnaryUniversalFunction('norm', Math.abs);
/**
 * @hidden
 */
export var quad = makeUnaryUniversalFunction('quad', function (x) { return x * x; });
/**
 * @hidden
 */
export var sin = makeUnaryUniversalFunction('sin', Math.sin);
/**
 * @hidden
 */
export var sinh = makeUnaryUniversalFunction('sinh', sinhNumber);
/**
 * @hidden
 */
export var sqrt = makeUnaryUniversalFunction('sqrt', Math.sqrt);
/**
 * @hidden
 */
export var tan = makeUnaryUniversalFunction('tan', Math.tan);
/**
 * @hidden
 */
export var tanh = makeUnaryUniversalFunction('tanh', tanhNumber);
