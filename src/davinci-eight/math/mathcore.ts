let abs = Math.abs
let acos = Math.acos
let asin = Math.asin
let atan = Math.atan
let cos = Math.cos
let exp = Math.exp
let log = Math.log
let sin = Math.sin
let sqrt = Math.sqrt
let tan = Math.tan

/**
 * Determines whether a property name is callable on an object.
 */
function isCallableMethod(x: any, name: string) {
    return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function')
}

function makeUnaryUniversalFunction(methodName: string, primitiveFunction: (x: number) => number) {
    return function <T>(x: T): T {
        let something: any = x
        if (isCallableMethod(x, methodName)) {
            return something[methodName]();
        }
        else if (typeof x === 'number') {
            let n: number = something
            let thing: any = primitiveFunction(n)
            return thing
        }
        else {
            throw new TypeError("x must support " + methodName + "(x)")
        }
    }
}

function cosh(x: number): number {
    return (exp(x) + exp(-x)) / 2
}

function sinh(x: number): number {
    return (exp(x) - exp(-x)) / 2
}

function tanh(x: number): number {
    return sinh(x) / cosh(x)
}

function quad(x: number): number {
    return x * x
}

var mathcore = {
        acos: makeUnaryUniversalFunction('acos', acos),
        asin: makeUnaryUniversalFunction('asin', asin),
        atan: makeUnaryUniversalFunction('atan', atan),
        cos: makeUnaryUniversalFunction('cos', cos),
        cosh: makeUnaryUniversalFunction('cosh', cosh),
        exp: makeUnaryUniversalFunction('exp', exp),
        log: makeUnaryUniversalFunction('log', log),
        norm: makeUnaryUniversalFunction('norm', abs),
        quad: makeUnaryUniversalFunction('quad', quad),
        sin: makeUnaryUniversalFunction('sin', sin),
        sinh: makeUnaryUniversalFunction('sinh', sinh),
        sqrt: makeUnaryUniversalFunction('sqrt', sqrt),
        tan: makeUnaryUniversalFunction('tan', tan),
        tanh: makeUnaryUniversalFunction('tanh', tanh),
        // unit: makeUnaryUniversalFunction('unit', function(x: number) {return x / Math.abs(x);}),
        Math: {
            cosh: cosh,
            sinh: sinh
        }
    };

export default mathcore;
