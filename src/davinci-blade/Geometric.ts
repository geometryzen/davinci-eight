import Field = require('davinci-blade/Field');

interface Geometric<T> extends Field<T> {
    scalarMultiply(rhs: number): T;
    wedge(rhs: T): T;
    lshift(rhs: T): T;
    rshift(rhs: T): T;
    norm(): T;
    quad(): T;
}

export = Geometric;
