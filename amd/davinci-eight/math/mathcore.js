define(["require", "exports"], function (require, exports) {
    /**
     * Determines whether a property name is callable on an object.
     */
    function isCallableMethod(x, name) {
        return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
    }
    function makeUnaryUniversalFunction(methodName, primitiveFunction) {
        return function (x) {
            if (isCallableMethod(x, methodName)) {
                var someting = x;
                return something[methodName]();
            }
            else if (typeof x === 'number') {
                var something = x;
                var n = something;
                var thing = primitiveFunction(n);
                return thing;
            }
            else {
                throw new TypeError("x must support " + methodName + "(x)");
            }
        };
    }
    function cosh(x) {
        return (Math.exp(x) + Math.exp(-x)) / 2;
    }
    function sinh(x) {
        return (Math.exp(x) - Math.exp(-x)) / 2;
    }
    var mathcore = {
        VERSION: '1.7.2',
        cos: makeUnaryUniversalFunction('cos', Math.cos),
        cosh: makeUnaryUniversalFunction('cosh', cosh),
        exp: makeUnaryUniversalFunction('exp', Math.exp),
        norm: makeUnaryUniversalFunction('norm', function (x) { return Math.abs(x); }),
        quad: makeUnaryUniversalFunction('quad', function (x) { return x * x; }),
        sin: makeUnaryUniversalFunction('sin', Math.sin),
        sinh: makeUnaryUniversalFunction('sinh', sinh),
        sqrt: makeUnaryUniversalFunction('sqrt', Math.sqrt),
        unit: makeUnaryUniversalFunction('unit', function (x) { return x / Math.abs(x); }),
        Math: {
            cosh: cosh,
            sinh: sinh
        }
    };
    return mathcore;
});
