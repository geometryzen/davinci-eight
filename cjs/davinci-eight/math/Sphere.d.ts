import Vector3 = require('../math/Vector3');
declare class Sphere {
    center: Vector3;
    radius: number;
    constructor(center?: Vector3, radius?: number);
    setFromPoints(points: Vector3[]): void;
}
export = Sphere;
