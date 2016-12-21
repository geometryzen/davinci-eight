import VectorE3 from './VectorE3';
import wedgeXY from './wedgeXY';
import wedgeYZ from './wedgeYZ';
import wedgeZX from './wedgeZX';

/**
 * A vector with cartesian coordinates and immutable.
 */
export interface R3 extends VectorE3 {
    readonly x: number;
    readonly y: number;
    readonly z: number;
    add(rhs: VectorE3): R3;
    cross(rhs: VectorE3): R3;
    direction(): R3;
    projectionOnto(direction: VectorE3): R3;
    rejectionFrom(direction: VectorE3): R3;
    scale(α: number): R3;
    sub(rhs: VectorE3): R3;
}

/**
 * 
 */
export function vectorCopy(vector: VectorE3): R3 {
    return vec(vector.x, vector.y, vector.z);
}

export function vectorFromCoords(x: number, y: number, z: number): R3 {
    return vec(x, y, z);
}

export default function vec(x: number, y: number, z: number): R3 {
    const projectionOnto = function projectionOnto(b: VectorE3): R3 {
        const bx = b.x;
        const by = b.y;
        const bz = b.z;
        const scp = x * bx + y * by + z * bz;
        const quad = bx * bx + by * by + bz * bz;
        const k = scp / quad;
        return vec(k * bx, k * by, k * bz);
    };
    const rejectionFrom = function rejectionFrom(b: VectorE3): R3 {
        const bx = b.x;
        const by = b.y;
        const bz = b.z;
        const scp = x * bx + y * by + z * bz;
        const quad = bx * bx + by * by + bz * bz;
        const k = scp / quad;
        return vec(x - k * bx, y - k * by, z - k * bz);
    };
    const scale = function scale(α: number): R3 {
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
        add(rhs: VectorE3): R3 {
            return vec(x + rhs.x, y + rhs.y, z + rhs.z);
        },
        cross(rhs: VectorE3): R3 {
            const yz = wedgeYZ(x, y, z, rhs.x, rhs.y, rhs.z);
            const zx = wedgeZX(x, y, z, rhs.x, rhs.y, rhs.z);
            const xy = wedgeXY(x, y, z, rhs.x, rhs.y, rhs.z);
            return vec(yz, zx, xy);
        },
        direction(): R3 {
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            return vec(x / magnitude, y / magnitude, z / magnitude);
        },
        projectionOnto,
        rejectionFrom,
        scale,
        sub(rhs: VectorE3): R3 {
            return vec(x - rhs.x, y - rhs.y, z - rhs.z);
        },
        toString(): string {
            return `[${x}, ${y}, ${z}]`;
        }
    };
    return that;
}
