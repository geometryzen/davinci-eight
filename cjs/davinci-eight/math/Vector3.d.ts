declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    add(v: Vector3): Vector3;
    applyQuaternion(q: {
        x: number;
        y: number;
        z: number;
        w: number;
    }): Vector3;
    copy(v: Vector3): Vector3;
    cross(v: Vector3): Vector3;
    divideScalar(scalar: number): Vector3;
    length(): number;
    normalize(): Vector3;
    sub(v: Vector3): Vector3;
    subVectors(a: Vector3, b: Vector3): Vector3;
    clone(): Vector3;
}
export = Vector3;
