import { mustBeNumber } from '../checks/mustBeNumber';
import { SpinorE3 } from './SpinorE3';
import { VectorE3 } from './VectorE3';
import { wedgeXY } from './wedgeXY';
import { wedgeYZ } from './wedgeYZ';
import { wedgeZX } from './wedgeZX';

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
export function vectorCopy(vector: VectorE3): Readonly<R3> {
    return vec(vector.x, vector.y, vector.z);
}

export function vectorFromCoords(x: number, y: number, z: number): Readonly<R3> {
    return vec(x, y, z);
}

export function vec(x: number, y: number, z: number): Readonly<R3> {
    const dot = function dot(rhs: VectorE3) {
        return x * rhs.x + y * rhs.y + z * rhs.z;
    };
    const magnitude = function (): number {
        return Math.sqrt(x * x + y * y + z * z);
    };
    const projectionOnto = function projectionOnto(b: VectorE3): Readonly<R3> {
        const bx = b.x;
        const by = b.y;
        const bz = b.z;
        const scp = x * bx + y * by + z * bz;
        const quad = bx * bx + by * by + bz * bz;
        const k = scp / quad;
        return vec(k * bx, k * by, k * bz);
    };
    const rejectionFrom = function rejectionFrom(b: VectorE3): Readonly<R3> {
        const bx = b.x;
        const by = b.y;
        const bz = b.z;
        const scp = x * bx + y * by + z * bz;
        const quad = bx * bx + by * by + bz * bz;
        const k = scp / quad;
        return vec(x - k * bx, y - k * by, z - k * bz);
    };
    const rotate = function rotate(R: SpinorE3): Readonly<R3> {
        const a = R.xy;
        const b = R.yz;
        const c = R.zx;
        const α = R.a;

        const ix = α * x - c * z + a * y;
        const iy = α * y - a * x + b * z;
        const iz = α * z - b * y + c * x;
        const iα = b * x + c * y + a * z;

        return vec(
            ix * α + iα * b + iy * a - iz * c,
            iy * α + iα * c + iz * b - ix * a,
            iz * α + iα * a + ix * c - iy * b);
    };
    const scale = function scale(α: number): Readonly<R3> {
        return vec(α * x, α * y, α * z);
    };
    const that: R3 = {
        get x() {
            return x;
        },
        get y() {
            return y;
        },
        get z() {
            return z;
        },
        add(rhs: VectorE3): Readonly<R3> {
            return vec(x + rhs.x, y + rhs.y, z + rhs.z);
        },
        cross(rhs: VectorE3): Readonly<R3> {
            const yz = wedgeYZ(x, y, z, rhs.x, rhs.y, rhs.z);
            const zx = wedgeZX(x, y, z, rhs.x, rhs.y, rhs.z);
            const xy = wedgeXY(x, y, z, rhs.x, rhs.y, rhs.z);
            return vec(yz, zx, xy);
        },
        direction(): Readonly<R3> {
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            if (magnitude !== 0) {
                return vec(x / magnitude, y / magnitude, z / magnitude);
            }
            else {
                // direction is ambiguous (undefined) for the zero vector.
                return void 0;
            }
        },
        dot,
        magnitude,
        projectionOnto,
        rejectionFrom,
        rotate,
        scale,
        sub(rhs: VectorE3): Readonly<R3> {
            return vec(x - rhs.x, y - rhs.y, z - rhs.z);
        },
        __add__(rhs: VectorE3): Readonly<R3> {
            return vec(x + rhs.x, y + rhs.y, z + rhs.z);
        },
        __radd__(lhs: VectorE3): Readonly<R3> {
            return vec(lhs.x + x, lhs.y + y, lhs.z + z);
        },
        __sub__(rhs: VectorE3): Readonly<R3> {
            return vec(x - rhs.x, y - rhs.y, z - rhs.z);
        },
        __rsub__(lhs: VectorE3): Readonly<R3> {
            return vec(lhs.x - x, lhs.y - y, lhs.z - z);
        },
        __mul__(rhs: number): Readonly<R3> {
            mustBeNumber('rhs', rhs);
            return vec(x * rhs, y * rhs, z * rhs);
        },
        __rmul__(lhs: number): Readonly<R3> {
            mustBeNumber('lhs', lhs);
            return vec(lhs * x, lhs * y, lhs * z);
        },
        __pos__(): Readonly<R3> {
            return that;
        },
        __neg__(): Readonly<R3> {
            return vec(-x, -y, -z);
        },
        toString(): string {
            return `[${x}, ${y}, ${z}]`;
        }
    };
    return Object.freeze(that);
}
