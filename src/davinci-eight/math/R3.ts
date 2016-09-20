import VectorE3 from './VectorE3';
import wedgeXY from './wedgeXY';
import wedgeYZ from './wedgeYZ';
import wedgeZX from './wedgeZX';

export interface R3 extends VectorE3 {
    cross(rhs: VectorE3): R3;
    direction(): R3;
    scale(α: number): R3;
    sub(rhs: VectorE3): R3;
}

export default function vec(x: number, y: number, z: number): R3 {
    const scale = function (α: number): R3 {
        return vec(α * x, α * y, α * z);
    }
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
        cross(rhs: VectorE3): R3 {
            const x = wedgeYZ(that.x, that.y, that.z, rhs.x, rhs.y, rhs.z);
            const y = wedgeZX(that.x, that.y, that.z, rhs.x, rhs.y, rhs.z);
            const z = wedgeXY(that.x, that.y, that.z, rhs.x, rhs.y, rhs.z);
            return vec(x, y, z);
        },
        direction(): R3 {
            const x = that.x;
            const y = that.y;
            const z = that.z;
            const magnitude = Math.sqrt(x * x + y * y + z * z);
            return vec(x / magnitude, y / magnitude, z / magnitude);
        },
        scale,
        sub(rhs: VectorE3): R3 {
            return vec(that.x - rhs.x, that.y - rhs.y, that.z - rhs.z);
        }
    };
    return that;
}
