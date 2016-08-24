import VectorE3 from './VectorE3';

export interface R3 extends VectorE3 {
    scale(α: number): R3;
}

export default function vec(x: number, y: number, z: number): R3 {
    const scale = function(α: number): R3 {
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
        scale
    };
    return that;
}
