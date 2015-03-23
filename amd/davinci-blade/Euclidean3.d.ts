declare class Euclidean3 {
    w: number;
    x: number;
    y: number;
    z: number;
    xy: number;
    yz: number;
    zx: number;
    xyz: number;
    /**
     * The Euclidean3 class represents a multivector for a 3-dimensional linear space with a Euclidean metric.
     *
     * @class Euclidean3
     * @constructor
     * @param {number} w The scalar part of the multivector.
     * @param {number} x The vector component of the multivector in the x-direction.
     * @param {number} y The vector component of the multivector in the y-direction.
     * @param {number} z The vector component of the multivector in the z-direction.
     * @param {number} xy The bivector component of the multivector in the xy-plane.
     * @param {number} yz The bivector component of the multivector in the yz-plane.
     * @param {number} zx The bivector component of the multivector in the zx-plane.
     * @param {number} xyz The pseudoscalar part of the multivector.
     */
    constructor(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number);
    static fromCartesian(w: number, x: number, y: number, z: number, xy: number, yz: number, zx: number, xyz: number): Euclidean3;
    coordinates(): number[];
    coordinate(index: number): number;
    add(rhs: Euclidean3): Euclidean3;
    __add__(other: any): Euclidean3;
    __radd__(other: any): Euclidean3;
    sub(rhs: Euclidean3): Euclidean3;
    __sub__(other: any): Euclidean3;
    __rsub__(other: any): Euclidean3;
    mul(rhs: any): Euclidean3;
    __mul__(other: any): any;
    __rmul__(other: any): any;
    scalarMultiply(rhs: number): Euclidean3;
    div(rhs: any): Euclidean3;
    __div__(other: any): Euclidean3;
    __rdiv__(other: any): Euclidean3;
    wedge(rhs: Euclidean3): Euclidean3;
    __wedge__(other: any): Euclidean3;
    __rwedge__(other: any): Euclidean3;
    lshift(rhs: Euclidean3): Euclidean3;
    __lshift__(other: any): Euclidean3;
    __rlshift__(other: any): Euclidean3;
    rshift(rhs: Euclidean3): Euclidean3;
    __rshift__(other: any): Euclidean3;
    __rrshift__(other: any): Euclidean3;
    __pos__(): Euclidean3;
    __neg__(): Euclidean3;
    grade(index: number): Euclidean3;
    dot(vector: Euclidean3): number;
    cross(vector: Euclidean3): Euclidean3;
    length(): number;
    norm(): Euclidean3;
    quad(): Euclidean3;
    sqrt(): Euclidean3;
    toString(): string;
    toStringIJK(): string;
    toStringLATEX(): string;
}
export = Euclidean3;
