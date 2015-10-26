import LinearOperators = require('../math/LinearOperators');
/**
 *
 */
interface GeometricOperators<T> extends LinearOperators<T> {
    __mul__(other: any): T;
    __rmul__(other: any): T;
    __div__(other: any): T;
    __vbar__(other: any): T;
    __wedge__(other: any): T;
    __rwedge__(other: any): T;
    __lshift__(other: any): T;
    __rshift__(other: any): T;
}
export = GeometricOperators;
