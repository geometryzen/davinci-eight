/**
 * Determines whether a property name is callable on an object.
 */
function isCallableMethod(x: any, name: string) {
    return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
}

/**
 * Constructs a function that can apply the operator to objects that implement the operator as a method.
 * Falls back to the primitive function when the argument is a number.
 */
function makeUnaryUniversalFunction(methodName: string, primitiveFunction: (x: number) => number) {
    return function <T>(x: T): T {
        if (isCallableMethod(x, methodName)) {
            return x[methodName]();
        }
        else if (typeof x === 'number') {
            return primitiveFunction(x) as any;
        }
        else {
            throw new TypeError(`x must support ${methodName}(x)`);
        }
    };
}

function coshNumber(x: number): number {
    return (Math.exp(x) + Math.exp(-x)) / 2;
}

function sinhNumber(x: number): number {
    return (Math.exp(x) - Math.exp(-x)) / 2;
}

function tanhNumber(x: number): number {
    return sinhNumber(x) / coshNumber(x);
}

export const acos = makeUnaryUniversalFunction('acos', Math.acos);
export const asin = makeUnaryUniversalFunction('asin', Math.asin);
export const atan = makeUnaryUniversalFunction('atan', Math.atan);
export const cos = makeUnaryUniversalFunction('cos', Math.cos);
export const cosh = makeUnaryUniversalFunction('cosh', coshNumber);
export const exp = makeUnaryUniversalFunction('exp', Math.exp);
export const log = makeUnaryUniversalFunction('log', Math.log);
export const norm = makeUnaryUniversalFunction('norm', Math.abs);
export const quad = makeUnaryUniversalFunction('quad', function (x: number) { return x * x; });
export const sin = makeUnaryUniversalFunction('sin', Math.sin);
export const sinh = makeUnaryUniversalFunction('sinh', sinhNumber);
export const sqrt = makeUnaryUniversalFunction('sqrt', Math.sqrt);
export const tan = makeUnaryUniversalFunction('tan', Math.tan);
export const tanh = makeUnaryUniversalFunction('tanh', tanhNumber);
