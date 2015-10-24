import LinearOperators = require('../math/LinearOperators');
/**
 *
 */
interface GeometricOperators<T> extends LinearOperators<T> {
    __mul__(other: any): T;
    __div__(other: any): T;
}
export = GeometricOperators;
