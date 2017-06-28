import { SpinorE3 } from './SpinorE3';
import { VectorE3 } from './VectorE3';
/**
 * A vector with cartesian coordinates and immutable.
 */
export interface R3 extends VectorE3 {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    add(rhs: VectorE3): Readonly<R3>;
    cross(rhs: VectorE3): Readonly<R3>;
    /**
     * Returns the unit vector for this vector.
     * Returns undefined if the magnitude is zero.
     */
    direction(): Readonly<R3>;
    dot(rhs: VectorE3): number;
    magnitude(): number;
    projectionOnto(direction: VectorE3): Readonly<R3>;
    rejectionFrom(direction: VectorE3): Readonly<R3>;
    rotate(R: SpinorE3): Readonly<R3>;
    scale(α: number): Readonly<R3>;
    sub(rhs: VectorE3): Readonly<R3>;
    toString(): string;
    __add__(rhs: VectorE3): Readonly<R3>;
    __radd__(lhs: VectorE3): Readonly<R3>;
    __sub__(rhs: VectorE3): Readonly<R3>;
    __rsub__(lhs: VectorE3): Readonly<R3>;
    __mul__(rhs: number): Readonly<R3>;
    __rmul__(lhs: number): Readonly<R3>;
    __pos__(): Readonly<R3>;
    __neg__(): Readonly<R3>;
}
/**
 *
 */
export declare function vectorCopy(vector: VectorE3): Readonly<R3>;
export declare function vectorFromCoords(x: number, y: number, z: number): Readonly<R3>;
export declare function vec(x: number, y: number, z: number): Readonly<R3>;
