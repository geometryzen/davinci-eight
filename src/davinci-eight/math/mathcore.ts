
/**
 * Determines whether a property name is callable on an object.
 */
function isCallableMethod(x: any, name: string) {
  return (x !== null) && (typeof x === 'object') && (typeof x[name] === 'function');
}

function makeUnaryUniversalFunction(methodName: string, primitiveFunction: (x: number)=>number) {
  return function <T>(x: T): T {
    if (isCallableMethod(x, methodName)) {
      let someting: any = x;
      return something[methodName]();
    }
    else if (typeof x === 'number') {
      var something: any = x;
      var n: number = something;
      var thing: any = primitiveFunction(n);
      return thing;
    }
    else {
      throw new TypeError("x must support " + methodName + "(x)");
    }
  }
}

function cosh(x: number): number {
  return (Math.exp(x) + Math.exp(-x)) / 2;
}

function sinh(x: number): number {
  return (Math.exp(x) - Math.exp(-x)) / 2;
}

var mathcore =
{
    VERSION: '1.7.2',
    cos:  makeUnaryUniversalFunction('cos', Math.cos),
    cosh: makeUnaryUniversalFunction('cosh', cosh),
    exp:  makeUnaryUniversalFunction('exp', Math.exp),
    norm: makeUnaryUniversalFunction('norm', function(x: number) {return Math.abs(x);}),
    quad: makeUnaryUniversalFunction('quad', function(x: number) {return x * x;}),
    sin:  makeUnaryUniversalFunction('sin', Math.sin),
    sinh: makeUnaryUniversalFunction('sinh', sinh),
    sqrt: makeUnaryUniversalFunction('sqrt', Math.sqrt),
    unit: makeUnaryUniversalFunction('unit', function(x: number) {return x / Math.abs(x);}),
    Math: {
      cosh: cosh,
      sinh: sinh
    }
};

export = mathcore;
