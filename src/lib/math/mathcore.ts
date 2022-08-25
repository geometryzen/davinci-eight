/**
 * Determines whether a property name is callable on an object.
 * @hidden
 */
function isCallableMethod(x: any, name: string) {
    return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
}

/**
 * Constructs a function that can apply the operator to objects that implement the operator as a method.
 * Falls back to the primitive function when the argument is a number.
 * @hidden
 */
function makeUnaryUniversalFunction(methodName: string, primitiveFunction: (x: number) => number) {
    return function <T>(x: T): T {
        if (isCallableMethod(x, methodName)) {
            return (x as any)[methodName]();
        }
        else if (typeof x === 'number') {
            return primitiveFunction(x) as any;
        }
        else {
            throw new TypeError(`x must support ${methodName}(x)`);
        }
    };
}

/**
 * @hidden
 */
function coshNumber(x: number): number {
    return (Math.exp(x) + Math.exp(-x)) / 2;
}

/**
 * @hidden
 */
function sinhNumber(x: number): number {
    return (Math.exp(x) - Math.exp(-x)) / 2;
}

/**
 * @hidden
 */
function tanhNumber(x: number): number {
    return sinhNumber(x) / coshNumber(x);
}

/**
 * @hidden
 */
export const acos = makeUnaryUniversalFunction('acos', Math.acos);
/**
 * @hidden
 */
export const asin = makeUnaryUniversalFunction('asin', Math.asin);
/**
 * @hidden
 */
export const atan = makeUnaryUniversalFunction('atan', Math.atan);
/**
 * @hidden
 */
export const cos = makeUnaryUniversalFunction('cos', Math.cos);
/**
 * @hidden
 */
export const cosh = makeUnaryUniversalFunction('cosh', coshNumber);
/**
 * @hidden
 */
export const exp = makeUnaryUniversalFunction('exp', Math.exp);
/**
 * @hidden
 */
export const log = makeUnaryUniversalFunction('log', Math.log);
/**
 * @hidden
 */
export const norm = makeUnaryUniversalFunction('norm', Math.abs);
/**
 * @hidden
 */
export const quad = makeUnaryUniversalFunction('quad', function (x: number) { return x * x; });
/**
 * @hidden
 */
export const sin = makeUnaryUniversalFunction('sin', Math.sin);
/**
 * @hidden
 */
export const sinh = makeUnaryUniversalFunction('sinh', sinhNumber);
/**
 * @hidden
 */
export const sqrt = makeUnaryUniversalFunction('sqrt', Math.sqrt);
/**
 * @hidden
 */
export const tan = makeUnaryUniversalFunction('tan', Math.tan);
/**
 * @hidden
 */
export const tanh = makeUnaryUniversalFunction('tanh', tanhNumber);
