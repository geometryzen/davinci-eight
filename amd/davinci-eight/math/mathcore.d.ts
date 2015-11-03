declare var mathcore: {
    acos: <T>(x: T) => T;
    asin: <T>(x: T) => T;
    atan: <T>(x: T) => T;
    cos: <T>(x: T) => T;
    cosh: <T>(x: T) => T;
    exp: <T>(x: T) => T;
    log: <T>(x: T) => T;
    norm: <T>(x: T) => T;
    quad: <T>(x: T) => T;
    sin: <T>(x: T) => T;
    sinh: <T>(x: T) => T;
    sqrt: <T>(x: T) => T;
    tan: <T>(x: T) => T;
    tanh: <T>(x: T) => T;
    Math: {
        cosh: (x: number) => number;
        sinh: (x: number) => number;
    };
};
export = mathcore;
