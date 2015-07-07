declare class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number);
    sub(v: Vector3): Vector3;
    cross(v: Vector3): Vector3;
    length(): number;
    divideScalar(scalar: number): Vector3;
    clone(): Vector3;
}
export = Vector3;
